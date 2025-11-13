import io
import json
import sys
from datetime import datetime

# Configurar encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
elif hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print('CARGANDO DATOS COMPLETOS EN EL SISTEMA')
print('='*80)

# Cargar datos extraídos del Excel
with open('datos_excel_completos.json', 'r', encoding='utf-8') as f:
    datos_excel = json.load(f)

# Cargar sistema actual
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json', 'r', encoding='utf-8') as f:
    sistema = json.load(f)

# ==============================================================================
# 1. CARGAR BANCOS COMPLETOS
# ==============================================================================
print('\n💰 CARGANDO BANCOS CON TODOS SUS MOVIMIENTOS...')

# Mapear nombres de bancos
bancos_sistema = {}

for nombre_banco, datos_banco in datos_excel['bancos'].items():
    print(f'\n  📊 {nombre_banco.upper()}')
    print(f'     Saldo: ${datos_banco["saldoActual"]:,.0f}')
    print(f'     Ingresos: {len(datos_banco["ingresos"])} (${datos_banco["totalIngresos"]:,.0f})')
    print(f'     Gastos: {len(datos_banco["gastos"])} (${datos_banco["totalGastos"]:,.0f})')

    # Formatear ingresos para el sistema
    ingresos_formateados = []
    for ing in datos_banco['ingresos']:
        ingresos_formateados.append({
            'fecha': ing['fecha'],
            'concepto': f"{ing['cliente'] or 'N/A'} - {ing['concepto'] or ''}",
            'monto': ing['monto'],
            'origen': ing['cliente'] or 'N/A'
        })

    # Formatear gastos para el sistema
    gastos_formateados = []
    for gasto in datos_banco['gastos']:
        gastos_formateados.append({
            'fecha': gasto['fecha'],
            'concepto': f"{gasto['origen'] or 'N/A'} - {gasto['concepto'] or ''}",
            'monto': gasto['monto'],
            'destino': gasto['origen'] or 'N/A'
        })

    bancos_sistema[nombre_banco] = {
        'nombre': nombre_banco,
        'capitalActual': datos_banco['saldoActual'],
        'ingresos': ingresos_formateados,
        'gastos': gastos_formateados,
        'estado': 'negativo' if datos_banco['saldoActual'] < 0 else 'activo'
    }

sistema['bancos'] = bancos_sistema
print(f'\n  ✓ {len(bancos_sistema)} bancos cargados completamente')

# ==============================================================================
# 2. CARGAR ALMACÉN
# ==============================================================================
print('\n📦 CARGANDO ALMACÉN (INVENTARIO)...')

almacen_data = datos_excel['almacen']

# Formatear movimientos de almacén
movimientos_almacen = []

# Agregar entradas
for entrada in almacen_data['entradas']:
    movimientos_almacen.append({
        'tipo': 'entrada',
        'fecha': entrada['fecha'],
        'cantidad': entrada['cantidad'],
        'origen': entrada['distribuidor'],
        'oc': entrada['oc']
    })

# Agregar salidas
for salida in almacen_data['salidas']:
    movimientos_almacen.append({
        'tipo': 'salida',
        'fecha': salida['fecha'],
        'cantidad': salida['cantidad'],
        'destino': salida['cliente']
    })

sistema['almacen'] = {
    'stockActual': almacen_data['stockActual'],
    'totalEntradas': almacen_data['totalEntradas'],
    'totalSalidas': almacen_data['totalSalidas'],
    'movimientos': movimientos_almacen
}

print(f'  ✓ Stock actual: {almacen_data["stockActual"]} unidades')
print(f'  ✓ {len(movimientos_almacen)} movimientos cargados')

# ==============================================================================
# 3. ACTUALIZAR DISTRIBUIDORES CON DEUDAS REALES
# ==============================================================================
print('\n📋 CARGANDO DISTRIBUIDORES CON DEUDAS...')

# Crear mapa de distribuidores del Excel
distribuidores_excel = {d['nombre']: d for d in datos_excel['distribuidores']}

# Actualizar distribuidores existentes o crear nuevos
distribuidores_sistema = sistema.get('distribuidores', [])
distribuidores_actualizados = []

# Actualizar existentes
for dist in distribuidores_sistema:
    if dist['nombre'] in distribuidores_excel:
        datos_excel_dist = distribuidores_excel[dist['nombre']]
        dist['totalComprado'] = datos_excel_dist['costoTotal']
        dist['totalPagado'] = datos_excel_dist['abonos']
        dist['adeudo'] = datos_excel_dist['deuda']
        print(f'  ✓ {dist["nombre"]}: Deuda ${dist["adeudo"]:,.0f}')
        distribuidores_actualizados.append(dist)
        del distribuidores_excel[dist['nombre']]
    else:
        distribuidores_actualizados.append(dist)

# Agregar distribuidores nuevos del Excel
for nombre, datos in distribuidores_excel.items():
    nuevo_dist = {
        'id': f'DIST-{len(distribuidores_actualizados) + 1:03d}',
        'nombre': nombre,
        'totalComprado': datos['costoTotal'],
        'totalPagado': datos['abonos'],
        'adeudo': datos['deuda'],
        'ordenesCompra': 0,
        'estado': 'activo',
        'ordenes': [],
        'pagos': []
    }
    distribuidores_actualizados.append(nuevo_dist)
    print(f'  + {nombre}: Deuda ${datos["deuda"]:,.0f}')

sistema['distribuidores'] = distribuidores_actualizados

# ==============================================================================
# 4. ACTUALIZAR ÓRDENES DE COMPRA
# ==============================================================================
print('\n🛒 CARGANDO ÓRDENES DE COMPRA...')

compras_sistema = []
for oc in datos_excel['ordenesCompra']:
    compra = {
        'id': oc['oc'],
        'tipo': 'compra',
        'fecha': oc['fecha'],
        'distribuidor': oc['origen'],
        'cantidad': oc['cantidad'],
        'costoUnitario': oc['costoPorUnidad'],
        'costoTotal': oc['costoTotal'],
        'costoDistribuidor': oc['costoDistribuidor'],
        'costoTransporte': oc['costoTransporte'],
        'estado': 'completada'
    }
    compras_sistema.append(compra)

sistema['compras'] = compras_sistema
print(f'  ✓ {len(compras_sistema)} órdenes de compra cargadas')

# ==============================================================================
# 5. ACTUALIZAR CLIENTES
# ==============================================================================
print('\n👥 ACTUALIZANDO CLIENTES...')

clientes_excel = {c['nombre']: c for c in datos_excel['clientes']}
clientes_sistema = sistema.get('clientes', [])
clientes_actualizados = []

for cli in clientes_sistema:
    if cli['nombre'] in clientes_excel:
        datos_cli = clientes_excel[cli['nombre']]
        cli['totalComprado'] = datos_cli['deuda']
        cli['totalAbonado'] = datos_cli['abonos']
        cli['adeudo'] = datos_cli['pendiente']
        cli['estado'] = 'activo' if datos_cli['pendiente'] > 0 else 'saldado'
        if datos_cli['observaciones']:
            cli['observaciones'] = datos_cli['observaciones']
        clientes_actualizados.append(cli)
        del clientes_excel[cli['nombre']]
    else:
        clientes_actualizados.append(cli)

# Agregar clientes nuevos
for nombre, datos in clientes_excel.items():
    nuevo_cli = {
        'id': f'CLI-{len(clientes_actualizados) + 1:03d}',
        'nombre': nombre,
        'totalComprado': datos['deuda'],
        'totalAbonado': datos['abonos'],
        'adeudo': datos['pendiente'],
        'estado': 'activo' if datos['pendiente'] > 0 else 'saldado',
        'observaciones': datos['observaciones'],
        'ventas': []
    }
    clientes_actualizados.append(nuevo_cli)

sistema['clientes'] = clientes_actualizados
print(f'  ✓ {len(clientes_actualizados)} clientes actualizados')

# ==============================================================================
# 6. ACTUALIZAR METADATOS
# ==============================================================================
sistema['ultimaActualizacion'] = datetime.now().isoformat()
sistema['version'] = '3.0-excel-completo'
sistema['estado'] = 'sincronizado-excel'

# ==============================================================================
# 7. GUARDAR SISTEMA ACTUALIZADO
# ==============================================================================
print('\n💾 GUARDANDO SISTEMA ACTUALIZADO...')

# Backup
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.backup.json', 'w', encoding='utf-8') as f:
    json.dump(sistema, f, ensure_ascii=False, indent=2)
print('  ✓ Backup creado')

# Guardar
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json', 'w', encoding='utf-8') as f:
    json.dump(sistema, f, ensure_ascii=False, indent=2)
print('  ✓ Sistema actualizado')

# ==============================================================================
# RESUMEN FINAL
# ==============================================================================
print('\n' + '='*80)
print('✅ CARGA COMPLETA EXITOSA')
print('='*80)
print('\n📊 RESUMEN DE DATOS CARGADOS:')
print('\n💰 BANCOS:')
for nombre, banco in bancos_sistema.items():
    print(f'   - {nombre}: ${banco["capitalActual"]:,.0f}')

print('\n📦 ALMACÉN:')
print(f'   - Stock: {almacen_data["stockActual"]} unidades')
print(f'   - Movimientos: {len(movimientos_almacen)}')

print('\n📋 DISTRIBUIDORES:')
for dist in distribuidores_actualizados:
    if dist['adeudo'] > 0:
        print(f'   - {dist["nombre"]}: ${dist["adeudo"]:,.0f}')

print(f'\n🛒 COMPRAS: {len(compras_sistema)} órdenes')
print(f'👥 CLIENTES: {len(clientes_actualizados)} clientes')
print(f'📊 VENTAS: {len(sistema.get("ventas", []))} ventas')

print('\n🎯 SISTEMA LISTO PARA USAR!')
