"""
COMPARACIÓN DETALLADA:
Excel extraído completo VS excel_data.json actual
"""

import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Cargar ambos archivos
print('=' * 100)
print('COMPARACIÓN: Excel Completo vs excel_data.json')
print('=' * 100)

# Cargar análisis del Excel
with open('scripts/analisis_excel_completo_mejorado.json', 'r', encoding='utf-8') as f:
    excel_completo = json.load(f)

# Cargar excel_data.json
with open('public/excel_data.json', 'r', encoding='utf-8') as f:
    excel_data_json = json.load(f)

print('\n📊 COMPARACIÓN DE CANTIDADES\n')
print('=' * 100)

# 1. CLIENTES
excel_clientes = len(excel_completo['hojas']['Clientes']['tablas'][0]['datos'])
json_clientes = len(excel_data_json.get('clientes', []))

print(f'\n1️⃣  CLIENTES:')
print(f'   Excel extraído: {excel_clientes} clientes')
print(f'   excel_data.json: {json_clientes} clientes')
print(f'   ❌ DIFERENCIA: {excel_clientes - json_clientes} clientes más en Excel')

# Mostrar primeros clientes del Excel
print(f'\n   Primeros 5 clientes del Excel:')
for i, cliente in enumerate(excel_completo['hojas']['Clientes']['tablas'][0]['datos'][:5], 1):
    print(f'      {i}. {cliente.get("Cliente", "N/A")} - Deuda: {cliente.get("Deuda", 0)}')

# 2. VENTAS (Control_Maestro)
excel_ventas = len(excel_completo['hojas']['Control_Maestro']['tablas'][0]['datos'])
json_ventas = len(excel_data_json.get('ventas', []))

print(f'\n2️⃣  VENTAS (Control_Maestro):')
print(f'   Excel extraído: {excel_ventas} ventas')
print(f'   excel_data.json: {json_ventas} ventas')
if excel_ventas == json_ventas:
    print(f'   ✅ MATCH')
else:
    print(f'   ❌ DIFERENCIA: {abs(excel_ventas - json_ventas)}')

# 3. DISTRIBUIDORES/ÓRDENES DE COMPRA
excel_oc = len([r for r in excel_completo['hojas']['Distribuidores']['tablas'][0]['datos'] if r.get('OC') and str(r['OC']).startswith('OC')])
json_oc = len(excel_data_json.get('compras', []))

print(f'\n3️⃣  ÓRDENES DE COMPRA:')
print(f'   Excel extraído: {excel_oc} órdenes')
print(f'   excel_data.json: {json_oc} órdenes')
if excel_oc == json_oc:
    print(f'   ✅ MATCH')
else:
    print(f'   ❌ DIFERENCIA: {abs(excel_oc - json_oc)}')

# Mostrar primeras 3 OC
print(f'\n   Primeras 3 OC del Excel:')
for i, oc in enumerate(excel_completo['hojas']['Distribuidores']['tablas'][0]['datos'][:3], 1):
    print(f'      {i}. {oc.get("OC")} - {oc.get("Fecha")} - {oc.get("Origen")} - {oc.get("Cantidad")} unidades')

# 4. BÓVEDA MONTE
excel_bm = excel_completo['hojas']['Bóveda_Monte']['tablas'][0]['datos']
excel_bm_ingresos = len([r for r in excel_bm if r.get('Ingreso')])
excel_bm_gastos = len([r for r in excel_bm if r.get('Gasto')])

json_bm_ingresos = len(excel_data_json.get('bancos', {}).get('bovedaMonte', {}).get('ingresos', []))
json_bm_gastos = len(excel_data_json.get('bancos', {}).get('bovedaMonte', {}).get('gastos', []))

print(f'\n4️⃣  BÓVEDA MONTE:')
print(f'   Ingresos - Excel: {excel_bm_ingresos} | JSON: {json_bm_ingresos}', '✅' if excel_bm_ingresos == json_bm_ingresos else '❌')
print(f'   Gastos   - Excel: {excel_bm_gastos} | JSON: {json_bm_gastos}', '✅' if excel_bm_gastos == json_bm_gastos else '❌')

# 5. AZTECA
excel_azteca = excel_completo['hojas']['Azteca']['tablas'][0]['datos']
excel_azteca_ingresos = len([r for r in excel_azteca if r.get('Ingreso') and r['Ingreso']])
excel_azteca_gastos = len([r for r in excel_azteca if r.get('Gasto') and r['Gasto']])

json_azteca_ingresos = len(excel_data_json.get('bancos', {}).get('azteca', {}).get('ingresos', []))
json_azteca_gastos = len(excel_data_json.get('bancos', {}).get('azteca', {}).get('gastos', []))

print(f'\n5️⃣  AZTECA:')
print(f'   Ingresos - Excel: {excel_azteca_ingresos} | JSON: {json_azteca_ingresos}')
print(f'   Gastos   - Excel: {excel_azteca_gastos} | JSON: {json_azteca_gastos}')
print(f'   ❌ El Excel tiene {excel_azteca_ingresos + excel_azteca_gastos} registros vs JSON con {json_azteca_ingresos + json_azteca_gastos}')

# Mostrar primeros registros de Azteca
print(f'\n   Primeros 3 registros de Azteca en Excel:')
for i, reg in enumerate(excel_completo['hojas']['Azteca']['tablas'][0]['datos'][:3], 1):
    print(f'      {i}. Fecha: {reg.get("Fecha")} | Ingreso: {reg.get("Ingreso")} | Gasto: {reg.get("Gasto")}')

# 6. LEFTIE
excel_leftie = excel_completo['hojas']['Leftie']['tablas'][0]['datos']
excel_leftie_ingresos = len([r for r in excel_leftie if r.get('Ingreso')])
excel_leftie_gastos = len([r for r in excel_leftie if r.get('Gasto')])

json_leftie_ingresos = len(excel_data_json.get('bancos', {}).get('leftie', {}).get('ingresos', []))
json_leftie_gastos = len(excel_data_json.get('bancos', {}).get('leftie', {}).get('gastos', []))

print(f'\n6️⃣  LEFTIE:')
print(f'   Ingresos - Excel: {excel_leftie_ingresos} | JSON: {json_leftie_ingresos}', '✅' if excel_leftie_ingresos == json_leftie_ingresos else '❌')
print(f'   Gastos   - Excel: {excel_leftie_gastos} | JSON: {json_leftie_gastos}', '✅' if excel_leftie_gastos == json_leftie_gastos else '❌')

# 7. PROFIT
excel_profit = excel_completo['hojas']['Profit']['tablas'][0]['datos']
excel_profit_ingresos = len([r for r in excel_profit if r.get('Ingreso')])

json_profit_ingresos = len(excel_data_json.get('bancos', {}).get('profit', {}).get('ingresos', []))

print(f'\n7️⃣  PROFIT:')
print(f'   Ingresos - Excel: {excel_profit_ingresos} | JSON: {json_profit_ingresos}', '✅' if excel_profit_ingresos == json_profit_ingresos else '❌')

# 8. BÓVEDA USA
excel_usa = excel_completo['hojas']['Bóveda_USA']['tablas'][0]['datos']
excel_usa_ingresos = len([r for r in excel_usa if r.get('Ingreso')])
excel_usa_gastos = len([r for r in excel_usa if r.get('Gasto')])

json_usa_ingresos = len(excel_data_json.get('bancos', {}).get('bovedaUsa', {}).get('ingresos', []))
json_usa_gastos = len(excel_data_json.get('bancos', {}).get('bovedaUsa', {}).get('gastos', []))

print(f'\n8️⃣  BÓVEDA USA:')
print(f'   Ingresos - Excel: {excel_usa_ingresos} | JSON: {json_usa_ingresos}')
print(f'   Gastos   - Excel: {excel_usa_gastos} | JSON: {json_usa_gastos}')

# 9. ALMACÉN MONTE
excel_almacen = len(excel_completo['hojas']['Almacen_Monte']['tablas'][0]['datos'])
print(f'\n9️⃣  ALMACÉN MONTE:')
print(f'   Total registros en Excel: {excel_almacen}')
print(f'   (Verificar en FlowDistributorData.js)')

# 10. FLETE SUR
excel_flete = len(excel_completo['hojas']['Flete_Sur']['tablas'][0]['datos'])
print(f'\n🔟 FLETE SUR:')
print(f'   Total registros en Excel: {excel_flete}')
print(f'   (Verificar en FlowDistributorData.js)')

print('\n' + '=' * 100)
print('CONCLUSIONES')
print('=' * 100)

print('\n🔴 PROBLEMA PRINCIPAL:')
print(f'   - El Excel tiene {excel_clientes} clientes')
print(f'   - El excel_data.json solo tiene {json_clientes} clientes')
print(f'   - Faltan {excel_clientes - json_clientes} clientes en el JSON')

print('\n🔍 POSIBLES CAUSAS:')
print('   1. El excel_data.json fue generado de un Excel DIFERENTE al que adjuntaste')
print('   2. El Excel que adjuntaste (Copia de Administación_General.xlsx) tiene MÁS datos')
print('   3. Se deben re-importar los datos del Excel correcto')

print('\n✅ DATOS QUE SÍ COINCIDEN:')
print(f'   - Ventas: {excel_ventas} en ambos' if excel_ventas == json_ventas else f'   - Ventas: Excel {excel_ventas} vs JSON {json_ventas}')
print(f'   - Órdenes de Compra: {excel_oc} en ambos' if excel_oc == json_oc else f'   - OC: Excel {excel_oc} vs JSON {json_oc}')

print('\n' + '=' * 100)
