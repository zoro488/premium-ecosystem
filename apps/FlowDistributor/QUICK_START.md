# 🚀 Chronos OS - Quick Start Guide

## 📋 Pasos de Configuración (5 minutos)

### 1️⃣ Configurar Variables de Entorno

Editar `apps/FlowDistributor/.env.local`:

```env
# Firebase (Obligatorio)
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123

# Google Gemini (Opcional - para ChronosCore AI)
VITE_GEMINI_API_KEY=tu-gemini-key-aqui

# Environment
VITE_ENV=development
```

**Obtener credenciales:**
- Firebase: https://console.firebase.google.com
- Gemini: https://makersuite.google.com/app/apikey

---

### 2️⃣ Inicializar Firestore

En Firebase Console, crear estas colecciones:
```
✅ ventas
✅ clientes
✅ bancos
✅ almacen
✅ ordenesCompra
✅ distribuidores
✅ gastos
✅ movimientos
```

---

### 3️⃣ Agregar los 7 Bancos

En Firestore Console → `bancos` → Add Document (repetir 7 veces):

```javascript
// Documento 1: BM
{
  "id": "BM",
  "nombre": "Bóveda Monte",
  "tipo": "bucket",
  "capitalActual": 50000,
  "capitalHistorico": [],
  "color": "#6366f1",
  "activo": true,
  "updatedAt": new Date()
}

// Documento 2: FL
{
  "id": "FL",
  "nombre": "Flete",
  "tipo": "bucket",
  "capitalActual": 30000,
  "capitalHistorico": [],
  "color": "#00d9ff",
  "activo": true,
  "updatedAt": new Date()
}

// Documento 3: UT
{
  "id": "UT",
  "nombre": "Utilidades",
  "tipo": "bucket",
  "capitalActual": 75000,
  "capitalHistorico": [],
  "color": "#10b981",
  "activo": true,
  "updatedAt": new Date()
}

// Documento 4: AZTECA
{
  "id": "AZTECA",
  "nombre": "Banco Azteca",
  "tipo": "operacional",
  "capitalActual": 100000,
  "capitalHistorico": [],
  "color": "#00d9ff",
  "activo": true,
  "updatedAt": new Date()
}

// Documento 5: LEFTIE
{
  "id": "LEFTIE",
  "nombre": "Banco Leftie",
  "tipo": "operacional",
  "capitalActual": 85000,
  "capitalHistorico": [],
  "color": "#ec4899",
  "activo": true,
  "updatedAt": new Date()
}

// Documento 6: PROFIT
{
  "id": "PROFIT",
  "nombre": "Banco Profit",
  "tipo": "operacional",
  "capitalActual": 120000,
  "capitalHistorico": [],
  "color": "#f59e0b",
  "activo": true,
  "updatedAt": new Date()
}

// Documento 7: BOVEDA_USA
{
  "id": "BOVEDA_USA",
  "nombre": "Bóveda USA",
  "tipo": "operacional",
  "capitalActual": 200000,
  "capitalHistorico": [],
  "color": "#6366f1",
  "activo": true,
  "updatedAt": new Date()
}
```

---

### 4️⃣ Iniciar el Sistema

```bash
cd apps/FlowDistributor
npm run dev
```

Abre: **http://localhost:5173**

---

## 🎯 Verificación Rápida

### Dashboard debe mostrar:
- ✅ 4 KPIs (Ventas Hoy, Ingresos Mes, Capital Total, Alertas)
- ✅ Chart de flujo de efectivo (7 días)
- ✅ Pie chart de buckets FL/BM/UT
- ✅ 3 stats cards (Clientes, Productos, Bancos)
- ✅ Orbe flotante de ChronosCore (abajo-derecha)

### Probar ChronosCore:
1. Click en orbe flotante (cyan brillante)
2. Escribir: `"cuánto capital total hay"`
3. Debe responder con el capital total
4. Escribir: `"ir a bancos/BM"`
5. Debe navegar a vista de Bóveda Monte

### Probar Vista de Banco:
1. En navegador: `http://localhost:5173/bancos/BM`
2. Debe mostrar:
   - ✅ Header con "Bóveda Monte" en morado
   - ✅ 4 KPIs (Capital, Ingresos, Egresos, Balance)
   - ✅ Chart de evolución (12 meses)
   - ✅ Lista de movimientos
   - ✅ Botón "Volver"

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/types'"
```bash
# Verificar tsconfig.json tiene:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Error: "Firebase not configured"
```bash
# Verificar .env.local existe y tiene todas las variables
# Reiniciar dev server después de editar .env.local
npm run dev
```

### ChronosCore no funciona
```bash
# Sin VITE_GEMINI_API_KEY funcionará en modo básico
# Solo comandos simples: "ir a dashboard", "capital total", etc.
# Para AI completo, agregar la key de Gemini
```

### Dashboard muestra 0 en todo
```bash
# Normal si no hay datos
# Agregar documentos de prueba en Firestore:
# - 1 cliente en colección "clientes"
# - 1 producto en colección "almacen"
# - 1 venta en colección "ventas"
```

---

## 📊 Datos de Prueba Mínimos

### Cliente (colección "clientes"):
```javascript
{
  "nombre": "Cliente Demo",
  "telefono": "555-1234",
  "email": "demo@cliente.com",
  "adeudo": 0,
  "activo": true,
  "createdAt": new Date()
}
```

### Producto (colección "almacen"):
```javascript
{
  "nombre": "Producto Demo",
  "existencia": 100,
  "unidad": "pieza",
  "costoPromedio": 50,
  "costoUltimo": 50,
  "precioVenta": 100,
  "stockMinimo": 10,
  "activo": true,
  "createdAt": new Date()
}
```

### Venta (colección "ventas"):
```javascript
{
  "folio": "V001",
  "fecha": new Date(),
  "cliente": "Cliente Demo",
  "clienteId": "id-del-cliente",
  "productos": [
    {
      "productoId": "id-del-producto",
      "nombreProducto": "Producto Demo",
      "cantidad": 2,
      "unidadesCaja": 10,
      "cpUnit": 50,
      "precioUnitario": 100,
      "subtotal": 200
    }
  ],
  "precioVenta": 5200,
  "flete": 5000,      // 10 unidades × 500
  "bovedaMonte": 100, // 2 × 50
  "utilidades": 100,  // 5200 - 5000 - 100
  "estatus": "Pagado",
  "banco": "BM",
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "createdBy": "admin"
}
```

---

## ✨ Características Implementadas

### 🎨 Diseño
- ✅ Dark Mirror Espacial (negro + glassmorphism)
- ✅ Animaciones suaves (Framer Motion)
- ✅ Responsive (mobile-first)
- ✅ Paleta de colores premium

### 🤖 IA
- ✅ ChronosCore assistant
- ✅ Comandos en español
- ✅ Navegación por voz
- ✅ Consultas en tiempo real

### 📊 Dashboards
- ✅ Dashboard Master (KPIs + charts)
- ✅ Vista Universal de Bancos
- ✅ Real-time data (Firestore)

### 🔧 Técnico
- ✅ TypeScript strict
- ✅ Firebase v12
- ✅ 0 errores de compilación
- ✅ Build optimizado

---

## 📞 Siguiente Fase

Para implementar el formulario de ventas (Phase 7):
1. Asegurar que Dashboard y Bancos funcionan
2. Continuar con VentasView
3. Agregar validación con Zod
4. Implementar cálculo automático FL/BM/UT

**Sistema base completo y listo para usar! 🚀**
