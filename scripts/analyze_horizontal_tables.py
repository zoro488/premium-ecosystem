import pandas as pd
import json
from pathlib import Path

excel_path = 'Zoom Glitch Logo - Square/Copia de Administación_General.xlsx'

print(f"📊 RE-ANÁLISIS EXCEL - TABLAS HORIZONTALES\n{'='*80}\n")

# Leer Excel completo
xl_file = pd.ExcelFile(excel_path)
analisis_completo = {}

for sheet_name in xl_file.sheet_names:
    try:
        # Leer TODA la hoja sin procesar
        df = pd.read_excel(excel_path, sheet_name=sheet_name, header=None)
        
        print(f"\n{'='*80}")
        print(f"📋 HOJA: {sheet_name}")
        print(f"{'='*80}")
        print(f"Dimensiones totales: {df.shape[0]} filas x {df.shape[1]} columnas\n")
        
        # Buscar encabezados (filas que contienen nombres de columnas)
        encabezados_encontrados = []
        tablas_encontradas = []
        
        for idx in range(min(5, len(df))):  # Revisar primeras 5 filas
            row = df.iloc[idx]
            non_null = row.notna().sum()
            
            if non_null >= 3:  # Si tiene al menos 3 valores
                print(f"Fila {idx}: {non_null} valores -> {row.tolist()[:15]}")
                
                # Detectar si es encabezado
                valores = [str(v) for v in row.tolist() if pd.notna(v)]
                if valores:
                    encabezados_encontrados.append({
                        'fila': idx,
                        'columnas': valores
                    })
        
        # Mostrar sección de datos para entender estructura
        print(f"\n📌 Primeras 10 filas completas:")
        print(df.head(10).to_string(max_rows=10, max_cols=25))
        
        # Detectar grupos de columnas (separadas por columnas vacías)
        grupos_columnas = []
        grupo_actual = []
        
        primera_fila_datos = df.iloc[2] if len(df) > 2 else df.iloc[0]
        
        for col_idx in range(len(primera_fila_datos)):
            if pd.notna(primera_fila_datos.iloc[col_idx]):
                grupo_actual.append(col_idx)
            else:
                if len(grupo_actual) >= 2:  # Grupo válido
                    grupos_columnas.append(grupo_actual)
                grupo_actual = []
        
        if len(grupo_actual) >= 2:
            grupos_columnas.append(grupo_actual)
        
        print(f"\n🔍 Grupos de columnas detectados: {len(grupos_columnas)}")
        for i, grupo in enumerate(grupos_columnas):
            print(f"  Grupo {i+1}: columnas {grupo[0]}-{grupo[-1]} ({len(grupo)} cols)")
        
        analisis_completo[sheet_name] = {
            'dimensiones': [df.shape[0], df.shape[1]],
            'encabezados': encabezados_encontrados,
            'grupos_columnas': grupos_columnas,
            'total_grupos': len(grupos_columnas)
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        analisis_completo[sheet_name] = {'error': str(e)}

# Guardar análisis
output = 'scripts/analisis_tablas_horizontales.json'
with open(output, 'w', encoding='utf-8') as f:
    json.dump(analisis_completo, f, indent=2, ensure_ascii=False)

print(f"\n\n{'='*80}")
print(f"✅ Análisis guardado: {output}")
print(f"{'='*80}")
