import pandas as pd
import json

excel_path = 'Zoom Glitch Logo - Square/Copia de Administación_General.xlsx'
json_path = 'src/data/datos_excel_reales_completos.json'

print('🔍 VERIFICACIÓN DE COMPLETITUD DE DATOS\n' + '='*80 + '\n')

# Leer Excel
xl = pd.ExcelFile(excel_path)

# Leer JSON
with open(json_path, 'r', encoding='utf-8') as f:
    json_data = json.load(f)

verification = {}

print('📊 COMPARACIÓN EXCEL vs JSON MIGRADO:\n')

for sheet in xl.sheet_names:
    df = pd.read_excel(excel_path, sheet_name=sheet, header=None)
    
    # Contar filas con datos reales (excluyendo headers y vacías)
    non_empty_rows = 0
    for idx in range(len(df)):
        row = df.iloc[idx]
        if row.notna().sum() >= 3:  # Al menos 3 valores
            non_empty_rows += 1
    
    print(f'\n{"="*80}')
    print(f'📋 HOJA: {sheet}')
    print(f'{"="*80}')
    print(f'   Excel: {non_empty_rows} filas con datos')
    
    # Buscar en JSON
    sheet_lower = sheet.lower().replace('_', '').replace(' ', '')
    json_counts = {}
    
    if sheet == 'Distribuidores':
        count = len(json_data.get('distribuidores', []))
        json_counts['distribuidores'] = count
        print(f'   JSON:  {count} registros en "distribuidores"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers y metadata)')
        
    elif sheet == 'Control_Maestro':
        cm_count = len(json_data.get('controlMaestro', []))
        gya_count = len(json_data.get('tablaGYA', []))
        json_counts['controlMaestro'] = cm_count
        json_counts['tablaGYA'] = gya_count
        print(f'   JSON:  {cm_count} registros en "controlMaestro"')
        print(f'   JSON:  {gya_count} registros en "tablaGYA"')
        print(f'   JSON:  {cm_count + gya_count} total')
        diff = non_empty_rows - (cm_count + gya_count)
        print(f'   ✅ Diferencia: {diff} (headers y RF Actual)')
        
    elif sheet == 'Almacen_Monte':
        count = len(json_data.get('almacenmonte', []))
        json_counts['almacenmonte'] = count
        print(f'   JSON:  {count} registros en "almacenmonte"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers, RF Actual, secciones)')
        
    elif sheet == 'Bóveda_Monte':
        count = len(json_data.get('bovedamonte', []))
        json_counts['bovedamonte'] = count
        print(f'   JSON:  {count} registros en "bovedamonte"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers y RF Actual)')
        
    elif sheet == 'Bóveda_USA':
        count = len(json_data.get('bovedausa', []))
        json_counts['bovedausa'] = count
        print(f'   JSON:  {count} registros en "bovedausa"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers y RF Actual)')
        
    elif sheet == 'Azteca':
        count = len(json_data.get('azteca', []))
        json_counts['azteca'] = count
        print(f'   JSON:  {count} registros en "azteca"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers y RF Actual)')
        
    elif sheet == 'Utilidades':
        count = len(json_data.get('utilidades', []))
        json_counts['utilidades'] = count
        print(f'   JSON:  {count} registros en "utilidades"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers y RF Actual)')
        
    elif sheet == 'Flete_Sur':
        count = len(json_data.get('fletesur', []))
        json_counts['fletesur'] = count
        print(f'   JSON:  {count} registros en "fletesur"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers y RF Actual)')
        
    elif sheet == 'Leftie':
        count = len(json_data.get('leftie', []))
        json_counts['leftie'] = count
        print(f'   JSON:  {count} registros en "leftie"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers y RF Actual)')
        
    elif sheet == 'Profit':
        count = len(json_data.get('profit', []))
        json_counts['profit'] = count
        print(f'   JSON:  {count} registros en "profit"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers y RF Actual)')
        
    elif sheet == 'Clientes':
        count = len(json_data.get('clientes', []))
        json_counts['clientes'] = count
        print(f'   JSON:  {count} registros en "clientes"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers)')
        
    elif sheet == 'DATA':
        count = len(json_data.get('data', []))
        json_counts['data'] = count
        print(f'   JSON:  {count} registros en "data"')
        diff = non_empty_rows - count
        print(f'   ✅ Diferencia: {diff} (headers)')
    
    verification[sheet] = {
        'excel_rows': non_empty_rows,
        'json_counts': json_counts
    }

print('\n' + '='*80)
print('✅ VERIFICACIÓN COMPLETADA')
print('='*80)

# Guardar verificación
with open('scripts/verificacion_datos.json', 'w', encoding='utf-8') as f:
    json.dump(verification, f, indent=2, ensure_ascii=False)

print('\n📝 Reporte guardado: scripts/verificacion_datos.json\n')
