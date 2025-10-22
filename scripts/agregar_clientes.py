#!/usr/bin/env python3
"""
Agregar clientes faltantes al sistema
"""
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Cargar JSON actual
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Agregar clientes faltantes
nuevos_clientes = [
    {
        'nombre': 'Trámite Chucho',
        'adeudo': 0,
        'totalComprado': 0,
        'totalAbonado': 0,
        'estado': 'activo',
        'observaciones': 'Cliente de trámites y traspasos internos',
        'ventas': []
    }
]

# Verificar si ya existen
clientes_existentes = {c['nombre'] for c in data['clientes']}
agregados = 0

for nuevo in nuevos_clientes:
    if nuevo['nombre'] not in clientes_existentes:
        data['clientes'].append(nuevo)
        print(f'OK - Agregado: {nuevo["nombre"]}')
        agregados += 1
    else:
        print(f'INFO - Ya existe: {nuevo["nombre"]}')

# Guardar
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nTotal clientes ahora: {len(data["clientes"])}')
print(f'Clientes agregados: {agregados}')
