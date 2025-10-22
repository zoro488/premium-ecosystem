# 📋 GUÍA DE USO - FLOWDISTRIBUTOR

## ✅ ESTADO ACTUAL DEL SISTEMA

### Datos Importados Exitosamente
- ✅ **96 ventas** procesadas desde Control_Maestro
- ✅ **9 órdenes de compra** desde Distribuidores
- ✅ **6 distribuidores** únicos identificados
- ✅ **30 clientes** procesados
- ✅ **3 bancos** configurados (Azteca, Leftie, Profit)
- ✅ **Almacén Monte** con inventario actual de 17 unidades

### Métricas Financieras
- 💰 Capital Total: Calculado desde bancos
- 📦 Inventario: 17 unidades
- 💵 Cartera por Cobrar: Calculada desde ventas
- 💳 Cuentas por Pagar: Calculadas desde compras

---

## 🚀 CÓMO USAR EL SISTEMA

### Opción 1: Importar Excel y Abrir (TODO EN UNO)
```batch
IMPORTAR-Y-ABRIR.bat
```
Este script hace TODO:
1. Importa los datos del Excel
2. Detiene el servidor anterior
3. Limpia el caché
4. Inicia el servidor
5. Listo para usar

### Opción 2: Solo Reiniciar Servidor
Si ya importaste los datos y solo quieres reiniciar:
```batch
REINICIAR-SERVIDOR.bat
```

### Opción 3: Solo Importar Datos
```batch
python scripts\importar_excel_completo.py
```

---

## 📂 ESTRUCTURA DE ARCHIVOS

```
premium-ecosystem/
├── public/
│   └── excel_data.json          ← Datos importados (NUNCA editar manualmente)
├── scripts/
│   └── importar_excel_completo.py   ← Script de importación
├── Copia de Administación_General.xlsx  ← Excel fuente
├── IMPORTAR-Y-ABRIR.bat         ← Script TODO EN UNO
├── REINICIAR-SERVIDOR.bat       ← Solo reiniciar
└── GUIA_USO.md                  ← Esta guía
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "Failed to fetch dynamically imported module"
**Solución:**
```batch
REINICIAR-SERVIDOR.bat
```
Esto limpia el caché y reinicia el servidor.

### Los datos no se ven actualizados
**Solución:**
1. Ejecuta `IMPORTAR-Y-ABRIR.bat`
2. Espera a que cargue el servidor
3. Refresca el navegador (F5 o Ctrl+R)
4. Si persiste, abre el navegador en modo incógnito

### El Excel tiene datos nuevos
**Solución:**
1. Guarda el Excel
2. Ejecuta `IMPORTAR-Y-ABRIR.bat`
3. Los datos se actualizarán automáticamente

---

## 📊 DATOS QUE SE IMPORTAN

### De "Distribuidores" (Hojas: Distribuidores)
- Órdenes de compra (OC)
- Proveedores/Distribuidores
- Costos y cantidades
- Stock actual
- Deudas y pagos

### De "Control_Maestro" (Hojas: Control_Maestro)
- Ventas locales
- Clientes
- Precios y montos
- Fletes
- Utilidades
- Estatus de pagos

### De "Clientes" (Hoja: Clientes)
- Lista de clientes
- Totales de compra
- Abonos
- Adeudos

### De Bancos (Hojas: Azteca, Leftie, Profit)
- Ingresos
- Gastos
- Saldos actuales
- Movimientos

### De "Almacen_Monte" (Hoja: Almacen_Monte)
- Ingresos al almacén
- Salidas del almacén
- Stock actual (RF Actual)

---

## 🎯 FLUJO DE TRABAJO RECOMENDADO

1. **Actualizar Excel**
   - Edita tu archivo `Copia de Administación_General.xlsx`
   - Guarda los cambios

2. **Importar Datos**
   ```batch
   IMPORTAR-Y-ABRIR.bat
   ```

3. **Verificar en FlowDistributor**
   - Abre http://localhost:3001/flow-distributor
   - Revisa las tarjetas KPI
   - Verifica las ventas y compras
   - Consulta métricas financieras

4. **Trabajar con los Datos**
   - Agrega nuevas ventas
   - Registra compras
   - Gestiona clientes
   - Consulta reportes

5. **Re-importar cuando sea necesario**
   - Si necesitas resetear todo, vuelve a ejecutar `IMPORTAR-Y-ABRIR.bat`

---

## ⚠️ IMPORTANTE

### NO HACER:
- ❌ NO edites manualmente `excel_data.json`
- ❌ NO borres archivos de la carpeta `scripts/`
- ❌ NO modifiques la estructura del Excel sin actualizar el script

### SÍ HACER:
- ✅ Usa siempre `IMPORTAR-Y-ABRIR.bat` para importar
- ✅ Guarda backups del Excel antes de importar
- ✅ Verifica que el Excel esté cerrado antes de importar
- ✅ Revisa los logs de importación para detectar errores

---

## 📈 PRÓXIMOS PASOS

1. **Validar Datos**: Revisa que todos los datos se hayan importado correctamente
2. **Probar Funcionalidades**: Navega por todas las secciones de FlowDistributor
3. **Reportar Errores**: Si encuentras datos incorrectos, revisa el mapeo de columnas
4. **Optimizar**: Si todo funciona, puedes personalizar vistas y reportes

---

## 🆘 SOPORTE

Si encuentras problemas:
1. Revisa esta guía
2. Verifica los logs de importación
3. Asegúrate de que el Excel tenga la estructura correcta
4. Reinicia el servidor con `REINICIAR-SERVIDOR.bat`

---

## 📝 NOTAS TÉCNICAS

### Mapeo de Columnas - Control_Maestro
```
Fila 3: Headers
Fila 4+: Datos

A = Fecha
B = OC Relacionada
C = Cantidad
D = Cliente
E = Bóveda Monte (destino/monto)
F = Precio De Venta
G = Ingreso
H = Flete (texto "Aplica")
I = Flete Utilidad
J = Utilidad
K = Estatus
L = Concepto
```

### Mapeo de Columnas - Distribuidores
```
Fila 3: Headers
Fila 4+: Datos

A = OC (Orden de Compra)
B = Fecha
C = Origen (Distribuidor)
D = Cantidad
E = Costo Distribuidor
F = Costo Transporte
G = Costo Por Unidad
H = Stock Actual
I = Costo Total
J = Pago a Distribuidor
K = Deuda
```

---

**Última actualización:** 2025-10-21
**Versión del Sistema:** 2.0.0
