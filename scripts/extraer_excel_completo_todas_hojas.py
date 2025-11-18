#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Extractor Completo de Todas las Hojas del Excel
Extrae TODAS las 12 hojas con su estructura horizontal correcta
"""

import pandas as pd
import json
from datetime import datetime
from pathlib import Path
import numpy as np

# Archivos
EXCEL_FILE = "Administación_General.xlsx"
OUTPUT_FILE = "datos_excel_completos.json"
BACKUP_DIR = Path("backups")

def normalize_value(val):
    """Normaliza valores para JSON"""
    if pd.isna(val):
        return None
    if isinstance(val, (np.integer, np.floating)):
        return float(val) if isinstance(val, np.floating) else int(val)
    if isinstance(val, datetime):
        return val.strftime('%Y-%m-%d')
    if isinstance(val, pd.Timestamp):
        return val.strftime('%Y-%m-%d')
    return str(val)

def extract_sheet_data(df, sheet_name):
    """Extrae datos de una hoja respetando su estructura horizontal"""
    print(f"\n📄 Procesando: {sheet_name}")

    # Obtener dimensiones reales
    last_col = df.shape[1]
    last_row = df.shape[0]

    # Buscar primera fila con datos (encabezados)
    header_row = None
    for i in range(min(10, last_row)):
        non_null = df.iloc[i].notna().sum()
        if non_null >= 3:  # Al menos 3 columnas con datos
            header_row = i
            break

    if header_row is None:
        print(f"⚠️ No se encontró fila de encabezado en {sheet_name}")
        return None

    # Leer desde la fila de encabezado
    df_clean = pd.read_excel(
        EXCEL_FILE,
        sheet_name=sheet_name,
        header=header_row
    )

    # Convertir a lista de diccionarios
    records = []
    for idx, row in df_clean.iterrows():
        record = {}
        for col in df_clean.columns:
            val = row[col]
            if pd.notna(val):
                # Limpiar nombre de columna
                col_name = str(col).strip()
                if col_name and col_name != 'nan':
                    record[col_name] = normalize_value(val)

        # Solo agregar si tiene datos
        if record:
            records.append(record)

    print(f"✓ {sheet_name}: {len(records)} registros extraídos")
    return records

def extract_distribuidores(df):
    """Extrae hoja Distribuidores con estructura especial"""
    print("\n📄 Procesando: Distribuidores")

    # OCs empiezan en fila 2
    df_ocs = pd.read_excel(EXCEL_FILE, sheet_name="Distribuidores", header=2, usecols="A:K")

    ordenesCompra = []
    for idx, row in df_ocs.iterrows():
        if pd.notna(row.iloc[0]) and str(row.iloc[0]).startswith('OC'):
            oc = {
                "id": str(row.iloc[0]),
                "fecha": normalize_value(row.iloc[1]),
                "origen": normalize_value(row.iloc[2]),
                "cantidad": int(row.iloc[3]) if pd.notna(row.iloc[3]) else 0,
                "costoDistribuidor": float(row.iloc[4]) if pd.notna(row.iloc[4]) else 0,
                "costoTransporte": float(row.iloc[5]) if pd.notna(row.iloc[5]) else 0,
                "costoPorUnidad": float(row.iloc[6]) if pd.notna(row.iloc[6]) else 0,
                "stockActual": int(row.iloc[7]) if pd.notna(row.iloc[7]) else 0,
                "costoTotal": float(row.iloc[8]) if pd.notna(row.iloc[8]) else 0,
                "pagoDistribuidor": float(row.iloc[9]) if pd.notna(row.iloc[9]) else 0,
                "deuda": float(row.iloc[10]) if pd.notna(row.iloc[10]) else 0
            }
            ordenesCompra.append(oc)

    # Distribuidores empiezan en columna M (índice 12)
    df_dist = pd.read_excel(EXCEL_FILE, sheet_name="Distribuidores", header=2, usecols="M:P")

    distribuidores = []
    for idx, row in df_dist.iterrows():
        if pd.notna(row.iloc[0]) and row.iloc[0] not in ['Distribuidores', 'nan']:
            dist = {
                "nombre": str(row.iloc[0]),
                "costoTotal": float(row.iloc[1]) if pd.notna(row.iloc[1]) else 0,
                "abonos": float(row.iloc[2]) if pd.notna(row.iloc[2]) else 0,
                "pendiente": float(row.iloc[3]) if pd.notna(row.iloc[3]) else 0
            }
            distribuidores.append(dist)

    print(f"✓ Distribuidores: {len(ordenesCompra)} OCs, {len(distribuidores)} distribuidores")

    return {
        "ordenesCompra": ordenesCompra,
        "distribuidores": distribuidores
    }

def extract_control_maestro(df):
    """Extrae Control_Maestro con sus 3 secciones"""
    print("\n📄 Procesando: Control_Maestro")

    # Ventas (columnas A-L, desde fila 2)
    df_ventas = pd.read_excel(EXCEL_FILE, sheet_name="Control_Maestro", header=2, usecols="A:L")
    ventas = []
    for idx, row in df_ventas.iterrows():
        if pd.notna(row.iloc[0]) and isinstance(row.iloc[0], datetime):
            venta = {
                "fecha": normalize_value(row.iloc[0]),
                "ocRelacionada": str(row.iloc[1]) if pd.notna(row.iloc[1]) else None,
                "cantidad": int(row.iloc[2]) if pd.notna(row.iloc[2]) else 0,
                "cliente": str(row.iloc[3]) if pd.notna(row.iloc[3]) else None,
                "bovedaMonte": float(row.iloc[4]) if pd.notna(row.iloc[4]) else 0,
                "precioDeVenta": float(row.iloc[5]) if pd.notna(row.iloc[5]) else 0,
                "ingreso": float(row.iloc[6]) if pd.notna(row.iloc[6]) else 0,
                "flete": str(row.iloc[7]) if pd.notna(row.iloc[7]) else None,
                "fleteUtilidad": float(row.iloc[8]) if pd.notna(row.iloc[8]) else 0,
                "utilidad": float(row.iloc[9]) if pd.notna(row.iloc[9]) else 0,
                "estatus": str(row.iloc[10]) if pd.notna(row.iloc[10]) else None,
                "concepto": str(row.iloc[11]) if pd.notna(row.iloc[11]) else None
            }
            ventas.append(venta)

    # GYA (columnas N-V, desde fila 2)
    df_gya = pd.read_excel(EXCEL_FILE, sheet_name="Control_Maestro", header=2, usecols="N:V")
    gya = []
    for idx, row in df_gya.iterrows():
        if pd.notna(row.iloc[0]) and isinstance(row.iloc[0], datetime):
            entry = {
                "fecha": normalize_value(row.iloc[0]),
                "origenGasto": str(row.iloc[1]) if pd.notna(row.iloc[1]) else None,
                "valor": float(row.iloc[2]) if pd.notna(row.iloc[2]) else 0,
                "tc": float(row.iloc[3]) if pd.notna(row.iloc[3]) else 0,
                "pesos": float(row.iloc[4]) if pd.notna(row.iloc[4]) else 0,
                "destino": str(row.iloc[5]) if pd.notna(row.iloc[5]) else None,
                "concepto": str(row.iloc[6]) if pd.notna(row.iloc[6]) else None,
                "observaciones": str(row.iloc[7]) if pd.notna(row.iloc[7]) else None
            }
            gya.append(entry)

    # RF Actual (columna M, fila 1)
    rf_actual = pd.read_excel(EXCEL_FILE, sheet_name="Control_Maestro", header=None, usecols="M", nrows=2)
    rf_value = float(rf_actual.iloc[1, 0]) if pd.notna(rf_actual.iloc[1, 0]) else 0

    print(f"✓ Control_Maestro: {len(ventas)} ventas, {len(gya)} GYA, RF: {rf_value:,.2f}")

    return {
        "ventas": ventas,
        "gya": gya,
        "rfActual": rf_value
    }

def extract_panel_sheet(sheet_name):
    """Extrae hojas de paneles (Almacén, Bóvedas, Fletes, etc.)"""
    print(f"\n📄 Procesando: {sheet_name}")

    # Leer totales de fila 1
    df_totals = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name, header=None, nrows=2)
    ingresos = float(df_totals.iloc[1, 0]) if pd.notna(df_totals.iloc[1, 0]) else 0
    rf_actual = float(df_totals.iloc[1, 4]) if df_totals.shape[1] > 4 and pd.notna(df_totals.iloc[1, 4]) else 0
    gastos = float(df_totals.iloc[1, 6]) if df_totals.shape[1] > 6 and pd.notna(df_totals.iloc[1, 6]) else 0

    # Leer transacciones desde fila 2 (encabezados)
    df = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name, header=2)

    transacciones = []
    for idx, row in df.iterrows():
        trans = {}
        for col in df.columns:
            val = row[col]
            if pd.notna(val):
                col_name = str(col).strip()
                if col_name and col_name != 'nan':
                    trans[col_name] = normalize_value(val)

        if trans:
            transacciones.append(trans)

    print(f"✓ {sheet_name}: Ingresos={ingresos:,.2f}, RF={rf_actual:,.2f}, Gastos={gastos:,.2f}, {len(transacciones)} transacciones")

    return {
        "resumen": {
            "ingresos": ingresos,
            "rfActual": rf_actual,
            "gastos": gastos
        },
        "transacciones": transacciones
    }

def extract_clientes():
    """Extrae hoja de Clientes"""
    print("\n📄 Procesando: Clientes")

    # Encabezado en fila 2, columnas E-J
    df = pd.read_excel(EXCEL_FILE, sheet_name="Clientes", header=2, usecols="E:J")

    clientes = []
    for idx, row in df.iterrows():
        if pd.notna(row.iloc[0]) and row.iloc[0] not in ['Cliente', 'nan']:
            cliente = {
                "nombre": str(row.iloc[0]),
                "actual": normalize_value(row.iloc[1]),
                "deuda": float(row.iloc[2]) if pd.notna(row.iloc[2]) else 0,
                "abonos": float(row.iloc[3]) if pd.notna(row.iloc[3]) else 0,
                "pendiente": float(row.iloc[4]) if pd.notna(row.iloc[4]) else 0,
                "observaciones": str(row.iloc[5]) if pd.notna(row.iloc[5]) else None
            }
            clientes.append(cliente)

    print(f"✓ Clientes: {len(clientes)} clientes")
    return clientes

def extract_data_sheet():
    """Extrae hoja DATA (listas de referencia)"""
    print("\n📄 Procesando: DATA")

    df = pd.read_excel(EXCEL_FILE, sheet_name="DATA", header=0)

    # Extraer listas únicas de cada columna
    odgya = [str(v) for v in df.iloc[:, 0].dropna().unique() if v not in ['ODGYA', 'nan']]
    destinos = [str(v) for v in df.iloc[:, 2].dropna().unique() if v not in ['Destino', 'nan']]
    clientes_ref = [str(v) for v in df.iloc[:, 4].dropna().unique() if v not in ['Clientes', 'nan']]

    print(f"✓ DATA: {len(odgya)} ODGYA, {len(destinos)} Destinos, {len(clientes_ref)} Clientes Ref")

    return {
        "odgya": odgya,
        "destinos": destinos,
        "clientesReferencia": clientes_ref
    }

def main():
    """Función principal"""
    print("\n" + "="*60)
    print("🔍 EXTRACTOR COMPLETO - TODAS LAS HOJAS DEL EXCEL")
    print("="*60)

    if not Path(EXCEL_FILE).exists():
        print(f"❌ Error: No se encuentra el archivo {EXCEL_FILE}")
        return

    # Crear backup del archivo anterior si existe
    if Path(OUTPUT_FILE).exists():
        BACKUP_DIR.mkdir(exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = BACKUP_DIR / f"datos_excel_{timestamp}.json"
        Path(OUTPUT_FILE).rename(backup_file)
        print(f"📦 Backup creado: {backup_file}")

    # Estructura de datos completa
    data = {
        "metadata": {
            "archivo": EXCEL_FILE,
            "fechaExtraccion": datetime.now().isoformat(),
            "version": "2.0-completo",
            "totalHojas": 12
        }
    }

    try:
        # 1. Distribuidores (estructura especial)
        data["distribuidores"] = extract_distribuidores(None)

        # 2. Control_Maestro (3 secciones)
        data["controlMaestro"] = extract_control_maestro(None)

        # 3-10. Paneles financieros
        panel_sheets = [
            "Almacen_Monte",
            "Bóveda_Monte",
            "Bóveda_USA",
            "Flete_Sur",
            "Utilidades",
            "Azteca",
            "Leftie",
            "Profit"
        ]

        for sheet in panel_sheets:
            key = sheet.replace("_", "").replace("ó", "o").lower()
            data[key] = extract_panel_sheet(sheet)

        # 11. Clientes
        data["clientes"] = extract_clientes()

        # 12. DATA
        data["data"] = extract_data_sheet()

        # Guardar JSON
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print("\n" + "="*60)
        print("✅ EXTRACCIÓN COMPLETA EXITOSA")
        print("="*60)
        print(f"📁 Archivo generado: {OUTPUT_FILE}")
        print(f"📊 Tamaño: {Path(OUTPUT_FILE).stat().st_size / 1024:.2f} KB")

        # Resumen
        print("\n📈 RESUMEN DE DATOS EXTRAÍDOS:")
        print(f"  • OCs: {len(data['distribuidores']['ordenesCompra'])}")
        print(f"  • Distribuidores: {len(data['distribuidores']['distribuidores'])}")
        print(f"  • Ventas: {len(data['controlMaestro']['ventas'])}")
        print(f"  • GYA: {len(data['controlMaestro']['gya'])}")
        print(f"  • Clientes: {len(data['clientes'])}")

        for sheet in panel_sheets:
            key = sheet.replace("_", "").replace("ó", "o").lower()
            print(f"  • {sheet}: {len(data[key]['transacciones'])} transacciones")

        print("\n🎯 Listo para carga a Firestore!")

    except Exception as e:
        print(f"\n❌ Error durante la extracción: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
