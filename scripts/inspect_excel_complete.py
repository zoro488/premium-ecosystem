"""
Inspeccionar TODAS las hojas del Excel y su estructura
para entender la organización completa de los datos
"""
from pathlib import Path

import pandas as pd

excel_path = Path(__file__).resolve().parent.parent / "Administación_General.xlsx"

print("\n=== INSPECCIÓN COMPLETA DEL EXCEL ===\n")
print(f"Archivo: {excel_path.name}\n")

# Leer todas las hojas
xl_file = pd.ExcelFile(excel_path)

print(f"Total de hojas: {len(xl_file.sheet_names)}")
print("\nHojas encontradas:")
for i, sheet_name in enumerate(xl_file.sheet_names, 1):
    print(f"  {i}. {sheet_name}")

print("\n" + "="*80)

# Inspeccionar cada hoja
for sheet_name in xl_file.sheet_names:
    print(f"\n📄 HOJA: {sheet_name}")
    print("-" * 80)

    try:
        # Leer hoja sin procesar headers automáticamente
        df_raw = pd.read_excel(excel_path, sheet_name=sheet_name, header=None)

        print(f"Dimensiones: {df_raw.shape[0]} filas x {df_raw.shape[1]} columnas")
        print(f"\nPrimeras 20 filas:")

        # Mostrar primeras 20 filas para ver estructura
        for idx in range(min(20, len(df_raw))):
            row = df_raw.iloc[idx]
            # Mostrar solo columnas no vacías
            non_empty = [(i, val) for i, val in enumerate(row) if pd.notna(val)]
            if non_empty:
                print(f"  Fila {idx}: {non_empty}")

        # Identificar posibles tablas (bloques con datos)
        print(f"\nBuscando tablas/bloques de datos...")

        # Buscar filas que parecen encabezados (texto en múltiples columnas consecutivas)
        for idx in range(min(30, len(df_raw))):
            row = df_raw.iloc[idx]
            non_empty_count = row.notna().sum()
            if non_empty_count >= 3:  # Al menos 3 columnas con datos
                print(f"  Posible encabezado en fila {idx}: {row[row.notna()].tolist()}")

    except Exception as e:
        print(f"  ⚠️ Error al leer hoja: {e}")

print("\n" + "="*80)
print("\n✅ Inspección completa finalizada.\n")
