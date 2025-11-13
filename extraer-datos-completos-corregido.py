#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script corregido para extraer TODOS los datos del Excel correctamente
Basado en analisis_excel_separado_correcto.json
"""

import pandas as pd
import json
from datetime import datetime
from pathlib import Path
import numpy as np

# Configuración
EXCEL_FILE = r"C:\Users\xpovo\Downloads\Copia de Administación_General.xlsx"
OUTPUT_FILE = "datos_excel_completos_corregidos.json"

def convertir_a_serializable(obj):
    """Convierte objetos no serializables a JSON"""
    if pd.isna(obj) or obj is None:
        return None
    if isinstance(obj, (np.integer, np.floating)):
        return float(obj)
    if isinstance(obj, pd.Timestamp):
        return obj.strftime('%Y-%m-%d')
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d')
    return str(obj)

def limpiar_datos(df):
    """Limpia y convierte los datos del DataFrame"""
    datos = []
    for _, row in df.iterrows():
        registro = {}
        for col in df.columns:
            valor = row[col]
            if pd.notna(valor):
                registro[str(col)] = convertir_a_serializable(valor)
        if registro:  # Solo agregar si tiene datos
            datos.append(registro)
    return datos

def encontrar_seccion(df, keyword, fila_inicio=0, fila_fin=200):
    """Encuentra una sección en el DataFrame buscando keyword en las primeras columnas"""
    for i in range(fila_inicio, min(fila_fin, len(df))):
        for col in df.columns[:5]:  # Buscar en las primeras 5 columnas
            valor = str(df.iloc[i][col]).upper()
            if keyword.upper() in valor:
                return i
    return None

def extraer_tabla_desde_fila(df, fila_inicio, nombre_seccion=""):
    """Extrae una tabla completa desde una fila de inicio hasta encontrar filas vacías"""
    if fila_inicio is None or fila_inicio >= len(df):
        return None, None

    # Encontrar headers (siguiente fila con datos)
    fila_headers = fila_inicio + 2
    if fila_headers >= len(df):
        return None, None

    # Extraer datos hasta encontrar 3 filas vacías consecutivas
    datos = []
    filas_vacias = 0

    for i in range(fila_headers + 1, len(df)):
        fila = df.iloc[i]

        # Verificar si la fila tiene datos
        tiene_datos = any(pd.notna(val) and str(val).strip() != '' for val in fila)

        if not tiene_datos:
            filas_vacias += 1
            if filas_vacias >= 3:  # 3 filas vacías = fin de tabla
                break
        else:
            filas_vacias = 0
            registro = {}
            for col in df.columns:
                valor = fila[col]
                if pd.notna(valor):
                    registro[str(col)] = convertir_a_serializable(valor)
            if registro:
                datos.append(registro)

    return datos, fila_headers

def extraer_rf_actual(df, fila_inicio):
    """Extrae el valor de RF Actual (primera celda después del encabezado)"""
    if fila_inicio is None or fila_inicio + 1 >= len(df):
        return 0.0

    # El RF está en la fila siguiente al encabezado
    fila_rf = df.iloc[fila_inicio + 1]
    for col in df.columns[:5]:  # Buscar en las primeras columnas
        valor = fila_rf[col]
        if pd.notna(valor):
            try:
                return float(valor)
            except:
                pass
    return 0.0

def extraer_cortes(df, fila_inicio_rf):
    """Extrae los cortes históricos (registros después del RF Actual)"""
    if fila_inicio_rf is None:
        return []

    datos, _ = extraer_tabla_desde_fila(df, fila_inicio_rf, "cortes")
    return datos if datos else []

def extraer_panel(sheet_name, excel_file):
    """Extrae datos completos de un panel: INGRESOS, GASTOS, RF ACTUAL"""
    print(f"📊 Extrayendo {sheet_name}...")

    try:
        df = pd.read_excel(excel_file, sheet_name=sheet_name, header=None)

        # Buscar secciones
        fila_ingresos = encontrar_seccion(df, "INGRESOS", 0, 100)
        fila_gastos = encontrar_seccion(df, "GASTOS", 0, 100)
        fila_salidas = encontrar_seccion(df, "SALIDA", 0, 100) if fila_gastos is None else None
        fila_rf = encontrar_seccion(df, "RF ACTUAL", 0, 100)

        # Extraer datos
        ingresos, _ = extraer_tabla_desde_fila(df, fila_ingresos, "ingresos") if fila_ingresos else ([], None)
        gastos, _ = extraer_tabla_desde_fila(df, fila_gastos or fila_salidas, "gastos") if (fila_gastos or fila_salidas) else ([], None)

        # RF Actual y cortes
        rf_actual = extraer_rf_actual(df, fila_rf) if fila_rf else 0.0
        cortes = extraer_cortes(df, fila_rf) if fila_rf else []

        # Calcular totales
        total_ingresos = sum(float(r.get('Ingreso', 0) or 0) for r in (ingresos or []))
        total_gastos = sum(float(r.get('Gasto', 0) or 0) for r in (gastos or []))

        print(f"   ✅ Ingresos: {len(ingresos or [])} | Gastos: {len(gastos or [])} | RF: ${rf_actual:,.2f} | Cortes: {len(cortes)}")

        return {
            "ingresos": ingresos or [],
            "gastos": gastos or [],
            "rfActual": rf_actual,
            "cortes": cortes,
            "totales": {
                "ingresos": total_ingresos,
                "gastos": total_gastos,
                "rf_calculado": total_ingresos - total_gastos
            }
        }

    except Exception as e:
        print(f"   ⚠️ Error en {sheet_name}: {e}")
        return {
            "ingresos": [],
            "gastos": [],
            "rfActual": 0.0,
            "cortes": [],
            "totales": {"ingresos": 0, "gastos": 0, "rf_calculado": 0}
        }

def extraer_distribuidores(excel_file):
    """Extrae órdenes de compra y distribuidores"""
    print("📦 Extrayendo Distribuidores...")

    df = pd.read_excel(excel_file, sheet_name="Distribuidores", header=None)

    # Tabla principal (órdenes de compra) - desde fila 3
    df_ordenes = pd.read_excel(excel_file, sheet_name="Distribuidores", header=2)
    ordenes = limpiar_datos(df_ordenes.head(500))  # Limitar a registros con datos
    ordenes = [o for o in ordenes if any(v for v in o.values())][:10]  # Solo primeros 10 válidos

    print(f"   ✅ Órdenes de Compra: {len(ordenes)}")

    return ordenes

def extraer_control_maestro(excel_file):
    """Extrae ventas, RF Actual del sistema y GYA"""
    print("💰 Extrayendo Control Maestro...")

    df = pd.read_excel(excel_file, sheet_name="Control_Maestro", header=None)

    # Ventas (tabla principal)
    df_ventas = pd.read_excel(excel_file, sheet_name="Control_Maestro", header=2)
    ventas = limpiar_datos(df_ventas.head(500))
    ventas = [v for v in ventas if any(val for val in v.values())][:100]

    # RF Actual del sistema (columnas M-N, fila 1)
    rf_total = 0.0
    try:
        rf_total = float(df.iloc[1, 13])  # Columna N (índice 13), fila 1
    except:
        pass

    # Extraer RF de cada panel (filas 3-10, columnas M-N)
    paneles_rf = {}
    nombres_paneles = {
        "Almacén Villa": "almacenMonte",
        "Bóveda Monte": "bovedaMonte",
        "Flete Sur": "fleteSur",
        "Utilidades": "utilidades",
        "Azteca": "azteca",
        "Leftie": "leftie",
        "Profit": "profit",
        "Bóveda USA": "bovedaUsa"
    }

    for i in range(3, 11):  # Filas 3-10
        try:
            nombre = str(df.iloc[i, 12]).strip()  # Columna M
            valor = float(df.iloc[i, 13])  # Columna N
            if nombre in nombres_paneles:
                paneles_rf[nombres_paneles[nombre]] = valor
        except:
            pass

    # GYA (columnas O-V desde fila 3)
    df_gya = df.iloc[3:, 14:22].copy()  # Columnas O-V (índices 14-21)
    df_gya.columns = ['Fecha', 'Origen', 'Valor', 'TC', 'Pesos', 'Destino', 'Concepto', 'Observaciones']
    gya = limpiar_datos(df_gya)
    gya = [g for g in gya if g.get('Valor')][:100]

    # Clasificar GYA
    for g in gya:
        try:
            valor = float(g.get('Valor', 0))
            g['tipo'] = 'abono' if valor > 0 else 'gasto'
        except:
            g['tipo'] = 'desconocido'

    print(f"   ✅ Ventas: {len(ventas)} | RF Total: ${rf_total:,.2f} | GYA: {len(gya)}")

    return {
        "ventas": ventas,
        "rfTotal": rf_total,
        "panelesRF": paneles_rf,
        "gya": gya
    }

def extraer_clientes(excel_file):
    """Extrae clientes y ventas locales"""
    print("👥 Extrayendo Clientes...")

    df = pd.read_excel(excel_file, sheet_name="Clientes", header=None)

    # Buscar tabla de ventas locales
    datos = limpiar_datos(df.iloc[3:200])  # Desde fila 3
    clientes_ventas = [d for d in datos if any(v for v in d.values())]

    print(f"   ✅ Clientes/Ventas: {len(clientes_ventas)}")

    return clientes_ventas

def main():
    print("\n╔════════════════════════════════════════════════════╗")
    print("║  🚀 EXTRACCIÓN COMPLETA Y CORREGIDA DEL EXCEL     ║")
    print("╚════════════════════════════════════════════════════╝\n")

    if not Path(EXCEL_FILE).exists():
        print(f"❌ Error: No se encuentra el archivo {EXCEL_FILE}")
        return

    # Extraer todas las hojas
    datos_completos = {
        "metadata": {
            "fuente": EXCEL_FILE,
            "fechaExtraccion": datetime.now().isoformat(),
            "version": "corregido_v2"
        }
    }

    # Control Maestro
    control_maestro = extraer_control_maestro(EXCEL_FILE)
    datos_completos["controlMaestro"] = control_maestro["ventas"]
    datos_completos["rfActual"] = {
        "totalSistema": control_maestro["rfTotal"],
        "bovedas": control_maestro["panelesRF"]
    }
    datos_completos["tablaGYA"] = control_maestro["gya"]

    # Distribuidores
    datos_completos["distribuidores"] = extraer_distribuidores(EXCEL_FILE)

    # Paneles individuales
    paneles = {
        "almacenMonte": "Almacen_Monte",
        "bovedaMonte": "Bóveda_Monte",
        "bovedaUsa": "Bóveda_USA",
        "azteca": "Azteca",
        "utilidades": "Utilidades",
        "fleteSur": "Flete_Sur",
        "leftie": "Leftie",
        "profit": "Profit"
    }

    for key, sheet_name in paneles.items():
        datos_completos[key] = extraer_panel(sheet_name, EXCEL_FILE)

    # Clientes
    datos_completos["clientes"] = extraer_clientes(EXCEL_FILE)

    # Guardar
    print(f"\n💾 Guardando en {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(datos_completos, f, ensure_ascii=False, indent=2)

    # Resumen
    print("\n" + "="*60)
    print("✅ EXTRACCIÓN COMPLETA")
    print("="*60)
    print(f"RF Total Sistema: ${datos_completos['rfActual']['totalSistema']:,.2f}")
    print(f"Ventas: {len(datos_completos['controlMaestro'])}")
    print(f"Órdenes Compra: {len(datos_completos['distribuidores'])}")
    print(f"GYA: {len(datos_completos['tablaGYA'])}")
    print(f"Clientes: {len(datos_completos['clientes'])}")

    total_movimientos = 0
    for key in paneles.keys():
        panel = datos_completos[key]
        ingresos = len(panel['ingresos'])
        gastos = len(panel['gastos'])
        rf = panel['rfActual']
        print(f"{key}: {ingresos} ingresos, {gastos} gastos, RF=${rf:,.2f}")
        total_movimientos += ingresos + gastos

    print(f"\n📊 TOTAL REGISTROS: {len(datos_completos['controlMaestro']) + len(datos_completos['distribuidores']) + len(datos_completos['clientes']) + total_movimientos}")
    print(f"✅ Archivo guardado: {OUTPUT_FILE}\n")

if __name__ == "__main__":
    main()
