import pandas as pd
import json
from pathlib import Path
import numpy as np

excel_path = 'Zoom Glitch Logo - Square/Copia de Administación_General.xlsx'

# Leer todas las hojas
xl_file = pd.ExcelFile(excel_path)
print(f"📊 ANÁLISIS AVANZADO DEL EXCEL\n{'='*70}\n")
print(f"📁 Archivo: {excel_path}")
print(f"📄 Total de hojas: {len(xl_file.sheet_names)}\n")

analysis = {
    'hojas': [],
    'estadisticas': {},
    'relaciones': {}
}

for sheet_name in xl_file.sheet_names:
    try:
        df = pd.read_excel(excel_path, sheet_name=sheet_name)
        
        print(f"\n{'='*70}")
        print(f"📋 HOJA: {sheet_name}")
        print(f"{'='*70}")
        print(f"  ├─ Dimensiones: {df.shape[0]} filas x {df.shape[1]} columnas")
        print(f"  ├─ Columnas: {list(df.columns)}")
        print(f"  ├─ Tipos de datos:")
        
        # Análisis profundo
        hoja_info = {
            'nombre': sheet_name,
            'filas': int(df.shape[0]),
            'columnas': int(df.shape[1]),
            'nombres_columnas': list(df.columns),
            'tipos_datos': df.dtypes.astype(str).to_dict(),
            'valores_unicos': {},
            'estadisticas': {},
            'valores_nulos': df.isnull().sum().to_dict()
        }
        
        for col in df.columns:
            print(f"     • {col}: {df[col].dtype} ({df[col].notna().sum()}/{len(df)} valores)")
            
            # Valores únicos
            unique_vals = df[col].nunique()
            hoja_info['valores_unicos'][col] = int(unique_vals)
            
            # Estadísticas para columnas numéricas
            if pd.api.types.is_numeric_dtype(df[col]):
                stats = {
                    'min': float(df[col].min()) if pd.notna(df[col].min()) else None,
                    'max': float(df[col].max()) if pd.notna(df[col].max()) else None,
                    'mean': float(df[col].mean()) if pd.notna(df[col].mean()) else None,
                    'sum': float(df[col].sum()) if pd.notna(df[col].sum()) else None,
                    'std': float(df[col].std()) if pd.notna(df[col].std()) else None
                }
                hoja_info['estadisticas'][col] = stats
                print(f"        ├─ Min: {stats['min']}, Max: {stats['max']}, Mean: {stats['mean']:.2f}" if stats['mean'] else "")
        
        # Mostrar primeras 3 filas
        print(f"\n  📌 Primeras 3 filas:")
        print(df.head(3).to_string(index=False)[:500])
        
        analysis['hojas'].append(hoja_info)
        
    except Exception as e:
        print(f"  ❌ Error leyendo {sheet_name}: {str(e)}")
        analysis['hojas'].append({
            'nombre': sheet_name,
            'error': str(e)
        })

# Guardar análisis completo
output_path = 'scripts/analisis_excel_completo_ciencia_datos.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(analysis, f, indent=2, ensure_ascii=False, default=str)

print(f"\n\n{'='*70}")
print(f"✅ Análisis guardado en: {output_path}")
print(f"{'='*70}\n")
