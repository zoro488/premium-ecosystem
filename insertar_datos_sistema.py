import json
import sys
from datetime import datetime

# Configurar codificación de salida para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print('INSERTANDO DATOS DEL EXCEL EN EL SISTEMA')
print('='*80)

# Cargar datos mapeados
with open('datos_mapeados.json', 'r', encoding='utf-8') as f:
    datos_mapeados = json.load(f)

# Cargar sistema actual
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json', 'r', encoding='utf-8') as f:
    sistema = json.load(f)

print('\nESTADO ANTERIOR:')
print(f'  - Distribuidores: {len(sistema.get("distribuidores", []))}')
print(f'  - Clientes: {len(sistema.get("clientes", []))}')
print(f'  - Ventas: {len(sistema.get("ventas", []))}')
print(f'  - Compras: {len(sistema.get("compras", []))}')

# ==============================================================================
# INSERTAR DISTRIBUIDORES
# ==============================================================================
print('\n📋 Insertando DISTRIBUIDORES...')

# Crear un mapa de distribuidores existentes por nombre
distribuidores_existentes = {d['nombre']: d for d in sistema.get('distribuidores', [])}

# Actualizar/agregar distribuidores
for dist_nuevo in datos_mapeados['distribuidores']:
    nombre = dist_nuevo['nombre']
    if nombre in distribuidores_existentes:
        # Actualizar distribuidor existente
        dist_existente = distribuidores_existentes[nombre]
        dist_existente['totalComprado'] = dist_nuevo['totalComprado']
        dist_existente['totalPagado'] = dist_nuevo['totalPagado']
        dist_existente['adeudo'] = dist_nuevo['adeudo']
        dist_existente['ordenesCompra'] = dist_nuevo['ordenesCompra']
        print(f'  ✓ Actualizado: {nombre}')
    else:
        # Agregar nuevo distribuidor
        sistema['distribuidores'].append(dist_nuevo)
        print(f'  + Agregado: {nombre}')

# ==============================================================================
# INSERTAR CLIENTES
# ==============================================================================
print('\n👥 Insertando CLIENTES...')

# Crear un mapa de clientes existentes por nombre
clientes_existentes = {c['nombre']: c for c in sistema.get('clientes', [])}

# Actualizar/agregar clientes
for cli_nuevo in datos_mapeados['clientes']:
    nombre = cli_nuevo['nombre']
    if nombre in clientes_existentes:
        # Actualizar cliente existente
        cli_existente = clientes_existentes[nombre]
        cli_existente['totalComprado'] = cli_nuevo['totalComprado']
        cli_existente['totalAbonado'] = cli_nuevo['totalAbonado']
        cli_existente['adeudo'] = cli_nuevo['adeudo']
        cli_existente['estado'] = cli_nuevo['estado']
        if cli_nuevo['observaciones']:
            cli_existente['observaciones'] = cli_nuevo['observaciones']
        print(f'  ✓ Actualizado: {nombre}')
    else:
        # Agregar nuevo cliente
        sistema['clientes'].append(cli_nuevo)
        print(f'  + Agregado: {nombre}')

# ==============================================================================
# INSERTAR COMPRAS
# ==============================================================================
print('\n🛒 Insertando COMPRAS...')

# Crear un mapa de compras existentes por ID
compras_existentes = {c['id']: c for c in sistema.get('compras', [])}

# Actualizar/agregar compras
for compra_nueva in datos_mapeados['compras']:
    id_compra = compra_nueva['id']
    if id_compra in compras_existentes:
        # Actualizar compra existente
        compras_existentes[id_compra].update(compra_nueva)
        print(f'  ✓ Actualizado: {id_compra}')
    else:
        # Agregar nueva compra
        sistema['compras'].append(compra_nueva)
        print(f'  + Agregado: {id_compra}')

# ==============================================================================
# ACTUALIZAR METADATOS
# ==============================================================================
sistema['ultimaActualizacion'] = datetime.now().isoformat()
sistema['version'] = '2.0-excel-import'

# ==============================================================================
# GUARDAR SISTEMA ACTUALIZADO
# ==============================================================================
print('\n💾 Guardando sistema actualizado...')

# Hacer backup del sistema actual
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.backup.json', 'w', encoding='utf-8') as f:
    json.dump(sistema, f, ensure_ascii=False, indent=2)
print('  ✓ Backup creado: excel_data.backup.json')

# Guardar sistema actualizado
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json', 'w', encoding='utf-8') as f:
    json.dump(sistema, f, ensure_ascii=False, indent=2)
print('  ✓ Sistema actualizado guardado')

print('\n✅ DATOS INSERTADOS EXITOSAMENTE')
print('\nESTADO FINAL:')
print(f'  - Distribuidores: {len(sistema.get("distribuidores", []))}')
print(f'  - Clientes: {len(sistema.get("clientes", []))}')
print(f'  - Ventas: {len(sistema.get("ventas", []))}')
print(f'  - Compras: {len(sistema.get("compras", []))}')

print('\n📊 RESUMEN DE CAMBIOS:')
print(f'  ✓ Distribuidores actualizados/agregados desde Excel')
print(f'  ✓ Clientes actualizados/agregados desde Excel')
print(f'  ✓ {len(datos_mapeados["compras"])} Compras insertadas')
print(f'  ✓ Datos sincronizados con el Excel')
