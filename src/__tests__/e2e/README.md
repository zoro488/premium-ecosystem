# E2E Validation Tests

## 🎯 Propósito

Este directorio contiene los tests End-to-End (E2E) para validar el flujo completo de datos:

```
Excel → Firestore → UI
```

## 📋 Tests Implementados

### `excel-firestore-ui-validation.test.js`

Valida que los datos del archivo Excel se importen correctamente a Firestore y sean consistentes.

#### Tests incluidos:

1. **✅ Capital Total: Excel = Firestore**
   - Valida que el capital total calculado del Excel coincida con Firestore
   - Tolerancia: 1 peso (por redondeos)

2. **✅ Todos los bancos del Excel están en Firestore**
   - Verifica que todos los bancos del Excel estén presentes en Firestore
   - Valida la integridad de la importación

3. **✅ Datos de bancos coinciden: Excel = Firestore**
   - Compara los datos individuales de cada banco
   - Valida capital actual, ingresos y gastos

4. **✅ Transacciones: Excel = Firestore**
   - Valida la cantidad de transacciones importadas
   - Compara totales de ingresos

5. **✅ Integridad de relaciones: Órdenes de Compra ↔ Distribuidores**
   - Verifica que las relaciones entre entidades sean correctas
   - Valida la integridad referencial

6. **✅ Clientes: Datos presentes y válidos**
   - Valida que los clientes se hayan importado correctamente
   - Verifica estructura de datos

## 🚀 Ejecución

### Local

```bash
# Ejecutar tests E2E
npm run test:e2e:validation

# Ejecutar con UI
npm run test:e2e:validation:ui

# Ejecutar validación completa
npm run validate:all
```

### Con Firebase Emulator

```bash
# Terminal 1: Iniciar emulador
firebase emulators:start --only firestore

# Terminal 2: Ejecutar tests
npm run test:e2e:validation
```

### CI/CD (GitHub Actions)

Los tests se ejecutan automáticamente:

- ✅ En cada push a `main`
- ✅ Cada 6 horas (schedule)
- ✅ Manualmente (workflow_dispatch)

## 🔧 Configuración

### Vitest Config

Los tests E2E usan configuración especial en `vitest.e2e.config.js`:

- **Timeout**: 90 segundos por test
- **Environment**: jsdom
- **Pool**: forks (para tests intensivos)
- **Sequence**: no shuffle (orden predecible)

### Firebase Emulator

El emulador se configura en `firebase.json`:

```json
{
  "emulators": {
    "firestore": {
      "port": 8080
    }
  }
}
```

## 📊 Reportes

### Artefactos generados

1. **test-results-e2e/** - Resultados HTML de los tests
2. **coverage-e2e/** - Cobertura de código E2E
3. **VALIDATION_REPORT.md** - Reporte de validación exitosa
4. **VALIDATION_FAILURE.md** - Reporte de fallos (si aplica)

### Workflow Artifacts

Los artefactos se suben automáticamente a GitHub Actions:

- Reportes de validación
- Resultados de tests
- Logs de ejecución

## 🐛 Debugging

### Test local con logs detallados

```bash
# Ver logs completos
DEBUG=* npm run test:e2e:validation

# Solo tests específicos
npm run test:e2e:validation -- -t "Capital Total"
```

### Verificar conexión al emulador

```bash
# Check emulador
curl http://localhost:8080

# Variables de entorno
export FIRESTORE_EMULATOR_HOST=localhost:8080
export VITE_FIREBASE_PROJECT_ID=demo-test
```

### Problemas comunes

1. **Error: Firebase not configured**
   - Solución: Verificar variables de entorno VITE_FIREBASE_*

2. **Error: Cannot connect to emulator**
   - Solución: Iniciar emulador con `firebase emulators:start`

3. **Error: Excel file not found**
   - Solución: Verificar que `Administación_General.xlsx` existe en root

4. **Timeout errors**
   - Solución: Aumentar timeout en `vitest.e2e.config.js`

## 📝 Agregar nuevos tests

```javascript
it('✅ Mi nuevo test', async () => {
  // 1. Preparar datos
  const data = await obtenerDatos();
  
  // 2. Validar
  expect(data).toBeDefined();
  
  // 3. Log resultados
  console.log('✅ Test completado');
}, 30000); // timeout 30s
```

## 🔒 Seguridad

- ❌ NO commitear credenciales de Firebase
- ✅ Usar emulador para tests locales
- ✅ Usar variables de entorno para CI/CD
- ✅ Revisar `.gitignore` para artefactos

## 📚 Referencias

- [Vitest Docs](https://vitest.dev)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
- [Testing Library](https://testing-library.com)

---

**Última actualización**: 2025-11-13
