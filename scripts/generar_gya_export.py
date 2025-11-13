"""
Script para generar el export de GASTOS_Y_ABONOS con TODOS los registros
"""
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Cargar datos
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\gastos_y_abonos_generado.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

output = []
output.append('// ============================================================================')
output.append('// GASTOS Y ABONOS CONSOLIDADOS (TODOS LOS BANCOS) - 483 registros')
output.append('// Generado automáticamente desde datos_excel_completos.json')
output.append('// ============================================================================')
output.append('')
output.append('export const GASTOS_Y_ABONOS = [')

for i, item in enumerate(data):
    output.append('  {')
    output.append(f'    id: "{item["id"]}",')
    output.append(f'    fecha: "{item.get("fecha", "")}",')
    output.append(f'    banco: "{item["banco"]}",')
    output.append(f'    tipo: "{item["tipo"]}",')

    if 'origen' in item and item['origen']:
        origen = str(item['origen']).replace('"', '\\"').replace('\n', ' ')
        output.append(f'    origen: "{origen}",')

    if 'destino' in item and item['destino']:
        destino = str(item['destino']).replace('"', '\\"').replace('\n', ' ')
        output.append(f'    destino: "{destino}",')

    concepto = item.get('concepto', '').replace('"', '\\"').replace('\n', ' ')
    output.append(f'    concepto: "{concepto}",')
    output.append(f'    monto: {item["monto"]},')

    observaciones = item.get('observaciones', '').replace('"', '\\"').replace('\n', ' ')
    output.append(f'    observaciones: "{observaciones}"')

    if i < len(data) - 1:
        output.append('  },')
    else:
        output.append('  }')

output.append('];')
output.append('')

# Guardar
codigo = '\n'.join(output)
with open(r'c:\Users\xpovo\Documents\premium-ecosystem\gya_export_completo.js', 'w', encoding='utf-8') as f:
    f.write(codigo)

print(f'✅ CÓDIGO GENERADO: {len(data)} registros')
print(f'📄 Archivo: gya_export_completo.js')
print(f'📊 Líneas de código: {len(output)}')
