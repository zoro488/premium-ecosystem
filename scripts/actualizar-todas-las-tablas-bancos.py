"""
Script para actualizar TODOS los paneles de banco con TablaCortesPremium y TablaTransferenciasPremium
"""
import re
import os
import sys

# Fix encoding para Windows
sys.stdout.reconfigure(encoding='utf-8')

RUTA_COMPONENTES = r'c:\Users\xpovo\Documents\premium-ecosystem\src\apps\FlowDistributor\components'

BANCOS = [
    ('PanelBovedaMonte.jsx', 'Bóveda Monte'),
    ('PanelBovedaUSA.jsx', 'Bóveda USA'),
    ('PanelFleteSur.jsx', 'Flete Sur'),
    ('PanelAzteca.jsx', 'Azteca'),
    ('PanelLeftie.jsx', 'Leftie'),
    ('PanelProfit.jsx', 'Profit'),
]

def actualizar_panel(archivo, nombre_banco):
    ruta = os.path.join(RUTA_COMPONENTES, archivo)

    print(f'\n📦 Procesando: {archivo}')

    try:
        with open(ruta, 'r', encoding='utf-8') as f:
            contenido = f.read()

        # 1. Actualizar import para agregar TablaCortesPremium y TablaTransferenciasPremium
        patron_import = r"import \{ TablaIngresosPremium, TablaGastosPremium \} from '\./TablasBancoPremium';"
        nuevo_import = """import {
  TablaIngresosPremium,
  TablaGastosPremium,
  TablaCortesPremium,
  TablaTransferenciasPremium,
} from './TablasBancoPremium';"""

        if 'TablaCortesPremium' not in contenido:
            contenido = re.sub(patron_import, nuevo_import, contenido)
            print(f'  ✅ Import actualizado')
        else:
            print(f'  ℹ️  Import ya estaba actualizado')

        # 2. Reemplazar tab de CORTES
        # Buscar inicio del tab cortes
        patron_cortes_inicio = r"\{tabActiva === 'cortes' && \("

        # Buscar la sección completa de cortes (desde {tabActiva hasta el cierre })
        match_cortes = re.search(
            r"\{tabActiva === 'cortes' && \([\s\S]*?\)\}(?=\s*\{/\* TRANSFERENCIAS|$)",
            contenido
        )

        if match_cortes:
            # Crear el nuevo código para cortes
            nuevo_cortes = """{tabActiva === 'cortes' && (
            <TablaCortesPremium
              cortes={cortes.map((c) => ({
                ...c,
                monto: parseFloat(c.corte) || parseFloat(c.monto) || 0,
              }))}
              titulo="RF Actual - """ + nombre_banco + """"
              onAgregar={() => openModal('corte')}
            />
          )}"""

            contenido = contenido[:match_cortes.start()] + nuevo_cortes + contenido[match_cortes.end():]
            print(f'  ✅ Tab CORTES actualizado')
        else:
            print(f'  ⚠️  No se encontró tab de cortes')

        # 3. Reemplazar tab de TRANSFERENCIAS
        match_transferencias = re.search(
            r"\{tabActiva === 'transferencias' && \([\s\S]*?\)\}(?=\s*</AnimatePresence>)",
            contenido
        )

        if match_transferencias:
            # Crear el nuevo código para transferencias
            nuevo_transferencias = """{tabActiva === 'transferencias' && (
            <TablaTransferenciasPremium
              transferencias={transferencias}
              titulo="Transferencias - """ + nombre_banco + """"
              onAgregar={() => openModal('transferencia')}
            />
          )}"""

            contenido = contenido[:match_transferencias.start()] + nuevo_transferencias + contenido[match_transferencias.end():]
            print(f'  ✅ Tab TRANSFERENCIAS actualizado')
        else:
            print(f'  ⚠️  No se encontró tab de transferencias')

        # Guardar archivo actualizado
        with open(ruta, 'w', encoding='utf-8') as f:
            f.write(contenido)

        print(f'  💾 Archivo guardado')

        return True

    except Exception as e:
        print(f'  ❌ Error: {e}')
        import traceback
        traceback.print_exc()
        return False

def main():
    print('='*80)
    print('ACTUALIZACIÓN MASIVA DE TABLAS PREMIUM EN PANELES DE BANCO')
    print('Agregando TablaCortesPremium y TablaTransferenciasPremium')
    print('='*80)

    exitosos = 0
    fallidos = 0

    for archivo, nombre in BANCOS:
        if actualizar_panel(archivo, nombre):
            exitosos += 1
        else:
            fallidos += 1

    print('\n' + '='*80)
    print(f'RESUMEN: {exitosos} exitosos, {fallidos} fallidos')
    print('='*80)

if __name__ == '__main__':
    main()
