"""
Script para actualizar TODOS los paneles de banco con TablasPremium
"""
import re
import os
import sys

# Fix encoding para Windows
sys.stdout.reconfigure(encoding='utf-8')

RUTA_COMPONENTES = r'c:\Users\xpovo\Documents\premium-ecosystem\src\apps\FlowDistributor\components'

BANCOS = [
    ('PanelBovedaUSA.jsx', 'Bóveda USA'),
    ('PanelUtilidades.jsx', 'Utilidades'),
    ('PanelFleteSur.jsx', 'Flete Sur'),
    ('PanelAzteca.jsx', 'Azteca'),
    ('PanelLeftie.jsx', 'Leftie'),
    ('PanelProfit.jsx', 'Profit'),
]

IMPORT_TABLAS = "import { TablaIngresosPremium, TablaGastosPremium } from './TablasBancoPremium';"

def actualizar_panel(archivo, nombre_banco):
    ruta = os.path.join(RUTA_COMPONENTES, archivo)

    print(f'\n📦 Procesando: {archivo}')

    try:
        with open(ruta, 'r', encoding='utf-8') as f:
            contenido = f.read()

        # 1. Agregar import si no existe
        if 'TablasBancoPremium' not in contenido:
            # Buscar línea de ElegantComponents para insertar después
            patron_import = r"(} from '\./ElegantComponents';)"
            if re.search(patron_import, contenido):
                contenido = re.sub(
                    patron_import,
                    r"\1\n" + IMPORT_TABLAS,
                    contenido,
                    count=1
                )
                print(f'  ✅ Import agregado')
            else:
                print(f'  ⚠️  No se encontró import de ElegantComponents')
        else:
            print(f'  ℹ️  Import ya existe')

        # 2. Reemplazar tabla de INGRESOS
        # Buscar inicio y fin de la sección de ingresos
        patron_ingresos_inicio = r"(\{tabActiva === 'ingresos' && \()"
        patron_ingresos_fin = r"(\)\})\s*(?=\{/\* TABLA GASTOS \*/|\{/\* GASTOS TAB \*/|\{tabActiva === 'gastos')"

        # Nuevo código para ingresos
        nuevo_ingresos = f'''{{tabActiva === 'ingresos' && (
            <TablaIngresosPremium
              ingresos={{ingresos.map((ing) => ({{
                ...ing,
                monto: parseFloat(ing.ingreso) || parseFloat(ing.monto) || 0,
              }}))}}
              titulo="Ingresos {nombre_banco}"
              onAgregar={{() => openModal('ingreso')}}
            />
          )}}'''

        # Buscar y reemplazar sección completa de ingresos
        match_inicio = re.search(patron_ingresos_inicio, contenido)
        if match_inicio:
            # Encontrar el cierre correspondiente
            pos_inicio = match_inicio.start()

            # Buscar desde el inicio hasta encontrar el patrón de fin
            resto = contenido[pos_inicio:]

            # Contar paréntesis para encontrar el cierre correcto
            nivel = 0
            pos_fin = 0
            en_jsx = False

            i = 0
            while i < len(resto):
                char = resto[i]

                if resto[i:i+2] == '({':
                    nivel += 1
                    en_jsx = True
                elif char == ')' and en_jsx:
                    nivel -= 1
                    if nivel == 0:
                        pos_fin = i + 1
                        break

                i += 1

            if pos_fin > 0:
                # Extraer la sección completa
                seccion_vieja = resto[:pos_fin]

                # Reemplazar
                contenido = contenido[:pos_inicio] + nuevo_ingresos + contenido[pos_inicio + pos_fin:]
                print(f'  ✅ Tabla de Ingresos reemplazada')
            else:
                print(f'  ⚠️  No se pudo encontrar cierre de ingresos')
        else:
            print(f'  ⚠️  No se encontró sección de ingresos')

        # 3. Reemplazar tabla de GASTOS (similar lógica)
        patron_gastos_inicio = r"(\{tabActiva === 'gastos' && \()"

        nuevo_gastos = f'''{{tabActiva === 'gastos' && (
            <TablaGastosPremium
              gastos={{gastos.map((g) => ({{
                ...g,
                monto: parseFloat(g.gasto) || parseFloat(g.monto) || 0,
              }}))}}
              titulo="Gastos {nombre_banco}"
              onAgregar={{() => openModal('gasto')}}
            />
          )}}'''

        match_inicio = re.search(patron_gastos_inicio, contenido)
        if match_inicio:
            pos_inicio = match_inicio.start()
            resto = contenido[pos_inicio:]

            nivel = 0
            pos_fin = 0
            en_jsx = False

            i = 0
            while i < len(resto):
                char = resto[i]

                if resto[i:i+2] == '({':
                    nivel += 1
                    en_jsx = True
                elif char == ')' and en_jsx:
                    nivel -= 1
                    if nivel == 0:
                        pos_fin = i + 1
                        break

                i += 1

            if pos_fin > 0:
                contenido = contenido[:pos_inicio] + nuevo_gastos + contenido[pos_inicio + pos_fin:]
                print(f'  ✅ Tabla de Gastos reemplazada')
            else:
                print(f'  ⚠️  No se pudo encontrar cierre de gastos')
        else:
            print(f'  ⚠️  No se encontró sección de gastos')

        # Guardar archivo actualizado
        with open(ruta, 'w', encoding='utf-8') as f:
            f.write(contenido)

        print(f'  💾 Archivo guardado')

        return True

    except Exception as e:
        print(f'  ❌ Error: {e}')
        return False

def main():
    print('='*80)
    print('ACTUALIZACIÓN MASIVA DE PANELES DE BANCO')
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
