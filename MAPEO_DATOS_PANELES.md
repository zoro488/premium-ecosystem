# 🗺️ Mapeo de Datos a Paneles - FlowDistributor

## 📋 Archivo Unificado
**Ubicación**: `BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json`

## 🎯 Estructura y Mapeo

### 1. **Ordenes de Compra** → `PanelOrdenesCompra.tsx`
```javascript
// Ruta en JSON: ordenesCompra.distribuidores
{
  "ordenesCompra": [9 registros],  // OC0001 a OC0009
  "distribuidores": [2 registros]  // PACMAN, Q-MAYA
}
```
**Hook**: `useOrdenesCompra()`
**Componente**: `PanelOrdenesCompraUltra.tsx`

---

### 2. **Ventas Locales** → `PanelVentasUltra.tsx`
```javascript
// Ruta en JSON: ventasLocales.ventasLocal
{
  "ventasLocal": [96 registros]  // Control_Maestro del Excel
}
```
**Hook**: `useVentasLocales()`
**Componente**: `PanelVentasUltra.tsx`
**Origen Excel**: Hoja "Control_Maestro"

---

### 3. **Gastos y Abonos (GYA)** → `PanelGYAUltra.tsx`
```javascript
// Ruta en JSON: gastosAbonos.gastosAbonos
{
  "gastosAbonos": [302 registros]  // 306 en hoja GYA del Excel
}
```
**Hook**: `useGastosAbonos()`
**Componente**: `PanelGYAUltra.tsx`
**Origen Excel**: Hoja "GYA" (Gastos y Abonos)

---

### 4. **Flete Sur** → `PanelFleteSurUltra.tsx`
```javascript
// Ruta en JSON: fleteSur.fleteSur
{
  "ingresos": [array],
  "gastos": [array],
  "rfActual": number,
  "rfCortes": [array]
}
```
**Hook**: `useFleteSur()`
**Componente**: `PanelFleteSurUltra.tsx`
**Origen Excel**: Hoja "Flete_Sur"

---

### 5. **Almacen Monte** → `PanelAlmacenUltra.tsx`
```javascript
// Ruta en JSON: almacenMonte.almacenMonte
{
  "ingresos": 2296,
  "ordenesCompra": [9 registros],
  "rfActual": 17,
  "rfCortes": [5 cortes],
  "salida": 2279,
  "salidas": [96 registros]
}
```
**Hook**: `useAlmacenMonte()`
**Componente**: `PanelAlmacenUltra.tsx`
**Origen Excel**: Hoja "Almacen_Monte"

---

### 6. **Bóveda Monte** → `PanelBovedaMonteUltra.tsx`
```javascript
// Ruta en JSON: bovedaMonte.bovedaMonte
{
  "ingresos": 5722280.0,
  "ingresosList": [array],
  "rfActual": 0.0,
  "rfCortes": [array],
  "gastos": 5722280.0,
  "gastosList": [array]
}
```
**Hook**: `useBovedaMonte()`
**Componente**: `PanelBovedaMonteUltra.tsx`
**Origen Excel**: Hoja "Bóveda_Monte"

---

### 7. **Bóveda USA** → `PanelBovedaUSAUltra.tsx`
```javascript
// Ruta en JSON: bovedaUSA.bovedaUsa
{
  "ingresos": 1888275.0,
  "ingresosList": [array],
  "rfActual": 128005.0,
  "rfCortes": [array],
  "gastos": 1760270.0,
  "gastosList": [array]
}
```
**Hook**: `useBovedaUSA()`
**Componente**: `PanelBovedaUSAUltra.tsx`
**Origen Excel**: Hoja "Bóveda_USA"

---

### 8. **Azteca** → `PanelAztecaUltra.tsx`
```javascript
// Ruta en JSON: azteca.azteca
{
  "ingresos": 1880970.0,
  "ingresosList": [6 registros],
  "rfActual": -178714.88,
  "rfCortes": [],
  "gastos": 2059684.88,
  "gastosList": [25 registros]
}
```
**Hook**: `useAzteca()`
**Componente**: `PanelAztecaUltra.tsx`
**Origen Excel**: Hoja "Azteca"

---

### 9. **Leftie** → `PanelLeftieUltra.tsx`
```javascript
// Ruta en JSON: leftie.leftie
{
  "ingresos": number,
  "ingresosList": [array],
  "rfActual": number,
  "rfCortes": [array],
  "gastos": number,
  "gastosList": [array]
}
```
**Hook**: `useLeftie()`
**Componente**: `PanelLeftieUltra.tsx`
**Origen Excel**: Hoja "Leftie"

---

### 10. **Profit** → `PanelProfitUltra.tsx`
```javascript
// Ruta en JSON: profit.profit
{
  "ingresos": 12577748.0,
  "ingresosList": [array],
  "rfActual": number,
  "rfCortes": [array],
  "gastos": number,
  "gastosList": [array]
}
```
**Hook**: `useProfit()`
**Componente**: `PanelProfitUltra.tsx`
**Origen Excel**: Hoja "Profit"

---

### 11. **Clientes** → `PanelClientesUltra.tsx`
```javascript
// Ruta en JSON: clientes.clientes
{
  "clientes": [31 registros]  // Lista de clientes con deudas/abonos
}
```
**Hook**: `useClientes()`
**Componente**: `PanelClientesUltra.tsx`
**Origen Excel**: Hoja "Clientes"

---

### 12. **Distribuidores** → `PanelDistribuidoresUltra.tsx`
```javascript
// Ruta en JSON: ordenesCompra.distribuidores.distribuidores
{
  "distribuidores": [2 registros]  // PACMAN, Q-MAYA
}
```
**Hook**: `useDistribuidores()`
**Componente**: `PanelDistribuidoresUltra.tsx`
**Origen Excel**: Hoja "Distribuidores"

---

## 📊 Resumen de Datos

| Panel | JSON Key | Registros | Excel Sheet |
|-------|----------|-----------|-------------|
| Ordenes de Compra | `ordenesCompra.distribuidores.ordenesCompra` | 9 | Distribuidores (columnas 1-11) |
| Distribuidores | `ordenesCompra.distribuidores.distribuidores` | 2 | Distribuidores (columnas 13-16) |
| Ventas Locales | `ventasLocales.ventasLocal` | 96 | Control_Maestro |
| Gastos y Abonos | `gastosAbonos.gastosAbonos` | 302 | GYA |
| Flete Sur | `fleteSur.fleteSur` | - | Flete_Sur |
| Almacen Monte | `almacenMonte.almacenMonte` | 96 salidas | Almacen_Monte |
| Bóveda Monte | `bovedaMonte.bovedaMonte` | - | Bóveda_Monte |
| Bóveda USA | `bovedaUSA.bovedaUsa` | - | Bóveda_USA |
| Azteca | `azteca.azteca` | 31 registros | Azteca |
| Leftie | `leftie.leftie` | - | Leftie |
| Profit | `profit.profit` | - | Profit |
| Clientes | `clientes.clientes` | 31 | Clientes |

---

## 🔧 Uso en Componentes

### Ejemplo de uso del JSON unificado:

```typescript
import unifiedData from '@/data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json';

// En PanelVentasUltra.tsx
const ventasLocales = unifiedData.ventasLocales.ventasLocal;

// En PanelGYAUltra.tsx
const gastosAbonos = unifiedData.gastosAbonos.gastosAbonos;

// En PanelOrdenesCompraUltra.tsx
const ordenesCompra = unifiedData.ordenesCompra.distribuidores.ordenesCompra;
const distribuidores = unifiedData.ordenesCompra.distribuidores.distribuidores;
```

---

## ✅ Próximos Pasos

1. ✅ Crear JSON unificado `BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json`
2. ⏳ Verificar que cada componente `*Ultra.tsx` use los datos correctos
3. ⏳ Crear hooks personalizados para cada panel si es necesario
4. ⏳ Actualizar imports en componentes para usar JSON unificado
5. ⏳ Probar cada panel para confirmar que los datos se muestren correctamente

---

**Fecha**: 2025-11-03
**Versión**: 1.0
