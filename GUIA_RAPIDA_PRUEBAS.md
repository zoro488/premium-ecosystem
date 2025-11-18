╔════════════════════════════════════════════════════════════════════════════╗
║                    🚀 GUÍA RÁPIDA DE PRUEBAS - 5 MINUTOS                  ║
╚════════════════════════════════════════════════════════════════════════════╝

## ⏱️ PRUEBA RÁPIDA (5 minutos)

### 1️⃣ VERIFICAR SERVIDORES (30 segundos)

✅ **Abrir Navegador:**
```
http://localhost:5173          → Frontend (Vite)
http://127.0.0.1:4000          → Firebase Emulator UI
```

✅ **Verificar que carguen correctamente**


---

### 2️⃣ PROBAR DISTRIBUIDORES (1 minuto)

**Objetivo:** Verificar CRUD y Firebase

1. En `http://localhost:5173`, click en **"Distribuidores"** (sidebar izquierdo)
2. Click en botón **"Nuevo Distribuidor"** (arriba derecha, botón cyan)
3. Llenar formulario:
   ```
   Nombre: Distribuidora Test
   Descripción: Prueba de integración Firebase
   ```
4. Click **"Guardar"**
5. ✅ **VERIFICAR:** Aparece en la tabla inmediatamente
6. ✅ **VERIFICAR:** Se muestra animación de entrada (Framer Motion)
7. Ir a `http://127.0.0.1:4000/firestore`
8. ✅ **VERIFICAR:** Colección `distribuidores` tiene 1 documento

**✅ SI TODO FUNCIONA:** Firebase está conectado correctamente

---

### 3️⃣ PROBAR CLIENTES (1 minuto)

1. Click en **"Clientes"** (sidebar)
2. Click **"Agregar Cliente"**
3. Llenar:
   ```
   Nombre: Cliente Test
   Tipo: mayorista
   Email: test@example.com
   ```
4. Guardar
5. ✅ **VERIFICAR:** Aparece en tabla
6. ✅ **VERIFICAR:** Firebase UI muestra documento en `clientes`

---

### 4️⃣ PROBAR BANCOS (1 minuto)

1. Click en **"Bancos"** (sidebar)
2. ✅ **VERIFICAR:** Se muestran 7 tabs:
   - Bóveda Monte
   - Bóveda USA
   - Fletes
   - Utilidades
   - Azteca
   - Leftie
   - Profit
3. Click en **"Bóveda Monte"**
4. ✅ **VERIFICAR:** Se muestra saldo y tabla de movimientos
5. Click **"Nuevo Movimiento"**
6. Llenar:
   ```
   Tipo: Ingreso
   Monto: 10000
   Concepto: Prueba
   ```
7. Guardar
8. ✅ **VERIFICAR:** Saldo se actualiza inmediatamente
9. ✅ **VERIFICAR:** Aparece en tabla de movimientos

---

### 5️⃣ PRUEBA MAESTRA: CREAR VENTA (2 minutos)

**Objetivo:** Verificar lógica compleja de distribución a 3 bancos

**Preparación:**
1. Asegúrate de tener al menos 1 cliente creado (paso 3)

**Crear Venta:**
1. Click en **"Ventas"** (sidebar)
2. Click **"Nueva Venta"**
3. Seleccionar cliente del dropdown
4. Agregar producto:
   ```
   Producto: Producto Test
   Cantidad: 10
   Precio Venta: 150
   Precio Compra: 100
   ```
5. ✅ **VERIFICAR:** Se calcula automáticamente:
   ```
   Total Venta: $1,500
   → Bóveda Monte: $1,000 (precioCompra × cantidad)
   → Fletes: $5,000 (flete × cantidad)
   → Utilidades: $500 (utilidad × cantidad)
   ```
6. Seleccionar **"Estado Pago: Completo"**
7. Click **"Crear Venta"**

**Verificación Crítica:**
8. Ir a **"Bancos"** → Tab **"Bóveda Monte"**
   ✅ Saldo incrementó en $1,000
9. Tab **"Fletes"**
   ✅ Saldo incrementó en $5,000
10. Tab **"Utilidades"**
    ✅ Saldo incrementó en $500

**Firebase Emulator:**
11. Ir a `http://127.0.0.1:4000/firestore`
12. ✅ Colección `ventas`: 1 documento nuevo
13. ✅ Colección `operaciones_bancos`: 3 documentos nuevos (uno por banco)
14. ✅ Colección `bancos`: Saldos actualizados en 3 documentos

**🎉 SI TODO FUNCIONA:**
- ✅ Firebase completamente integrado
- ✅ Lógica de negocio funcionando
- ✅ Distribución a 3 bancos correcta
- ✅ Actualizaciones en tiempo real
- ✅ Sistema 100% operativo

---

## 🐛 TROUBLESHOOTING

### Problema: "No se muestra nada en las tablas"
**Solución:**
1. Verifica que Firebase Emulator esté corriendo: `http://127.0.0.1:4000`
2. Abre consola del navegador (F12) y busca errores
3. Reinicia ambos servidores:
   ```bash
   # Terminal 1
   Ctrl+C
   npm run dev

   # Terminal 2
   Ctrl+C
   firebase emulators:start --only firestore
   ```

### Problema: "Error al guardar"
**Solución:**
1. Verifica que los campos requeridos estén llenos
2. Revisa la consola del navegador
3. Verifica que Firebase Emulator esté corriendo

### Problema: "Los saldos no se actualizan"
**Solución:**
1. Verifica que creaste una venta con "Estado Pago: Completo"
2. Recarga la página de Bancos (F5)
3. Verifica en Firebase UI que se crearon las operaciones

---

## ✅ CHECKLIST FINAL

Marca cada item después de probarlo:

- [ ] Vite Dev Server corriendo en http://localhost:5173
- [ ] Firebase Emulator corriendo en http://127.0.0.1:4000
- [ ] Puedo crear un distribuidor
- [ ] Puedo crear un cliente
- [ ] Puedo ver los 7 tabs de bancos
- [ ] Puedo agregar un movimiento bancario
- [ ] Puedo crear una venta
- [ ] Los 3 bancos se actualizan automáticamente
- [ ] Veo los documentos en Firebase Emulator UI
- [ ] Las animaciones funcionan correctamente

---

## 🎓 CONCEPTOS CLAVE VERIFICADOS

✅ **Firebase Firestore Integration**
- addDoc() → Crear documentos
- updateDoc() → Actualizar documentos
- getDocs() → Leer colecciones
- increment() → Actualizar valores numéricos
- Timestamp.now() → Timestamps automáticos

✅ **Lógica de Negocio**
- Distribución proporcional a 3 bancos
- Actualización atómica de múltiples documentos
- Historial de operaciones
- Estados de pago

✅ **UI/UX Premium**
- Framer Motion animations
- Modal system
- Responsive design
- Real-time updates

---

## 🚀 PRÓXIMO NIVEL

Si todo funciona perfectamente, puedes:

1. **Cargar datos demo masivos:**
   ```bash
   node scripts/init-firestore-data.js
   ```

2. **Explorar características avanzadas:**
   - Búsqueda en tiempo real
   - Filtros avanzados
   - Export a PDF
   - Gráficas interactivas

3. **Conectar a Firebase Production:**
   - Actualizar `.env` con keys reales
   - Cambiar URLs del emulator por production
   - Desplegar con `firebase deploy`

---

## 📞 SOPORTE

Todo funcionando? ✅
Problemas? Revisa:
1. Logs en terminal
2. Consola del navegador (F12)
3. Firebase Emulator UI
4. Archivo `VERIFICACION_SISTEMA_COMPLETO.md`

**¡Disfruta tu sistema Chronos totalmente funcional!** 🎉
