# 🚀 Sistema Auto-Fix & Start - Chronos System

Sistema autónomo de auto-corrección y arranque para el Premium Ecosystem.

## 🎯 Características

- ✅ **Auto-detección de puerto ocupado** y liberación automática
- ✅ **Verificación de dependencias** con instalación automática
- ✅ **Limpieza de cache** inteligente en caso de errores
- ✅ **Validación de Firebase** config
- ✅ **Tests pre-inicio** automáticos
- ✅ **Reintentos automáticos** (hasta 5 intentos)
- ✅ **Logs claros** con iconos y colores

## 🚀 Uso

### Opción 1: Auto-Fix + Inicio Automático (Recomendado)

```bash
npm run dev:auto
```

Este comando:
1. Verifica si el puerto 3001 está ocupado y lo libera
2. Verifica que todas las dependencias estén instaladas
3. Limpia cache si es necesario
4. Valida configuración de Firebase
5. Ejecuta tests de validación
6. Inicia el servidor de desarrollo

### Opción 2: Inicio Seguro con Tests

```bash
npm run dev:safe
```

Ejecuta tests de pre-validación antes de iniciar el servidor.

### Opción 3: Fix Manual de Puerto

```bash
npm run fix:port
```

Libera el puerto 3001 si está ocupado.

### Opción 4: Fix Completo

```bash
npm run fix:all
```

Realiza limpieza completa y reinicia:
- Elimina cache de Vite
- Elimina node_modules/.vite
- Reinstala dependencias
- Libera puerto
- Inicia con auto-fix

## 📊 Salida Esperada

```
╔════════════════════════════════════════════════════╗
║  🚀 CHRONOS SYSTEM - AUTO-FIX & START             ║
╚════════════════════════════════════════════════════╝

ℹ️ Intento 1/5
✅ Puerto 3001 disponible
✅ Todas las dependencias presentes
✅ Configuración de Firebase encontrada en src/config/firebase.js
🧪 Ejecutando tests...
✅ Tests pasaron exitosamente
ℹ️ Iniciando servidor de desarrollo...
✅ Servidor iniciado exitosamente en http://localhost:3001

✅ Chronos System iniciado exitosamente
```

## 🧪 Tests de Pre-Validación

El sistema ejecuta automáticamente estos tests antes de iniciar:

- ✅ Validación de `package.json`
- ✅ Verificación de dependencias críticas (react, firebase, vite, zod)
- ✅ Existencia de configuración de Firebase
- ✅ Estructura de directorios principal
- ✅ Archivo `index.html` presente
- ✅ Configuración de Vite
- ✅ Configuración de TypeScript
- ✅ Variables de entorno (opcional)

Para ejecutar solo los tests:

```bash
npm run test:pre-start
```

## 🔧 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicio normal del servidor |
| `npm run dev:auto` | Inicio con auto-fix (recomendado) |
| `npm run dev:safe` | Inicio con tests previos |
| `npm run fix:port` | Libera puerto 3001 |
| `npm run fix:cache` | Limpia cache y reinstala |
| `npm run fix:all` | Fix completo + auto-start |
| `npm run test:pre-start` | Solo ejecuta tests de validación |

## 🛠️ Solución de Problemas

### Error: Puerto ocupado

```bash
npm run fix:port
```

### Error: Dependencias faltantes

```bash
npm install
npm run dev:auto
```

### Error: Cache corrupto

```bash
npm run fix:cache
```

### Error persistente después de 5 intentos

```bash
npm run fix:all
```

## 📁 Archivos del Sistema

```
premium-ecosystem/
├── scripts/
│   └── auto-fix-dev.js          # Script principal de auto-fix
├── src/
│   └── __tests__/
│       └── pre-start-validation.test.ts  # Tests de pre-validación
└── package.json                  # Scripts npm actualizados
```

## 🎯 Flujo de Trabajo Recomendado

1. **Primera vez:**
   ```bash
   npm install
   npm run dev:auto
   ```

2. **Desarrollo normal:**
   ```bash
   npm run dev:auto
   ```

3. **Si hay problemas:**
   ```bash
   npm run fix:all
   ```

## ✨ Características Avanzadas

### Reintentos Automáticos

El sistema reintenta automáticamente hasta 5 veces si encuentra errores:

- **Intento 1**: Validación completa + tests
- **Intento 2+**: Incluye limpieza de cache
- **Intento 5**: Último intento antes de fallar

### Detección Inteligente

- Detecta puerto ocupado antes de intentar iniciar
- Verifica dependencias antes de ejecutar
- Valida Firebase config antes de continuar
- Ejecuta tests solo en el primer intento

### Logs Claros

- 🧪 Tests
- ✅ Éxito
- ❌ Error
- 🔧 Fix aplicado
- ℹ️ Información

## 🚀 Próximos Pasos

Después de que el servidor inicie exitosamente:

1. Abre http://localhost:3001 en tu navegador
2. Deberías ver el SplashScreen de Chronos
3. Navega a FlowDistributor para ver los componentes premium
4. Revisa la consola del navegador (F12) para asegurarte que no hay errores

## 📚 Referencias

- [Vite Documentation](https://vitejs.dev)
- [Vitest Documentation](https://vitest.dev)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Nota:** Este sistema está diseñado para el entorno de desarrollo. Para producción, usa `npm run build` seguido de `npm run deploy`.
