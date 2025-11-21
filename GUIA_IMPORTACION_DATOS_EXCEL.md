# 📊 GUÍA DE IMPORTACIÓN DE DATOS EXCEL
## FlowDistributor - Datos Históricos

---

## 🎯 OBJETIVO

Resolver las discrepancias encontradas en el análisis de datos históricos:
- **89 ventas sin panel asignado** (91.75% del total)
- **RF Total $12,861,332.12** pero paneles muestran $0
- **0 gastos importados** (GYA muestra 9 abonos pero 0 gastos)

---

## 📋 PREREQUISITOS

1. ✅ Sistema FlowDistributor funcionando
2. ✅ Bancos inicializados (BM, BU, UT, FL, AZ, LF, PR)
3. ✅ Acceso a Firebase Console
4. 📁 Archivos Excel históricos disponibles

---

## 🔍 ANÁLISIS DE DISCREPANCIAS

### Problema 1: Ventas sin Panel
```
Total ventas: 97
Con panel asignado: 8 (8.25%)
Sin panel asignado: 89 (91.75%)
```

**Causa**: Ventas importadas sin campo `panel` o con valor vacío.

**Impacto**:
- RF Total no se distribuye correctamente
- Paneles muestran $0 aunque RF Total es $12.8M
- Dashboard no refleja datos reales

### Problema 2: RF Total vs Paneles
```
RF Total (calculado): $12,861,332.12
Panel Norte: $0.00
Panel Sur: $0.00
Panel Este: $0.00
Panel Oeste: $0.00
```

**Causa**: Campo `panel` faltante en documentos de ventas.

### Problema 3: Gastos Faltantes
```
GYA - Abonos: 9 registros
GYA - Gastos: 0 registros
Paneles arrays: [] (vacíos)
```

**Causa**: Gastos no importados desde Excel.

---

## 🛠️ SOLUCIÓN: PROCESO DE IMPORTACIÓN

### Opción A: Importación Manual (Firebase Console)

#### Paso 1: Exportar Datos de Excel
```bash
# Abrir Excel con datos históricos
# Exportar como CSV con delimitador ;

Columnas requeridas para ventas:
- folio
- fecha
- clienteId
- panel (Norte, Sur, Este, Oeste)
- total
- productos[]
- flete
```

#### Paso 2: Preparar JSON
```javascript
// Ejemplo estructura venta con panel
{
  "folio": "VTA-001",
  "fecha": "2025-01-15",
  "clienteId": "CLI-123",
  "panel": "Norte",  // ⚠️ IMPORTANTE
  "total": 150000,
  "productos": [
    {
      "productoId": "PROD-001",
      "cantidad": 10,
      "precioUnitario": 15000
    }
  ],
  "flete": 500,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Paso 3: Importar en Firebase Console
1. Abrir [Firebase Console](https://console.firebase.google.com)
2. Seleccionar proyecto `chronos-176d8`
3. Ir a Firestore Database
4. Seleccionar colección `ventas`
5. Para cada venta sin panel:
   - Click en el documento
   - Agregar campo `panel` (string)
   - Valor: "Norte", "Sur", "Este", u "Oeste"
   - Guardar

---

### Opción B: Script de Actualización Masiva

Crear script `scripts/actualizar-paneles-ventas.ts`:

```typescript
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, updateDoc, doc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB9gG3ITQ6MkY-kOahzSHRqqNaJMguDi5k',
  authDomain: 'chronos-176d8.firebaseapp.com',
  projectId: 'chronos-176d8',
  storageBucket: 'chronos-176d8.firebasestorage.app',
  messagingSenderId: '148680866109',
  appId: '1:148680866109:web:5da615f10d3600e50b6d54',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function actualizarPanelesVentas() {
  console.log('🔄 Actualizando paneles en ventas...');

  const ventasRef = collection(db, 'ventas');
  const snapshot = await getDocs(ventasRef);

  let actualizadas = 0;
  let sinPanel = 0;

  for (const docSnap of snapshot.docs) {
    const venta = docSnap.data();

    // Si no tiene panel o está vacío
    if (!venta.panel || venta.panel === '') {
      sinPanel++;

      // Asignar panel basado en clienteId o distribución equitativa
      let panelAsignado = 'Norte'; // Default

      // Lógica de asignación (ejemplo: round-robin)
      const paneles = ['Norte', 'Sur', 'Este', 'Oeste'];
      panelAsignado = paneles[sinPanel % 4];

      // Actualizar documento
      await updateDoc(doc(db, 'ventas', docSnap.id), {
        panel: panelAsignado
      });

      actualizadas++;
      console.log(`✅ Venta ${venta.folio} → Panel ${panelAsignado}`);
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   Total ventas sin panel: ${sinPanel}`);
  console.log(`   Ventas actualizadas: ${actualizadas}`);
}

actualizarPanelesVentas()
  .then(() => {
    console.log('✅ Actualización completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
```

**Ejecutar**:
```bash
# Agregar script a package.json
"update:paneles": "tsx scripts/actualizar-paneles-ventas.ts"

# Ejecutar
npm run update:paneles
```

---

### Opción C: Importación desde Excel con Script

Crear script `scripts/importar-excel-ventas.ts`:

```typescript
import * as XLSX from 'xlsx';
import { initializeApp } from 'firebase/app';
import { collection, addDoc, getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = { /* ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importarVentasExcel(archivoExcel: string) {
  console.log('📊 Leyendo Excel:', archivoExcel);

  const workbook = XLSX.readFile(archivoExcel);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`📦 Total filas: ${data.length}`);

  let importadas = 0;

  for (const row of data) {
    const venta = {
      folio: row['Folio'],
      fecha: row['Fecha'],
      clienteId: row['Cliente ID'],
      panel: row['Panel'] || 'Norte', // Default si no existe
      total: parseFloat(row['Total']),
      productos: JSON.parse(row['Productos']),
      flete: parseFloat(row['Flete'] || 0),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await addDoc(collection(db, 'ventas'), venta);
    importadas++;

    if (importadas % 10 === 0) {
      console.log(`✅ ${importadas} ventas importadas...`);
    }
  }

  console.log(`\n✅ Total importadas: ${importadas}`);
}

// Ejecutar
const archivo = process.argv[2] || './datos/ventas-historicas.xlsx';
importarVentasExcel(archivo)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
```

**Instalar dependencia**:
```bash
npm install xlsx --legacy-peer-deps
```

**Ejecutar**:
```bash
npm run import:excel -- ./datos/ventas-historicas.xlsx
```

---

## 📊 VALIDACIÓN POST-IMPORTACIÓN

### Verificar Distribución de Paneles

```typescript
// Script: scripts/validar-paneles.ts
const ventasRef = collection(db, 'ventas');
const snapshot = await getDocs(ventasRef);

const estadisticas = {
  total: 0,
  Norte: 0,
  Sur: 0,
  Este: 0,
  Oeste: 0,
  sinPanel: 0,
  rfTotal: 0
};

for (const doc of snapshot.docs) {
  const venta = doc.data();
  estadisticas.total++;

  if (!venta.panel || venta.panel === '') {
    estadisticas.sinPanel++;
  } else {
    estadisticas[venta.panel]++;
  }

  estadisticas.rfTotal += venta.total || 0;
}

console.log('📊 Estadísticas de Ventas:');
console.log(`   Total ventas: ${estadisticas.total}`);
console.log(`   Norte: ${estadisticas.Norte}`);
console.log(`   Sur: ${estadisticas.Sur}`);
console.log(`   Este: ${estadisticas.Este}`);
console.log(`   Oeste: ${estadisticas.Oeste}`);
console.log(`   Sin panel: ${estadisticas.sinPanel}`);
console.log(`   RF Total: $${estadisticas.rfTotal.toLocaleString()}`);
```

**Resultado Esperado**:
```
📊 Estadísticas de Ventas:
   Total ventas: 97
   Norte: 24
   Sur: 25
   Este: 24
   Oeste: 24
   Sin panel: 0 ✅
   RF Total: $12,861,332.12 ✅
```

---

## 🚨 TROUBLESHOOTING

### Error: "Cliente no existe"
**Solución**: Importar clientes antes de ventas
```bash
npm run import:clientes
npm run import:ventas
```

### Error: "Producto no encontrado"
**Solución**: Verificar que todos los `productoId` existan en catálogo
```bash
npm run validar:productos
```

### Error: "Panel inválido"
**Valores válidos**: "Norte", "Sur", "Este", "Oeste" (case-sensitive)

---

## ✅ CHECKLIST DE COMPLETADO

- [ ] Bancos inicializados correctamente
- [ ] Clientes importados/verificados
- [ ] Productos en catálogo validados
- [ ] Ventas con campo `panel` asignado
- [ ] RF Total = Suma de paneles
- [ ] 0 ventas sin panel
- [ ] Gastos importados
- [ ] Dashboard muestra datos correctos

---

## 📝 COMANDOS ÚTILES

```bash
# Validar estado actual
npm run validar:paneles

# Actualizar paneles automáticamente
npm run update:paneles

# Importar desde Excel
npm run import:excel -- ./datos/ventas.xlsx

# Ver estadísticas
npm run stats:ventas
```

---

## 📚 REFERENCIAS

- Análisis original: `ANALISIS_COMPLETO_ARCHIVOS_EXCEL_Version2.md`
- Estructura de datos: `PLAN_MAESTRO_COMPLETO_Version2.md`
- Fórmulas de negocio: `LOGICA_CORRECTA_SISTEMA_Version2.md`

---

**Última actualización**: 2025-11-20
**Estado**: ⚠️ Pendiente de ejecución manual
**Prioridad**: Media (no bloqueante para nuevas transacciones)
