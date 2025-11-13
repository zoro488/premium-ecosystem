# 🚨 SOLUCIÓN: Habilitar Generative Language API

## ❌ Error Actual


```
Error: Generative Language API has not been used in project 13546974997 before or it is disabled.
```

## ✅ SOLUCIONES

### Opción 1: Habilitar la API (Recomendado si tienes proyecto GCP)


#### Paso 1<https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=13546974997>
<https://console.cloud.google.com/>
1. Visita: <https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=13546974997>
2. O busca "Generative Language API" en <https://console.cloud.google.com/>


#### Paso 2: Habilitar la API

1. Click en "ENABLE" (Habilitar)
2. Espera 2-3 minutos para que se propague
3. Reintentar el comando

---

### Opción 2: Usar Google AI Studio API Key (MÁS FÁCIL) ⭐


Tu API ke<https://makersuite.google.com/app/apikey>ecto GCP, pero puedes obtener una nueva directamente desde Google AI Studio:
<https://aistudio.google.com/app/apikey>
#### Paso 1: Obtener Nueva API Key

1. Ve a: <https://makersuite.google.com/app/apikey>
2. O: <https://aistudio.google.com/app/apikey>

3. Click en "Create API Key"
4. Selecciona "Create API key in new project" (no requiere GCP)

#### Paso 2: Actualizar .env

```env

# Reemplazar en .env
VITE_GEMINI_API_KEY=tu-nueva-api-key-aqui
```

#### Paso 3: Verificar

```bash
node gemini-cli.js ask "test"
```

---

### Opción 3: Verificar Proyecto Actual

```bash
# Verificar si el proyecto existe y está activo
gcloud projects list

# Ver proyecto actual
gcloud config get-value project

# Cambiar de proyecto (si tienes otro)
gcloud config set project otro-proyecto-id
```


---

## 🔍 DIAGNÓSTICO COMPLETO

### Verificar API Key

```bash
# Ver primeros caracteres

$env:VITE_GEMINI_API_KEY

# O en .env
cat .env | Select-String "VITE_GEMINI_API_KEY"
```

### Tipo de API Key

Hay dos tipos de API keys para Gemini:

1. **Google AI Studio API Key** (Recomendado)
   - Formato: `AIza...` (39 caracteres)
   - No requiere proyecto GCP
   - Free tier generoso
   - Solo para Gemini API
   - ✅ Más fácil de configurar

2. **Google Cloud API Key**
   - Formato: `AIza...` (39 caracteres, igual)
   - Requiere proyecto GCP
   - Requiere habilitar APIs manualmente
   - Más control y opciones avanzadas
   - Facturación de GCP


Tu key actual: `AIzaSyAh-W4sEjQaIsz52xQfy4ypi4gZ8S4S1xA`

---

## ⚡ SOLUCIÓN RÁPIDA (5 minutos)


### 1. Crear Nueva API Key en AI Studio

```
1. https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copiar la key
```

### 2. Actualizar .env


```powershell
# Backup del .env actual
Copy-Item .env .env.backup

# Editar .env y reemplazar VITE_GEMINI_API_KEY
notepad .env
```

### 3. Probar

```bash
node gemini-cli.js ask "Hola, funciona?"
```

---

## 📊 COMPARACIÓN DE OPCIONES

| Característica | AI Studio Key | GCP API Key |
|---------------|---------------|-------------|
| Configuración | ⭐ Rápida (5 in) | 🔧 Compleja (30 min) |
| Requiere GCP | ❌ No | ✅ Sí |
| Free Tier | ✅ Generoso | ✅ Similar |
| Facturación | 💳 Automática | 💳 Manual GCP |
| Límites | 60 req/min | Configurable |
| **Recomendado para** | Desarrollo | Producción |

---

## 🎯 RECOMENDACIÓN

### Para tu ecosistema premium

1. **Desarrollo Local** → Usar AI Studio API Key
   - Más rápido de configurar
   - Sin complicaciones de GCP
   - Perfecto para testi<https://aistudio.google.com/>
<https://ai.google.dev/docs>
2. **Producción<https://ai.google.dev/pricing>
   - Más control<https://console.cloud.google.com/>
   - Mejor monitoreo<https://ai.google.dev/docs/quotas>
   - Integración con otros servicios GCP

---

## 🔗 ENLACES ÚTILES

- **Google AI Studio**: <https://aistudio.google.com/>
- **Documentación Gemini API**: <https://ai.google.dev/docs>

- **Pricing**: <https://ai.google.dev/pricing>
- **GCP Console**: <https://console.cloud.google.com/>
- **Cuotas y límites**: <https://ai.google.dev/docs/quotas>

---

## 💡 PRÓXIMOS PASOS

### Una vez funcionando


1. **Configurar límites de uso**

   ```javascript
   // En src/lib/gemini/config.js
   export const USAGE_LIMITS = {
     maxRequestsPerMinute: 60,
     maxTokensPerRequest: 2048,
     enableRateLimiting: true
   }

   ```

2. **Implementar caché**

   ```javascript
   // Cachear respuestas comunes
   import { cache } from '@/utils/cache'

   const cachedResponse = await cache.get(prompt)
   if (cachedResponse) return cachedResponse
   ```

3. **Monitorear uso**

   ```javascript
   // Tracking en Firebase Analytics
   import { trackAIRequest } from '@/services/analytics'
   trackAIRequest('ask', model, tokens)
   ```

---

## 🆘 SOPORTE

Si sigues teniendo problemas:

1. Verifica que la API key está en .env correctamente
2. Reinicia VS Code completamente
3. Limpia caché: `npm run clean`
4. Verifica conexión: `Test-Connection google.com`
5. Revisa límites de cuota en AI Studio


---

## ✅ CHECKLIST

- [ ] Obtuve nueva API key de AI Studio
- [ ] Actualicé .env con nueva key
- [ ] Hice backup de .env anterior
- [ ] Probé: `node gemini-cli.js ask "test"`
- [ ] Funciona correctamente ✨
- [ ] Configuré git para ignorar .env: `git add .gitignore`

---

**¿Todo listo?** Ejecuta:

```bash
node gemini-cli.js chat
```

¡Y a explotar el máximo potencial de Gemini! 🚀✨
