#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script avanzado para extraer tablas múltiples del Excel
Detecta automáticamente tablas separadas horizontalmente
"""

import json
import sys
from datetime import datetime
from pathlib import Path

import openpyxl

EXCEL_PATH = (
    Path(__file__).parent.parent
    / "Zoom Glitch Logo - Square"
    / "Copia de Administación_General.xlsx"
)
OUTPUT_PATH = (
    Path(__file__).parent.parent
    / "BASE_DATOS_excel_data_COMPLETO_CORREGIDO.json"
)


def serialize_value(value):
    """Serializa valores para JSON"""
    if isinstance(value, datetime):
        return value.isoformat()
    if value is None:
        return None
    return value


def detect_table_ranges(rows):
    """
    Detecta rangos de columnas que contienen tablas separadas
    Busca columnas vacías que separan tablas
    """
    if not rows or len(rows) < 2:
        return [(0, len(rows[0]) if rows else 0)]

    num_cols = len(rows[0])

    # Detectar columnas completamente vacías
    empty_cols = set()
    for col_idx in range(num_cols):
        col_values = [
            rows[row_idx][col_idx]
            for row_idx in range(min(50, len(rows)))
            if col_idx < len(rows[row_idx])
        ]
        if all(v is None or str(v).strip() == '' for v in col_values):
            empty_cols.add(col_idx)

    # Crear rangos de columnas (tablas)
    ranges = []
    start_col = 0

    for col_idx in range(num_cols):
        if col_idx in empty_cols:
            if start_col < col_idx:
                ranges.append((start_col, col_idx))
            start_col = col_idx + 1

    # Agregar última tabla
    if start_col < num_cols:
        ranges.append((start_col, num_cols))

    # Si no hay separadores, es una sola tabla
    if not ranges:
        ranges = [(0, num_cols)]

    return ranges


def find_header_row(rows, col_start, col_end):
    """
    Encuentra la fila que contiene los headers
    Busca la primera fila con texto y sin muchos None
    """
    for row_idx, row in enumerate(rows[:10]):
        slice_row = row[col_start:col_end]
        non_empty = sum(
            1 for v in slice_row
            if v is not None and str(v).strip() != ''
        )

        # Si más del 50% de columnas tienen datos, es probable header
        if non_empty > len(slice_row) * 0.5:
            # Verificar que no sea un título (solo 1 celda con valor)
            if non_empty > 1:
                return row_idx

    return 0


def extract_table(rows, col_start, col_end, table_name="tabla"):
    """Extrae una tabla específica del rango de columnas"""
    print(f"  📊 Extrayendo tabla: {table_name}")
    print(f"     Columnas {col_start} a {col_end}")

    # Encontrar fila de headers
    header_row_idx = find_header_row(rows, col_start, col_end)
    print(f"     Headers en fila: {header_row_idx + 1}")

    # Obtener headers
    headers = [
        str(h).strip() if h is not None else None
        for h in rows[header_row_idx][col_start:col_end]
    ]

    # Filtrar headers válidos
    headers = [h for h in headers if h and h != 'None']

    if not headers:
        print(f"     ⚠️  No se encontraron headers válidos")
        return []

    print(f"     Headers: {headers[:3]}...")

    # Extraer datos
    data = []
    empty_rows = 0

    for row_idx, row in enumerate(rows[header_row_idx + 1:], start=header_row_idx + 2):
        row_slice = row[col_start:col_end]

        # Verificar si la fila tiene datos
        has_data = any(
            v is not None and str(v).strip() != ''
            for v in row_slice
        )

        if not has_data:
            empty_rows += 1
            continue

        # Crear registro
        row_data = {}
        for idx, header in enumerate(headers):
            if idx < len(row_slice):
                value = serialize_value(row_slice[idx])
                row_data[header] = value

        # Solo agregar si tiene al menos un campo con datos
        if any(v is not None for v in row_data.values()):
            data.append(row_data)

    if empty_rows > 0:
        print(f"     ℹ️  {empty_rows} filas vacías ignoradas")
    print(f"     ✅ {len(data)} registros extraídos")

    return data


def extract_sheet_smart(sheet, sheet_name):
    """Extrae una hoja detectando múltiples tablas"""
    print(f"\n📄 Procesando hoja: {sheet_name}")

    rows = list(sheet.values)

    if not rows:
        print(f"   ⚠️  Hoja vacía")
        return {}

    # Detectar rangos de tablas
    table_ranges = detect_table_ranges(rows)
    print(f"   🔍 Detectadas {len(table_ranges)} tabla(s)")

    tables = {}

    # Extraer cada tabla
    for idx, (col_start, col_end) in enumerate(table_ranges):
        # Intentar obtener nombre de la tabla
        # (primera celda no vacía en el rango)
        table_title = None
        for row in rows[:5]:
            for col_idx in range(col_start, min(col_end, len(row))):
                val = row[col_idx]
                if val and str(val).strip():
                    table_title = str(val).strip()
                    break
            if table_title:
                break

        if not table_title:
            table_title = f"tabla_{idx + 1}"

        # Normalizar nombre
        table_key = (
            table_title.lower()
            .replace(" ", "_")
            .replace("ó", "o")
            .replace("á", "a")
            .replace("é", "e")
        )

        # Extraer tabla
        table_data = extract_table(
            rows, col_start, col_end, table_title
        )

        if table_data:
            tables[table_key] = {
                "nombre_original": table_title,
                "total_registros": len(table_data),
                "columnas": f"{col_start}-{col_end}",
                "registros": table_data
            }

    return tables


def extract_all_sheets_smart():
    """Extrae todas las hojas con detección inteligente"""

    print("=" * 80)
    print("🚀 EXTRACCIÓN INTELIGENTE DE EXCEL")
    print("=" * 80)
    print(f"📁 Archivo: {EXCEL_PATH}")
    print()

    if not EXCEL_PATH.exists():
        print(f"❌ ERROR: Archivo no encontrado")
        sys.exit(1)

    # Cargar Excel
    print("📖 Cargando Excel...")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)

    # Excluir DATA
    sheets_to_process = [
        s for s in wb.sheetnames
        if s and s.strip().lower() != "data"
    ]

    print(f"✅ {len(sheets_to_process)} hojas a procesar")

    complete_data = {
        "metadata": {
            "archivo": "Copia de Administación_General.xlsx",
            "fecha_extraccion": datetime.now().isoformat(),
            "total_hojas": len(sheets_to_process),
            "hojas": sheets_to_process,
            "nota": "Extracción inteligente con detección de tablas múltiples"
        },
        "datos": {}
    }

    # Procesar cada hoja
    for sheet_name in sheets_to_process:
        sheet = wb[sheet_name]
        tables = extract_sheet_smart(sheet, sheet_name)

        # Si hay múltiples tablas, agregar cada una
        if len(tables) > 1:
            for table_key, table_data in tables.items():
                complete_data["datos"][table_key] = table_data
        elif len(tables) == 1:
            # Una sola tabla, usar nombre de la hoja
            sheet_key = (
                sheet_name.lower()
                .replace(" ", "_")
                .replace("ó", "o")
                .replace("á", "a")
            )
            complete_data["datos"][sheet_key] = list(tables.values())[0]

    # Guardar JSON
    print("\n" + "=" * 80)
    print("💾 Guardando JSON...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(complete_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Guardado: {OUTPUT_PATH}")

    # Resumen
    print("\n" + "=" * 80)
    print("📊 RESUMEN")
    print("=" * 80)

    total_records = 0
    for key, table_data in complete_data["datos"].items():
        records = table_data["total_registros"]
        total_records += records
        nombre = table_data["nombre_original"]
        print(f"   {nombre:30s} → {records:5d} registros")

    print("=" * 80)
    print(f"   TOTAL: {total_records} registros")
    print("=" * 80)

    return complete_data


if __name__ == "__main__":
    try:
        extract_all_sheets_smart()
        print("\n✅ PROCESO COMPLETADO")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
        sys.exit(1)
