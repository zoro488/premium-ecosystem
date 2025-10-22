#!/usr/bin/env python3
"""
Análisis exhaustivo de consistencia de datos
"""
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Cargar JSON
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=' * 80)
print('ANALISIS DE CONSISTENCIA DE DATOS')
print('=' * 80)

# 1. Verificar estructura completa
print('\n[ESTRUCTURA DE DATOS]')
print(f'  ventas: {len(data.get("ventas", []))} registros')
print(f'  clientes: {len(data.get("clientes", []))} registros')
print(f'  ordenesCompra: {len(data.get("ordenesCompra", []))} registros')
print(f'  distribuidores: {len(data.get("distribuidores", []))} registros')
print(f'  almacen.entradas: {len(data.get("almacen", {}).get("entradas", []))} registros')
print(f'  almacen.salidas: {len(data.get("almacen", {}).get("salidas", []))} registros')

bancos_count = sum(1 for k, v in data.get('bancos', {}).items() if v is not None)
print(f'  bancos: {bancos_count} configurados')

# 2. Verificar integridad de entradas
print('\n[VERIFICACION DE ENTRADAS]')
entradas_ok = 0
entradas_con_problemas = []
required_fields = ['costoUnitario', 'costoTotal', 'proveedor', 'numeroFactura', 'nombre']

for entrada in data.get('almacen', {}).get('entradas', []):
    if all(k in entrada for k in required_fields):
        entradas_ok += 1
    else:
        missing = [k for k in required_fields if k not in entrada]
        entradas_con_problemas.append((entrada.get('id', 'Unknown'), missing))

total_entradas = len(data.get('almacen', {}).get('entradas', []))
print(f'  OK: {entradas_ok}/{total_entradas} entradas con datos completos')
if entradas_con_problemas:
    print(f'  PROBLEMAS encontrados: {len(entradas_con_problemas)} entradas')
    for eid, missing in entradas_con_problemas[:3]:
        print(f'    - {eid}: faltan {missing}')

# 3. Verificar integridad de salidas
print('\n[VERIFICACION DE SALIDAS]')
salidas_ok = 0
salidas_con_problemas = []
required_salidas = ['precioVenta', 'valorTotal', 'motivoSalida', 'nombre']

for salida in data.get('almacen', {}).get('salidas', []):
    if all(k in salida for k in required_salidas):
        salidas_ok += 1
    else:
        missing = [k for k in required_salidas if k not in salida]
        salidas_con_problemas.append((salida.get('id', 'Unknown'), missing))

total_salidas = len(data.get('almacen', {}).get('salidas', []))
print(f'  OK: {salidas_ok}/{total_salidas} salidas con datos completos')
if salidas_con_problemas:
    print(f'  PROBLEMAS encontrados: {len(salidas_con_problemas)} salidas')
    for sid, missing in salidas_con_problemas[:3]:
        print(f'    - {sid}: faltan {missing}')

# 4. Verificar órdenes de compra
print('\n[VERIFICACION DE ORDENES DE COMPRA]')
ocs_con_adeudo = sum(1 for oc in data.get('ordenesCompra', []) if oc.get('adeudo', 0) > 0)
ocs_sin_adeudo = len(data.get('ordenesCompra', [])) - ocs_con_adeudo
print(f'  Con adeudo > $0: {ocs_con_adeudo}/{len(data.get("ordenesCompra", []))}')
print(f'  Sin adeudo: {ocs_sin_adeudo}')

if ocs_sin_adeudo > 0:
    print('  ADVERTENCIA: Hay OCs sin adeudo')
    for oc in data.get('ordenesCompra', []):
        if oc.get('adeudo', 0) == 0:
            print(f'    - {oc.get("id")}: costo total = ${oc.get("costoTotal", 0):,.0f}')

# 5. Verificar ventas
print('\n[VERIFICACION DE VENTAS]')
ventas_pendientes = sum(1 for v in data.get('ventas', []) if v.get('estadoPago') == 'pendiente')
ventas_completas = sum(1 for v in data.get('ventas', []) if v.get('estadoPago') == 'completo')
print(f'  Pendientes: {ventas_pendientes}')
print(f'  Completas: {ventas_completas}')

# 6. Calcular totales
total_adeudo_clientes = sum(c.get('adeudo', 0) for c in data.get('clientes', []))
total_adeudo_ocs = sum(oc.get('adeudo', 0) for oc in data.get('ordenesCompra', []))
total_ventas_pendientes = sum(v.get('adeudo', 0) for v in data.get('ventas', []) if v.get('estadoPago') == 'pendiente')

print('\n[TOTALES FINANCIEROS]')
print(f'  Adeudo total clientes: ${total_adeudo_clientes:,.0f}')
print(f'  Adeudo total OCs: ${total_adeudo_ocs:,.0f}')
print(f'  Adeudo ventas pendientes: ${total_ventas_pendientes:,.0f}')

# 7. Verificar consistencia de relaciones
print('\n[CONSISTENCIA DE RELACIONES]')
clientes_en_ventas = set(v.get('cliente') for v in data.get('ventas', []))
clientes_registrados = set(c.get('nombre') for c in data.get('clientes', []))
clientes_sin_registro = clientes_en_ventas - clientes_registrados

print(f'  Clientes únicos en ventas: {len(clientes_en_ventas)}')
print(f'  Clientes registrados: {len(clientes_registrados)}')
if clientes_sin_registro:
    print(f'  ADVERTENCIA: {len(clientes_sin_registro)} clientes en ventas sin registro')
    for cliente in list(clientes_sin_registro)[:5]:
        print(f'    - {cliente}')

# 8. Verificar duplicados
print('\n[VERIFICACION DE DUPLICADOS]')
ventas_ids = [v.get('id') for v in data.get('ventas', [])]
ventas_duplicadas = len(ventas_ids) - len(set(ventas_ids))
print(f'  IDs de ventas duplicados: {ventas_duplicadas}')

entradas_ids = [e.get('id') for e in data.get('almacen', {}).get('entradas', [])]
entradas_duplicadas = len(entradas_ids) - len(set(entradas_ids))
print(f'  IDs de entradas duplicados: {entradas_duplicadas}')

salidas_ids = [s.get('id') for s in data.get('almacen', {}).get('salidas', [])]
salidas_duplicadas = len(salidas_ids) - len(set(salidas_ids))
print(f'  IDs de salidas duplicados: {salidas_duplicadas}')

print('\n' + '=' * 80)
print('ANALISIS COMPLETADO')
print('=' * 80)
