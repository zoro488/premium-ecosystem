import json
from datetime import datetime
import sys

# Configurar codificación de salida para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print('MAPEANDO DATOS DEL EXCEL AL FORMATO DEL SISTEMA')
print('='*80)

# Cargar datos extraídos
with open('datos_excel_extraidos.json', 'r', encoding='utf-8') as f:
    datos_excel = json.load(f)

# Cargar estructura actual del sistema
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json', 'r', encoding='utf-8') as f:
    sistema_actual = json.load(f)

# ==============================================================================
# MAPEO 1: DISTRIBUIDORES
# ==============================================================================
print('\n📋 Mapeando DISTRIBUIDORES...')
distribuidores_mapeados = []
distribuidores_unicos = {}

for dist in datos_excel['distribuidores']:
    origen = dist.get('origen', '')
    if not origen:
        continue

    # Agrupar por origen
    if origen not in distribuidores_unicos:
        distribuidores_unicos[origen] = {
            'id': f'DIST-{len(distribuidores_unicos) + 1:03d}',
            'nombre': origen,
            'totalComprado': 0,
            'totalPagado': 0,
            'adeudo': 0,
            'ordenesCompra': 0,
            'estado': 'activo'
        }

    # Acumular datos
    distribuidores_unicos[origen]['totalComprado'] += dist.get('costoTotal', 0) or 0
    distribuidores_unicos[origen]['ordenesCompra'] += 1
    distribuidores_unicos[origen]['adeudo'] += dist.get('deuda', 0) or 0
    distribuidores_unicos[origen]['totalPagado'] += dist.get('pagoDistribuidor', 0) or 0

distribuidores_mapeados = list(distribuidores_unicos.values())
print(f'  ✓ {len(distribuidores_mapeados)} distribuidores únicos mapeados')

# ==============================================================================
# MAPEO 2: CLIENTES
# ==============================================================================
print('\n👥 Mapeando CLIENTES...')
clientes_mapeados = []

for idx, cliente in enumerate(datos_excel['clientes'], 1):
    nombre = cliente.get('nombre', '')
    if not nombre or nombre == 'Pendiente':
        continue

    # Calcular adeudo correctamente
    deuda = cliente.get('deuda', 0) or 0
    abonos = cliente.get('abonos', 0) or 0
    pendiente = cliente.get('pendiente', 0) or 0

    cliente_mapeado = {
        'id': f'CLI-{idx:03d}',
        'nombre': nombre,
        'totalComprado': deuda,
        'totalAbonado': abonos,
        'adeudo': pendiente,
        'estado': 'activo' if pendiente > 0 else 'saldado',
        'observaciones': cliente.get('observaciones', '') or '',
        'ventas': []
    }
    clientes_mapeados.append(cliente_mapeado)

print(f'  ✓ {len(clientes_mapeados)} clientes mapeados')

# ==============================================================================
# MAPEO 3: VENTAS
# ==============================================================================
print('\n📊 Mapeando VENTAS...')
ventas_mapeadas = []

for idx, venta in enumerate(datos_excel['ventas'], 1):
    cliente_nombre = venta.get('cliente', '')
    if not cliente_nombre:
        continue

    cantidad = venta.get('cantidad', 0) or 0
    precio_venta = venta.get('precioVenta', 0) or 0
    ingreso = venta.get('ingreso', 0) or 0
    boveda = venta.get('bovedaMonte', 0) or 0
    utilidad = venta.get('utilidad', 0) or 0
    flete_utilidad = venta.get('fleteUtilidad', 0) or 0

    venta_mapeada = {
        'id': f'VENTA-{venta.get("fecha", "")}-{cliente_nombre}-{idx}',
        'tipo': 'venta',
        'fecha': venta.get('fecha', ''),
        'ocRelacionada': venta.get('ocRelacionada', ''),
        'cantidad': cantidad,
        'cliente': cliente_nombre,
        'productos': [
            {
                'nombre': 'Producto',
                'cantidad': cantidad,
                'precio': precio_venta,
                'subtotal': ingreso
            }
        ],
        'totalVenta': ingreso,
        'totalFletes': flete_utilidad,
        'totalUtilidades': utilidad,
        'estatus': venta.get('estatus', 'Pendiente'),
        'estadoPago': 'pagado' if venta.get('estatus') == 'Pagado' else 'pendiente',
        'adeudo': 0,
        'montoPagado': 0,
        'destino': 'bovedaMonte',
        'concepto': '',
        'aplicaFlete': venta.get('flete') == 'Aplica',
        'bovedaMonte': boveda
    }
    ventas_mapeadas.append(venta_mapeada)

print(f'  ✓ {len(ventas_mapeadas)} ventas mapeadas')

# ==============================================================================
# MAPEO 4: COMPRAS (OCs)
# ==============================================================================
print('\n🛒 Mapeando COMPRAS (OCs)...')
compras_mapeadas = []

for dist in datos_excel['distribuidores']:
    oc = dist.get('oc', '')
    if not oc:
        continue

    cantidad = dist.get('cantidad', 0) or 0
    costo_unidad = dist.get('costoPorUnidad', 0) or 0
    costo_total = dist.get('costoTotal', 0) or 0

    compra = {
        'id': oc,
        'tipo': 'compra',
        'fecha': dist.get('fecha', ''),
        'distribuidor': dist.get('origen', ''),
        'cantidad': cantidad,
        'costoUnitario': costo_unidad,
        'costoTotal': costo_total,
        'costoDistribuidor': dist.get('costoDistribuidor', 0) or 0,
        'costoTransporte': dist.get('costoTransporte', 0) or 0,
        'stockActual': dist.get('stockActual', 0) or 0,
        'montoPagado': dist.get('pagoDistribuidor', 0) or 0,
        'adeudo': dist.get('deuda', 0) or 0,
        'estado': 'completada'
    }
    compras_mapeadas.append(compra)

print(f'  ✓ {len(compras_mapeadas)} compras mapeadas')

# ==============================================================================
# GUARDAR DATOS MAPEADOS
# ==============================================================================
datos_mapeados = {
    'distribuidores': distribuidores_mapeados,
    'clientes': clientes_mapeados,
    'ventas': ventas_mapeadas,
    'compras': compras_mapeadas
}

with open('datos_mapeados.json', 'w', encoding='utf-8') as f:
    json.dump(datos_mapeados, f, ensure_ascii=False, indent=2)

print(f'\n\n✅ MAPEO COMPLETADO')
print(f'   📋 {len(distribuidores_mapeados)} Distribuidores')
print(f'   👥 {len(clientes_mapeados)} Clientes')
print(f'   📊 {len(ventas_mapeadas)} Ventas')
print(f'   🛒 {len(compras_mapeadas)} Compras')
print(f'\n📄 Datos mapeados guardados en: datos_mapeados.json')

# Mostrar resumen de algunos datos
print(f'\n📊 RESUMEN DE DATOS MAPEADOS:')
print(f'\nTop 5 Distribuidores:')
for dist in distribuidores_mapeados[:5]:
    print(f'  - {dist["nombre"]}: ${dist["totalComprado"]:,.0f} ({dist["ordenesCompra"]} OCs)')

print(f'\nTop 5 Clientes por Adeudo:')
clientes_ordenados = sorted(clientes_mapeados, key=lambda x: x['adeudo'], reverse=True)
for cli in clientes_ordenados[:5]:
    print(f'  - {cli["nombre"]}: ${cli["adeudo"]:,.0f}')
