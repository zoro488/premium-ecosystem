#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script CORREGIDO para extraer tablas del Excel
Estructura: Fila título → Fila vacía → Fila headers → Datos
"""

import openpyxl
import json
from pathlib import Path
from datetime import datetime
import sys

EXCEL_PATH = (
    Path(__file__).parent.parent
    / "Zoom Glitch Logo - Square"
    / "Copia de Administación_General.xlsx"
)
OUTPUT_PATH = (
    Path(__file__).parent.parent
    / "BASE_DATOS_excel_data_COMPLETO_FINAL.json"
)


def serialize_value(value):
    """Serializa valores para JSON"""
    if isinstance(value, datetime):
        return value.isoformat()
    if value is None:
        return None
    # Convertir números a tipos Python nativos
    if isinstance(value, (int, float)):
        return value
    return value


def find_column_separator_positions(rows, sample_size=20):
    """
    Encuentra posiciones de columnas vacías que separan tablas
    """
    if not rows:
        return []

    num_cols = max(len(row) for row in rows[:sample_size])
    empty_cols = []

    for col_idx in range(num_cols):
        # Revisar primeras filas
        col_values = []
        for row in rows[:sample_size]:
            if col_idx < len(row):
                col_values.append(row[col_idx])

        # Si TODA la columna está vacía, es separador
        if all(v is None or str(v).strip() == '' for v in col_values):
            empty_cols.append(col_idx)

    return empty_cols


def get_table_ranges(rows):
    """
    Divide el rango de columnas basado en columnas vacías
    Retorna: [(inicio, fin), ...]
    """
    empty_cols = find_column_separator_positions(rows)

    if not empty_cols:
        # No hay separadores, toda la hoja es una tabla
        max_col = max(len(row) for row in rows) if rows else 0
        return [(0, max_col)]

    ranges = []
    start = 0

    for empty_col in empty_cols:
        if empty_col > start:
            ranges.append((start, empty_col))
        start = empty_col + 1

    # Última tabla después del último separador
    max_col = max(len(row) for row in rows) if rows else 0
    if start < max_col:
        ranges.append((start, max_col))

    return ranges


def extract_table_data(rows, col_start, col_end):
    """
    Extrae una tabla con estructura:
    Fila 0: Título
    Fila 1: Vacía
    Fila 2: Headers
    Fila 3+: Datos
    """

    # Obtener título (fila 0)
    title = None
    if col_start < len(rows[0]):
        title_val = rows[0][col_start]
        if title_val and str(title_val).strip():
            title = str(title_val).strip()

    if not title:
        title = f"tabla_col_{col_start}"

    print(f"  📊 {title}")
    print(f"     Columnas: {col_start} a {col_end}")

    # Headers están en fila 2 (índice 2)
    if len(rows) < 3:
        print(f"     ⚠️  No hay suficientes filas")
        return title, []

    headers = []
    for col_idx in range(col_start, col_end):
        if col_idx < len(rows[2]):
            h = rows[2][col_idx]
            if h and str(h).strip():
                headers.append(str(h).strip())
            else:
                headers.append(None)

    # Filtrar headers None consecutivos del final
    while headers and headers[-1] is None:
        headers.pop()

    if not headers:
        print(f"     ⚠️  No hay headers válidos")
        return title, []

    print(f"     Headers: {headers[:5]}...")

    # Extraer datos desde fila 3 (índice 3)
    data = []
    empty_count = 0

    for row_idx in range(3, len(rows)):
        row = rows[row_idx]

        # Extraer valores de esta fila para el rango de columnas
        row_values = []
        for col_idx in range(col_start, col_end):
            if col_idx < len(row):
                row_values.append(row[col_idx])
            else:
                row_values.append(None)

        # Recortar valores None del final
        row_values = row_values[:len(headers)]

        # Verificar si la fila tiene al menos UN dato no vacío
        has_data = any(
            v is not None and str(v).strip() != ''
            for v in row_values
        )

        if not has_data:
            empty_count += 1
            continue

        # Crear diccionario con headers
        row_data = {}
        for header, value in zip(headers, row_values):
            if header:
                row_data[header] = serialize_value(value)

        data.append(row_data)

    if empty_count > 0:
        print(f"     ℹ️  {empty_count} filas vacías ignoradas")
    print(f"     ✅ {len(data)} registros extraídos")

    return title, data


def extract_sheet_horizontal_tables(sheet, sheet_name):
    """
    Extrae todas las tablas horizontales de una hoja
    """
    print(f"\n📄 {sheet_name}")

    rows = list(sheet.values)

    if not rows or len(rows) < 3:
        print(f"   ⚠️  Hoja sin datos suficientes")
        return {}

    # Detectar rangos de tablas
    table_ranges = get_table_ranges(rows)
    print(f"   🔍 {len(table_ranges)} tabla(s) detectada(s)")

    tables = {}

    for col_start, col_end in table_ranges:
        title, data = extract_table_data(rows, col_start, col_end)

        if not data:
            continue

        # Normalizar nombre para usar como key
        key = (
            title.lower()
            .replace(" ", "_")
            .replace("ó", "o")
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
        )

        tables[key] = {
            "nombre_original": title,
            "total_registros": len(data),
            "registros": data
        }

    return tables


def extract_all_sheets():
    """Extraer todas las hojas"""

    print("=" * 80)
    print("🚀 EXTRACCIÓN FINAL CORREGIDA")
    print("=" * 80)
    print(f"📁 {EXCEL_PATH.name}")
    print()

    if not EXCEL_PATH.exists():
        print(f"❌ Archivo no encontrado")
        sys.exit(1)

    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)

    # Excluir hoja DATA
    sheets_to_process = [
        s for s in wb.sheetnames
        if s and s.strip().lower() != "data"
    ]

    print(f"📋 {len(sheets_to_process)} hojas a procesar")

    complete_data = {
        "metadata": {
            "archivo": EXCEL_PATH.name,
            "fecha_extraccion": datetime.now().isoformat(),
            "total_hojas": len(sheets_to_process),
            "hojas": sheets_to_process
        },
        "datos": {}
    }

    # Procesar cada hoja
    for sheet_name in sheets_to_process:
        sheet = wb[sheet_name]
        tables = extract_sheet_horizontal_tables(sheet, sheet_name)

        # Agregar tablas al resultado
        for key, table_data in tables.items():
            complete_data["datos"][key] = table_data

    # Guardar
    print("\n" + "=" * 80)
    print("💾 Guardando JSON...")

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(complete_data, f, ensure_ascii=False, indent=2)

    print(f"✅ {OUTPUT_PATH.name}")

    # Resumen
    print("\n" + "=" * 80)
    print("📊 RESUMEN FINAL")
    print("=" * 80)

    total = 0
    for key, table_data in sorted(complete_data["datos"].items()):
        count = table_data["total_registros"]
        total += count
        nombre = table_data["nombre_original"]
        print(f"   {nombre:30s} → {count:5d} registros")

    print("=" * 80)
    print(f"   TOTAL: {total} registros de {len(complete_data['datos'])} tablas")
    print("=" * 80)

    # Verificar contra datos esperados
    print("\n" + "=" * 80)
    print("✅ VALIDACIÓN CONTRA DATOS ESPERADOS")
    print("=" * 80)

    expected = {
        "ordenes_de_compra": 9,
        "distribuidores": 2
    }

    for key, expected_count in expected.items():
        if key in complete_data["datos"]:
            actual = complete_data["datos"][key]["total_registros"]
            status = "✅" if actual == expected_count else "❌"
            print(f"   {status} {key}: {actual} (esperado: {expected_count})")
        else:
            print(f"   ❌ {key}: NO ENCONTRADA (esperado: {expected_count})")

    print("=" * 80)

    return complete_data


if __name__ == "__main__":
    try:
        extract_all_sheets()
        print("\n🎉 PROCESO COMPLETADO")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
