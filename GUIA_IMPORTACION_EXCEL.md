# 📊 GUÍA RÁPIDA: IMPORTACIÓN DESDE EXCEL

## 🎯 Objetivo

Importar todos los datos del archivo **Administación_General.xlsx** al sistema FlowDistributor en 3 pasos simples.

---

## ⚡ MÉTODO 1: Importación Rápida (Recomendado)

### Paso 1: Ejecutar el Script de Conversión

Doble clic en:
```
IMPORTAR-EXCEL.bat
```

Esto ejecutará automáticamente el parser de Python y generará el archivo `public/excel_data.json` con todos los datos convertidos.

**Resultado esperado**:
```
✅ Conversión completada exitosamente
📁 Archivo generado: C:\Users\xpovo\Documents\premium-ecosystem\public\excel_data.json

📊 RESUMEN:
   • Ventas: 80
   • Clientes: 29
   • Órdenes de Compra: 9
   • Distribuidores: 6
   • Entradas Almacén: 9
   • Salidas Almacén: 80
   • Bancos configurados: 6
```

### Paso 2: Iniciar FlowDistributor

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3002`

### Paso 3: Importar en la Aplicación

1. Abrir FlowDistributor en el navegador
2. Hacer clic en el ícono **⚙️ Configuración** (esquina superior derecha)
3. En el modal de Configuración, buscar la sección **"Importar desde Excel"**
4. Hacer clic en el botón **"Importar"**
5. Confirmar la importación

**¡Listo!** Todos los datos del Excel están ahora en FlowDistributor.

---

## 🔧 MÉTODO 2: Manual (Para Desarrolladores)

### Opción A: Convertir Excel a JSON

```bash
python scripts/excel_to_flowdistributor.py
```

Esto genera `public/excel_data.json`

### Opción B: Importar JSON en FlowDistributor

1. Iniciar el servidor: `npm run dev`
2. Ir a Configuración → Importar desde Excel
3. El sistema carga automáticamente `/excel_data.json`

---

## 📋 DATOS QUE SE IMPORTAN

### ✅ Ventas (80 registros)
- Todas las ventas desde Control_Maestro
- Con fechas, clientes, cantidades, precios
- Estado de pago (completo/pendiente)
- Cálculo automático de fletes y utilidades

### ✅ Clientes (29 registros)
- Nombres de clientes únicos
- Adeudos pendientes
- Abonos realizados
- Observaciones

### ✅ Órdenes de Compra (9 registros)
- IDs de OC (OC0001, OC0002, etc.)
- Distribuidores de origen
- Cantidades y costos
- Pagos y deudas pendientes

### ✅ Distribuidores (6 registros)
- Nombres: Q-MAYA, PACMAN, A/X, CH-MONTE, VALLE-MONTE
- Total comprado a cada uno
- Saldos pendientes

### ✅ Almacén (9 entradas + 80 salidas)
- Entradas desde órdenes de compra
- Salidas por ventas
- Stock calculado automáticamente

### ✅ Bancos (6 cuentas)
- **Bóveda Monte**: 51 ingresos, 20 gastos
- **Utilidades**: 37 ingresos, 11 gastos
- **Fletes**: 46 ingresos, 83 gastos
- **Azteca**: 6 ingresos
- **Leftie**: 7 ingresos
- **Profit**: 37 ingresos

---

## 🔍 VERIFICACIÓN POST-IMPORTACIÓN

Después de importar, verificar:

### Dashboard
- [ ] Ventas totales muestra cifras correctas
- [ ] Clientes con adeudo muestra cantidad correcta
- [ ] Stock de almacén es positivo
- [ ] Bancos muestran saldos reales

### Panel de Ventas
- [ ] Se ven las 80 ventas importadas
- [ ] Fechas están en formato correcto
- [ ] Clientes están asignados
- [ ] Totales calculados correctamente

### Panel de Clientes
- [ ] Se ven los 29 clientes
- [ ] Adeudos coinciden con el Excel
- [ ] Estados son correctos

### Panel de Bancos
- [ ] Bóveda Monte tiene movimientos
- [ ] Saldos son positivos (o según Excel)
- [ ] Ingresos y gastos están listados

---

## ⚠️ NOTAS IMPORTANTES

1. **Respaldo Previo**: Si tienes datos en FlowDistributor, crea un respaldo antes de importar:
   - Configuración → Crear Respaldo → Descargar

2. **Reemplazo Total**: La importación REEMPLAZA todos los datos actuales

3. **Actualizar Excel**: Si actualizas el Excel:
   - Ejecuta nuevamente `IMPORTAR-EXCEL.bat`
   - Vuelve a importar en FlowDistributor

4. **Validación**: El sistema valida que el JSON tenga la estructura correcta antes de importar

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "No se pudo cargar el archivo de datos del Excel"

**Causa**: El archivo `excel_data.json` no existe en `public/`

**Solución**:
```bash
python scripts/excel_to_flowdistributor.py
```

### Error: "El archivo de datos del Excel tiene una estructura inválida"

**Causa**: El JSON no tiene la estructura esperada

**Solución**:
1. Verificar que el Excel esté en la ruta correcta
2. Regenerar el JSON: `python scripts/excel_to_flowdistributor.py`
3. Verificar que no haya errores en la conversión

### Error: ModuleNotFoundError: openpyxl

**Causa**: Falta la librería de Python

**Solución**:
```bash
pip install openpyxl
```

### Error: UnicodeEncodeError

**Causa**: Problema de encoding en Windows

**Solución**: Ya está solucionado en el script con `sys.stdout.reconfigure(encoding='utf-8')`

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

| Aspecto | Excel Manual | FlowDistributor Importado |
|---------|--------------|---------------------------|
| **Abrir archivo** | 30 segundos | 2 segundos |
| **Buscar venta** | Scroll manual | Búsqueda instantánea |
| **Ver adeudos** | Calcular manualmente | Automático en dashboard |
| **Agregar venta** | Llenar celdas, copiar fórmulas | Formulario validado |
| **Ver gráficas** | Crear manualmente | Automáticas en tiempo real |
| **Errores** | Posibles en fórmulas | Imposible (validado) |
| **Móvil** | Difícil | Perfectamente funcional |

---

## 🎯 SIGUIENTE NIVEL

Una vez importados los datos, puedes:

1. **Agregar Nuevas Ventas**: Panel Ventas → + Nueva Venta
2. **Registrar Pagos**: Panel Clientes → Registrar Abono
3. **Comprar Stock**: Panel Órdenes → + Nueva Orden
4. **Movimientos Bancarios**: Panel Bancos → Registrar Ingreso/Gasto
5. **Ver Reportes**: Dashboard con gráficas automáticas
6. **Exportar Respaldos**: Configuración → Crear Respaldo

---

## 💡 TIPS PRO

- **Respaldos Regulares**: Descarga un JSON cada semana
- **Búsqueda Rápida**: Usa Ctrl+F en cualquier panel
- **Clic Derecho**: Menús contextuales en todas las tablas
- **Modo Oscuro**: Ya está activado por defecto 😎
- **Atajos**: Conoce los shortcuts en cada panel

---

**¿Necesitas ayuda?** Revisa [ANALISIS_EXCEL_Y_ADAPTACION.md](./ANALISIS_EXCEL_Y_ADAPTACION.md) para documentación completa.
