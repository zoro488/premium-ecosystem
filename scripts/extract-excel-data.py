#!/usr/bin/env python3
"""
Script para extraer TODOS los datos del Excel y generar FlowDistributorData.js / .json
Autor: Sistema FlowDistributor
Fecha: 2025-10-23
Mejoras: acepta argumento de ruta, salida JSON y JS/TS, manejo de errores reforzado.
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd

# Valores por defecto
DEFAULT_EXCEL_PATH = r"C:\Users\xpovo\Downloads\Copia de Administación_General.xlsx"
DEFAULT_OUTPUT_DIR = (
    r"C:\Users\xpovo\Documents\premium-ecosystem\src\apps\FlowDistributor\data"
)


def parse_date(date_val: Any) -> Optional[str]:
    """Convierte fechas de Excel a formato ISO"""
    if pd.isna(date_val):
        return None
    try:
        if isinstance(date_val, str):
            parsed = pd.to_datetime(date_val, errors="coerce")
            if pd.isna(parsed):
                # intentar formatos comunes
                for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%m/%d/%Y"):
                    try:
                        return datetime.strptime(date_val, fmt).strftime("%Y-%m-%d")
                    except Exception:
                        continue
                return date_val
            return parsed.strftime("%Y-%m-%d")
        if isinstance(date_val, (pd.Timestamp, datetime)):
            return date_val.strftime("%Y-%m-%d")
        return str(date_val)
    except Exception as e:
        print(f"⚠️  Error parseando fecha {date_val}: {e}")
        return str(date_val) if date_val else None


def parse_number(val: Any) -> float:
    """Convierte números de Excel a float seguro"""
    if pd.isna(val):
        return 0.0
    try:
        if isinstance(val, str):
            val = val.replace(",", "").replace("$", "").strip()
            if val == "":
                return 0.0
        return float(val)
    except (ValueError, TypeError) as e:
        print(f"⚠️  Error parseando número {val}: {e}")
        return 0.0


def safe_get_cell(df: pd.DataFrame, row: int, col: int, default: Any = None) -> Any:
    """Obtiene valor de celda de forma segura"""
    try:
        if row >= len(df) or col >= len(df.columns):
            return default
        val = df.iloc[row, col]
        return val if not pd.isna(val) else default
    except (IndexError, KeyError):
        return default


# Las funciones extract_* se mantienen pero con chequeos de existencia de hoja


def extract_distribuidores(xl_file: pd.ExcelFile) -> Dict[str, List[Dict]]:
    try:
        if "Distribuidores" not in xl_file.sheet_names:
            return {"ordenesCompra": [], "distribuidores": []}
        df = pd.read_excel(xl_file, sheet_name="Distribuidores", header=None)
        print(f"   📄 Distribuidores - Dimensiones: {df.shape}")

        oc_data = []
        for i in range(2, min(len(df), 10000)):
            oc_id = safe_get_cell(df, i, 0)
            if not oc_id or pd.isna(oc_id):
                continue

            oc = {
                "id": str(oc_id).strip(),
                "fecha": parse_date(safe_get_cell(df, i, 1)),
                "origen": str(safe_get_cell(df, i, 2, "")).strip(),
                "cantidad": parse_number(safe_get_cell(df, i, 3)),
                "costoDistribuidor": parse_number(safe_get_cell(df, i, 4)),
                "costoTransporte": parse_number(safe_get_cell(df, i, 5)),
                "costoPorUnidad": parse_number(safe_get_cell(df, i, 6)),
                "stockActual": parse_number(safe_get_cell(df, i, 7)),
                "costoTotal": parse_number(safe_get_cell(df, i, 8)),
                "pagoDistribuidor": parse_number(safe_get_cell(df, i, 9)),
                "deuda": parse_number(safe_get_cell(df, i, 10)),
            }
            oc_data.append(oc)

        distribuidores_data = []
        for i in range(2, min(len(df), 10000)):
            nombre = safe_get_cell(df, i, 12)
            if not nombre or pd.isna(nombre):
                continue

            dist = {
                "nombre": str(nombre).strip(),
                "costoTotal": parse_number(safe_get_cell(df, i, 13)),
                "abonos": parse_number(safe_get_cell(df, i, 14)),
                "pendiente": parse_number(safe_get_cell(df, i, 15)),
            }
            distribuidores_data.append(dist)

        return {"ordenesCompra": oc_data, "distribuidores": distribuidores_data}
    except Exception as e:
        print(f"❌ Error en extract_distribuidores: {e}")
        return {"ordenesCompra": [], "distribuidores": []}


def extract_control_maestro(xl_file: pd.ExcelFile) -> Dict[str, List[Dict]]:
    try:
        if "Control_Maestro" not in xl_file.sheet_names:
            return {"ventasLocales": [], "rfActual": [], "gastosYAbonos": []}
        df = pd.read_excel(xl_file, sheet_name="Control_Maestro", header=None)
        print(f"   📄 Control_Maestro - Dimensiones: {df.shape}")

        ventas_data = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 0)
            if not fecha or pd.isna(fecha):
                continue

            venta = {
                "fecha": parse_date(fecha),
                "ocRelacionada": str(safe_get_cell(df, i, 1, "")).strip(),
                "cantidad": parse_number(safe_get_cell(df, i, 2)),
                "cliente": str(safe_get_cell(df, i, 3, "")).strip(),
                "bovedaMonte": parse_number(safe_get_cell(df, i, 4)),
                "precioVenta": parse_number(safe_get_cell(df, i, 5)),
                "ingreso": parse_number(safe_get_cell(df, i, 6)),
                "flete": str(safe_get_cell(df, i, 7, "")).strip(),
                "fleteUtilidad": parse_number(safe_get_cell(df, i, 8)),
                "utilidad": parse_number(safe_get_cell(df, i, 9)),
                "estatus": str(safe_get_cell(df, i, 10, "")).strip(),
                "concepto": str(safe_get_cell(df, i, 11, "")).strip(),
            }
            ventas_data.append(venta)

        rf_data = []
        for i in range(2, min(len(df), 10000)):
            panel = safe_get_cell(df, i, 12)
            if not panel or pd.isna(panel):
                continue

            rf = {
                "panel": str(panel).strip(),
                "rfActual": parse_number(safe_get_cell(df, i, 13)),
            }
            rf_data.append(rf)

        gya_data = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 14)
            if not fecha or pd.isna(fecha):
                continue

            gya = {
                "fecha": parse_date(fecha),
                "origen": str(safe_get_cell(df, i, 15, "")).strip(),
                "valor": parse_number(safe_get_cell(df, i, 16)),
                "tc": parse_number(safe_get_cell(df, i, 17)),
                "pesos": parse_number(safe_get_cell(df, i, 18)),
                "destino": str(safe_get_cell(df, i, 19, "")).strip(),
                "concepto": str(safe_get_cell(df, i, 20, "")).strip(),
                "observaciones": str(safe_get_cell(df, i, 21, "")).strip(),
            }
            gya_data.append(gya)

        return {
            "ventasLocales": ventas_data,
            "rfActual": rf_data,
            "gastosYAbonos": gya_data,
        }
    except Exception as e:
        print(f"❌ Error en extract_control_maestro: {e}")
        return {"ventasLocales": [], "rfActual": [], "gastosYAbonos": []}


def extract_almacen_monte(xl_file: pd.ExcelFile) -> Dict[str, List[Dict]]:
    try:
        if "Almacen_Monte" not in xl_file.sheet_names:
            return {"ingresos": [], "rfCortes": [], "salidas": []}
        df = pd.read_excel(xl_file, sheet_name="Almacen_Monte", header=None)
        print(f"   📄 Almacen_Monte - Dimensiones: {df.shape}")

        ingresos = []
        for i in range(2, min(len(df), 10000)):
            oc = safe_get_cell(df, i, 0)
            if not oc or pd.isna(oc):
                continue

            ing = {
                "oc": str(oc).strip(),
                "cliente": str(safe_get_cell(df, i, 1, "")).strip(),
                "distribuidor": str(safe_get_cell(df, i, 2, "")).strip(),
                "cantidad": parse_number(safe_get_cell(df, i, 3)),
            }
            ingresos.append(ing)

        rf_cortes = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 4)
            if not fecha or pd.isna(fecha):
                continue

            corte = {
                "fecha": parse_date(fecha),
                "corte": parse_number(safe_get_cell(df, i, 5)),
            }
            rf_cortes.append(corte)

        salidas = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 6)
            if not fecha or pd.isna(fecha):
                continue

            sal = {
                "fecha": parse_date(fecha),
                "cliente": str(safe_get_cell(df, i, 7, "")).strip(),
                "cantidad": parse_number(safe_get_cell(df, i, 8)),
                "concepto": str(safe_get_cell(df, i, 9, "")).strip(),
                "observaciones": str(safe_get_cell(df, i, 10, "")).strip(),
            }
            salidas.append(sal)

        return {"ingresos": ingresos, "rfCortes": rf_cortes, "salidas": salidas}
    except Exception as e:
        print(f"❌ Error en extract_almacen_monte: {e}")
        return {"ingresos": [], "rfCortes": [], "salidas": []}


def extract_boveda_monte(xl_file: pd.ExcelFile) -> Dict[str, List[Dict]]:
    try:
        if (
            "Bóveda_Monte" not in xl_file.sheet_names
            and "Boveda_Monte" not in xl_file.sheet_names
        ):
            return {"ingresos": [], "rfCortes": [], "gastos": []}
        sheet_name = (
            "Bóveda_Monte" if "Bóveda_Monte" in xl_file.sheet_names else "Boveda_Monte"
        )
        df = pd.read_excel(xl_file, sheet_name=sheet_name, header=None)
        print(f"   📄 {sheet_name} - Dimensiones: {df.shape}")

        ingresos = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 0)
            if not fecha or pd.isna(fecha):
                continue

            ing = {
                "fecha": parse_date(fecha),
                "cliente": str(safe_get_cell(df, i, 1, "")).strip(),
                "ingreso": parse_number(safe_get_cell(df, i, 2)),
                "concepto": str(safe_get_cell(df, i, 3, "")).strip(),
            }
            ingresos.append(ing)

        rf_cortes = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 4)
            if not fecha or pd.isna(fecha):
                continue

            corte = {
                "fecha": parse_date(fecha),
                "corte": parse_number(safe_get_cell(df, i, 5)),
            }
            rf_cortes.append(corte)

        gastos = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 6)
            if not fecha or pd.isna(fecha):
                continue

            gasto = {
                "fecha": parse_date(fecha),
                "origen": str(safe_get_cell(df, i, 7, "")).strip(),
                "gasto": parse_number(safe_get_cell(df, i, 8)),
                "tc": parse_number(safe_get_cell(df, i, 9)),
                "pesos": parse_number(safe_get_cell(df, i, 10)),
                "destino": str(safe_get_cell(df, i, 11, "")).strip(),
                "concepto": str(safe_get_cell(df, i, 12, "")).strip(),
                "observaciones": str(safe_get_cell(df, i, 13, "")).strip(),
            }
            gastos.append(gasto)

        return {"ingresos": ingresos, "rfCortes": rf_cortes, "gastos": gastos}
    except Exception as e:
        print(f"❌ Error en extract_boveda_monte: {e}")
        return {"ingresos": [], "rfCortes": [], "gastos": []}


def extract_boveda_usa(xl_file: pd.ExcelFile) -> Dict[str, List[Dict]]:
    try:
        if (
            "Bóveda_USA" not in xl_file.sheet_names
            and "Boveda_USA" not in xl_file.sheet_names
        ):
            return {"ingresos": [], "rfCortes": [], "gastos": []}
        sheet_name = (
            "Bóveda_USA" if "Bóveda_USA" in xl_file.sheet_names else "Boveda_USA"
        )
        df = pd.read_excel(xl_file, sheet_name=sheet_name, header=None)
        print(f"   📄 {sheet_name} - Dimensiones: {df.shape}")

        ingresos = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 0)
            if not fecha or pd.isna(fecha):
                continue

            ing = {
                "fecha": parse_date(fecha),
                "cliente": str(safe_get_cell(df, i, 1, "")).strip(),
                "ingreso": parse_number(safe_get_cell(df, i, 2)),
                "tc": parse_number(safe_get_cell(df, i, 3)),
                "pesos": parse_number(safe_get_cell(df, i, 4)),
                "destino": str(safe_get_cell(df, i, 5, "")).strip(),
                "concepto": str(safe_get_cell(df, i, 6, "")).strip(),
                "observaciones": str(safe_get_cell(df, i, 7, "")).strip(),
            }
            ingresos.append(ing)

        rf_cortes = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 8)
            if not fecha or pd.isna(fecha):
                continue

            corte = {
                "fecha": parse_date(fecha),
                "corte": parse_number(safe_get_cell(df, i, 9)),
            }
            rf_cortes.append(corte)

        gastos = []
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 10)
            if not fecha or pd.isna(fecha):
                continue

            gasto = {
                "fecha": parse_date(fecha),
                "origen": str(safe_get_cell(df, i, 11, "")).strip(),
                "gasto": parse_number(safe_get_cell(df, i, 12)),
                "tc": parse_number(safe_get_cell(df, i, 13)),
                "pesos": parse_number(safe_get_cell(df, i, 14)),
                "destino": str(safe_get_cell(df, i, 15, "")).strip(),
                "concepto": str(safe_get_cell(df, i, 16, "")).strip(),
                "observaciones": str(safe_get_cell(df, i, 17, "")).strip(),
            }
            gastos.append(gasto)

        return {"ingresos": ingresos, "rfCortes": rf_cortes, "gastos": gastos}
    except Exception as e:
        print(f"❌ Error en extract_boveda_usa: {e}")
        return {"ingresos": [], "rfCortes": [], "gastos": []}


def extract_flete_sur(xl_file: pd.ExcelFile) -> Dict[str, List[Dict]]:
    try:
        if "Flete_Sur" not in xl_file.sheet_names:
            return {"ingresos": [], "gastos": [], "rfCortes": []}
        df = pd.read_excel(xl_file, sheet_name="Flete_Sur", header=None)
        print(f"   📄 Flete_Sur - Dimensiones: {df.shape}")

        ingresos = []
        gastos = []
        rf_cortes = []

        # Procesar fila por fila
        for i in range(2, min(len(df), 10000)):
            fecha = safe_get_cell(df, i, 0)
            if not fecha or pd.isna(fecha):
                continue

            tipo = str(safe_get_cell(df, i, 1, "")).strip()

            # Debug: mostrar tipos únicos encontrados
            tipos_conocidos = [
                "Corte",
                "Ax",
                "Negrito",
                "Valle",
                "Galvan",
                "Valle Local",
                "Tocayo",
                "Sierra47",
                "Chucho",
                "Robalo",
                "470",
                "tx8",
                "Don Rafa",
                "Rojo",
                "Abono",
                "compa",
                "cabo",
            ]
            if tipo and tipo not in tipos_conocidos:
                print(f"   🔍 Tipo encontrado: '{tipo}' en fila {i}")

            # Detectar sección de gastos
            if tipo == "Gasto Flete Sur":
                gasto = {
                    "fecha": parse_date(fecha),
                    "tipo": tipo,
                    "monto": parse_number(safe_get_cell(df, i, 2)),
                    "tipoCambio": parse_number(safe_get_cell(df, i, 3)),
                    "montoPesos": parse_number(safe_get_cell(df, i, 4)),
                    "destino": str(safe_get_cell(df, i, 5, "")).strip(),
                    "concepto": str(safe_get_cell(df, i, 6, "")).strip(),
                    "observaciones": str(safe_get_cell(df, i, 7, "")).strip(),
                }
                gastos.append(gasto)
            # Detectar sección de RF cortes
            elif (
                str(safe_get_cell(df, i, 2, "")).strip()
                and not str(safe_get_cell(df, i, 3, "")).strip()
            ):
                # Es un corte si tiene fecha, tipo vacío o numérico,
                # y columna 3 vacía
                corte_valor = parse_number(safe_get_cell(df, i, 2))
                if corte_valor is not None:
                    corte = {
                        "fecha": parse_date(fecha),
                        "corte": corte_valor,
                    }
                    rf_cortes.append(corte)
            else:
                # Es un ingreso
                ing = {
                    "fecha": parse_date(fecha),
                    "cliente": tipo,
                    "ingreso": parse_number(safe_get_cell(df, i, 2)),
                    "concepto": str(safe_get_cell(df, i, 3, "")).strip(),
                }
                ingresos.append(ing)

        print(
            f"   ✅ Flete_Sur - Ingresos: {len(ingresos)}, "
            f"Gastos: {len(gastos)}, Cortes: {len(rf_cortes)}"
        )
        return {"ingresos": ingresos, "gastos": gastos, "rfCortes": rf_cortes}
    except Exception as e:
        print(f"❌ Error en extract_flete_sur: {e}")
        return {"ingresos": [], "gastos": [], "rfCortes": []}


def extract_clientes(xl_file: pd.ExcelFile) -> Dict[str, List[Dict]]:
    try:
        if "Clientes" not in xl_file.sheet_names:
            return {"clientes": []}
        df = pd.read_excel(xl_file, sheet_name="Clientes", header=None)
        print(f"   📄 Clientes - Dimensiones: {df.shape}")

        clientes = []
        for i in range(2, min(len(df), 10000)):
            nombre = safe_get_cell(df, i, 0)
            if not nombre or pd.isna(nombre):
                continue

            cliente = {
                "nombre": str(nombre).strip(),
                "oc": str(safe_get_cell(df, i, 1, "")).strip(),
                "fecha": parse_date(safe_get_cell(df, i, 2)),
                "cantidad": parse_number(safe_get_cell(df, i, 3)),
                "precioVenta": parse_number(safe_get_cell(df, i, 4)),
                "total": parse_number(safe_get_cell(df, i, 5)),
                "abonos": parse_number(safe_get_cell(df, i, 6)),
                "saldo": parse_number(safe_get_cell(df, i, 7)),
            }
            clientes.append(cliente)

        return {"clientes": clientes}
    except Exception as e:
        print(f"❌ Error en extract_clientes: {e}")
        return {"clientes": []}


def safe_json_dumps(obj: Any) -> str:
    try:
        return json.dumps(obj, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"❌ Error serializando JSON: {e}")
        return "{}"


def generate_js_content(data: Dict[str, Any]) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return f"""/**
 * FlowDistributor - Datos del Sistema (generado)
 * Fecha: {now}
 * NOTA: Este archivo se genera automáticamente. Para actualizaciones,
 * correr el script de extracción.
 */

export const ORDENES_COMPRA = {{
  safe_json_dumps(data['distribuidores']['ordenesCompra'])
}};
export const DISTRIBUIDORES = {{
  safe_json_dumps(data['distribuidores']['distribuidores'])
}};
export const VENTAS_LOCALES = {{
  safe_json_dumps(data['controlMaestro']['ventasLocales'])
}};
export const RF_ACTUAL_CONTROL = {{
  safe_json_dumps(data['controlMaestro']['rfActual'])
}};
export const GASTOS_Y_ABONOS = {{
  safe_json_dumps(data['controlMaestro']['gastosYAbonos'])
}};
export const ALMACEN_MONTE = {safe_json_dumps(data['almacenMonte'])};
export const BOVEDA_MONTE = {safe_json_dumps(data['bovedaMonte'])};
export const BOVEDA_USA = {safe_json_dumps(data['bovedaUsa'])};
export const FLETE_SUR = {safe_json_dumps(data['fleteSur'])};
export const CLIENTES = {safe_json_dumps(data['clientes']['clientes'])};

export const ESTADISTICAS_SISTEMA = {{
  totalOrdenes: {len(data['distribuidores']['ordenesCompra'])},
  totalDistribuidores: {len(data['distribuidores']['distribuidores'])},
  totalVentasLocales: {len(data['controlMaestro']['ventasLocales'])},
  totalGastosAbonos: {len(data['controlMaestro']['gastosYAbonos'])},
  totalClientes: {len(data['clientes']['clientes'])},
  fechaExtraccion: '{now}',
  archivoOrigen: '{Path(DEFAULT_EXCEL_PATH).name}'
}};
"""


def write_outputs(
    data: Dict[str, Any], out_dir: Path, base_name: str = "FlowDistributorData"
) -> Dict[str, Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    json_path = out_dir / f"{base_name}.json"
    js_path = out_dir / f"{base_name}.js"

    # Escribir JSON
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    # Escribir JS
    js_content = generate_js_content(data)
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    return {"json": json_path, "js": js_path}


def build_data_from_excel(excel_path: Path) -> Dict[str, Any]:
    xl_file = pd.ExcelFile(excel_path)

    data = {
        "distribuidores": extract_distribuidores(xl_file),
        "controlMaestro": extract_control_maestro(xl_file),
        "almacenMonte": extract_almacen_monte(xl_file),
        "bovedaMonte": extract_boveda_monte(xl_file),
        "bovedaUsa": extract_boveda_usa(xl_file),
        "fleteSur": extract_flete_sur(xl_file),
        "clientes": extract_clientes(xl_file),
    }
    return data


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="Extrae datos desde Excel y genera archivos JSON/JS "
        "para FlowDistributor"
    )
    parser.add_argument(
        "--excel",
        "-e",
        type=str,
        default=DEFAULT_EXCEL_PATH,
        help="Ruta al archivo Excel",
    )
    parser.add_argument(
        "--out", "-o", type=str, default=DEFAULT_OUTPUT_DIR, help="Directorio de salida"
    )
    parser.add_argument(
        "--name",
        "-n",
        type=str,
        default="FlowDistributorData",
        help="Nombre base del archivo de salida (sin extensión)",
    )
    args = parser.parse_args(argv)

    excel_path = Path(args.excel)
    out_dir = Path(args.out)

    if not excel_path.exists():
        print(f"❌ ERROR: Archivo no encontrado: {excel_path}")
        return 2

    try:
        print("=" * 80)
        print("🚀 EXTRACCIÓN DE DATOS DEL EXCEL")
        print("=" * 80)

        print(f"\n📂 Leyendo archivo: {excel_path}")
        xl_file = pd.ExcelFile(excel_path)
        print(f"✅ Hojas encontradas: {len(xl_file.sheet_names)}")
        for sheet in xl_file.sheet_names:
            print(f"   - {sheet}")

        print("\n🔄 Extrayendo datos...")
        data = build_data_from_excel(excel_path)

        print("\n📝 Generando archivos de salida...")
        paths = write_outputs(data, out_dir, args.name)

        print(f"✅ JSON generado: {paths['json']}")
        print(f"✅ JS generado: {paths['js']}")
        print(f"📦 Tamaño JSON: {paths['json'].stat().st_size:,} bytes")
        print(f"📦 Tamaño JS: {paths['js'].stat().st_size:,} bytes")

        print("\n✨ EXTRACCIÓN COMPLETADA CON ÉXITO")
        print("=" * 80)
        return 0

    except Exception as e:
        print(f"\n❌ ERROR CRÍTICO: {e}")
        import traceback

        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
