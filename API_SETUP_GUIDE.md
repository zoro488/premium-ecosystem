# 🔐 Guía de Configuración de APIs

Esta guía te ayudará a obtener y configurar todas las API keys necesarias para el **Premium Ecosystem**.

## 📋 Índice

1. [APIs Globales (Todas las Apps)](#apis-globales)
2. [FlowDistributor (Sistema Empresarial)](#flowdistributor)
3. [ShadowPrime (Crypto Wallets)](#shadowprime)
4. [Apollo (GPS & Drones)](#apollo)
5. [Synapse (IA Conversacional)](#synapse)
6. [Nexus (Monitoreo)](#nexus)
7. [Servicios Adicionales](#servicios-adicionales)

---

## 🌍 APIs Globales

Estas APIs son usadas por múltiples aplicaciones.

### OpenAI API (GPT-4)
**Usado en**: Todas las apps con AI Assistant

1. Ve a [platform.openai.com](https://platform.openai.com/signup)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** en el menú
4. Click en **Create new secret key**
5. Copia la key (empieza con `sk-`)

```env
VITE_OPENAI_API_KEY=sk-proj-...
VITE_OPENAI_MODEL=gpt-4-turbo-preview
```

**Costo**: ~$0.01-0.03 por mil tokens
**Alternativas**: Claude, Gemini

---

### Anthropic Claude API
**Usado en**: AI Assistant alternativo

1. Ve a [console.anthropic.com](https://console.anthropic.com/)
2. Crea cuenta
3. Ve a **API Keys**
4. Generate new key

```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
VITE_ANTHROPIC_MODEL=claude-3-opus-20240229
```

**Costo**: Similar a OpenAI
**Ventaja**: Mejor en análisis largo

---

### Google Gemini API
**Usado en**: AI Assistant alternativo

1. Ve a [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Get API key
3. Copia la key

```env
VITE_GOOGLE_AI_API_KEY=AIza...
VITE_GOOGLE_AI_MODEL=gemini-pro
```

**Costo**: Gratis hasta cierto límite
**Ventaja**: Free tier generoso

---

### Supabase (Base de Datos + Auth)
**Usado en**: Todas las apps para persistencia real

1. Ve a [supabase.com](https://supabase.com)
2. Create new project
3. Ve a **Settings > API**
4. Copia Project URL y anon/public key

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Costo**: Gratis hasta 500MB + 2GB bandwidth
**Incluye**: PostgreSQL, Auth, Storage, Realtime

---

## 💼 FlowDistributor

### Stripe (Pagos)
**Para**: Procesar pagos y facturación

1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com/register)
2. Crea cuenta
3. Get API keys (test mode primero)

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_STRIPE_SECRET_KEY=sk_test_...
```

**Costo**: 2.9% + $0.30 por transacción
**Alternativas**: PayPal, Square

---

### SendGrid (Emails)
**Para**: Enviar notificaciones por email

1. Ve a [sendgrid.com](https://signup.sendgrid.com/)
2. Create free account (100 emails/día gratis)
3. Settings > API Keys > Create API Key

```env
VITE_SENDGRID_API_KEY=SG...
VITE_SENDGRID_FROM_EMAIL=noreply@tudominio.com
```

**Costo**: Gratis hasta 100 emails/día
**Alternativas**: Resend, Mailgun, AWS SES

---

### Twilio (SMS)
**Para**: Notificaciones SMS

1. Ve a [twilio.com](https://www.twilio.com/try-twilio)
2. Sign up (recibe $15 crédito gratis)
3. Console > Account > API Keys

```env
VITE_TWILIO_ACCOUNT_SID=AC...
VITE_TWILIO_AUTH_TOKEN=...
VITE_TWILIO_PHONE_NUMBER=+1...
```

**Costo**: ~$0.0075 por SMS
**Alternativas**: Vonage, AWS SNS

---

### QuickBooks API (Contabilidad)
**Para**: Integración contable (Opcional avanzado)

1. Ve a [developer.intuit.com](https://developer.intuit.com/)
2. Create app
3. Get Client ID y Secret

```env
VITE_QUICKBOOKS_CLIENT_ID=AB...
VITE_QUICKBOOKS_CLIENT_SECRET=...
```

**Costo**: Varía según plan
**Alternativas**: Xero API, FreshBooks

---

## 💎 ShadowPrime

### CoinGecko API (Precios Crypto)
**Para**: Precios en tiempo real de criptomonedas

1. Ve a [coingecko.com/api](https://www.coingecko.com/en/api)
2. Free API: No requiere key (rate limited)
3. Pro API: Sign up para más requests

```env
VITE_COINGECKO_API_KEY=CG-... # Solo para Pro
```

**Costo**: Gratis con límites / $129/mes Pro
**Alternativas**: CoinMarketCap, Binance API

---

### Infura (Ethereum/Polygon)
**Para**: Conectar con blockchains

1. Ve a [infura.io](https://infura.io/register)
2. Create new project
3. Copy Project ID

```env
VITE_INFURA_PROJECT_ID=...
VITE_INFURA_ENDPOINT=https://mainnet.infura.io/v3/
```

**Costo**: Gratis hasta 100k requests/día
**Alternativas**: Alchemy, QuickNode

---

### Alchemy (Alternativa a Infura)
**Para**: Web3 infrastructure

1. Ve a [alchemy.com](https://dashboard.alchemy.com/signup)
2. Create app
3. View key

```env
VITE_ALCHEMY_API_KEY=...
VITE_ALCHEMY_NETWORK=eth-mainnet
```

**Costo**: Gratis hasta 300M compute units
**Ventaja**: Mejor performance que Infura

---

### TronGrid API (Tron Blockchain)
**Para**: Wallets TRX

1. Ve a [trongrid.io](https://www.trongrid.io/)
2. Sign up
3. Get API key

```env
VITE_TRONGRID_API_KEY=...
```

**Costo**: Gratis con rate limits

---

### Etherscan API (Explorador Ethereum)
**Para**: Información de transacciones ETH

1. Ve a [etherscan.io/register](https://etherscan.io/register)
2. My API Keys > Add
3. Copy API key

```env
VITE_ETHERSCAN_API_KEY=...
```

**Costo**: Gratis

---

### WalletConnect
**Para**: Conectar wallets externas

1. Ve a [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Create project
3. Get Project ID

```env
VITE_WALLETCONNECT_PROJECT_ID=...
```

**Costo**: Gratis hasta 1M requests

---

## 🛰️ Apollo

### Mapbox (Mapas Interactivos) ⭐ RECOMENDADO
**Para**: Mapas premium con estilo dark

1. Ve a [mapbox.com](https://account.mapbox.com/auth/signup/)
2. Create free account
3. Get access token

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/dark-v11
```

**Costo**: Gratis hasta 50k map loads/mes
**Ventaja**: Mejor personalización

---

### Google Maps API
**Para**: Alternativa a Mapbox

1. Ve a [console.cloud.google.com](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Credentials > Create API key

```env
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

**Costo**: $7 por 1000 map loads (tiene crédito gratis inicial)

---

### Cesium Ion (Mapas 3D)
**Para**: Visualización 3D avanzada de terreno

1. Ve a [cesium.com/ion](https://cesium.com/ion/signup)
2. Create account
3. Access tokens

```env
VITE_CESIUM_ION_ACCESS_TOKEN=eyJ...
```

**Costo**: Gratis hasta 5GB tiles/mes
**Uso**: Visualización 3D de drones

---

### OpenWeather API
**Para**: Clima para planificación de vuelos de drones

1. Ve a [openweathermap.org/api](https://openweathermap.org/api)
2. Sign up
3. API keys

```env
VITE_OPENWEATHER_API_KEY=...
```

**Costo**: Gratis hasta 1000 calls/día

---

## 🧠 Synapse

### ElevenLabs (Text-to-Speech Premium)
**Para**: Convertir texto en voz realista

1. Ve a [elevenlabs.io](https://elevenlabs.io/)
2. Sign up
3. Get API key

```env
VITE_ELEVENLABS_API_KEY=...
VITE_ELEVENLABS_VOICE_ID=... # ID de voz específica
```

**Costo**: 10k caracteres gratis/mes
**Calidad**: Excelente, voces ultra realistas

---

### AssemblyAI (Speech-to-Text)
**Para**: Transcribir audio a texto

1. Ve a [assemblyai.com](https://www.assemblyai.com/)
2. Sign up
3. Get API key

```env
VITE_ASSEMBLYAI_API_KEY=...
```

**Costo**: 5 horas gratis, luego $0.00025/segundo

---

### Pinecone (Vector Database)
**Para**: Memoria de largo plazo del AI

1. Ve a [pinecone.io](https://www.pinecone.io/)
2. Start free
3. Create index
4. Get API key

```env
VITE_PINECONE_API_KEY=...
VITE_PINECONE_ENVIRONMENT=us-west1-gcp
VITE_PINECONE_INDEX=synapse-vectors
```

**Costo**: Gratis hasta 100k vectors
**Uso**: Guardar contexto de conversaciones

---

## 📊 Nexus

### Sentry (Error Tracking)
**Para**: Capturar errores en producción

1. Ve a [sentry.io](https://sentry.io/signup/)
2. Create project
3. Get DSN

```env
VITE_SENTRY_DSN=https://...@sentry.io/...
```

**Costo**: Gratis hasta 5k events/mes
**Esencial**: Para detectar bugs

---

### LogRocket (Session Replay)
**Para**: Ver grabaciones de sesiones de usuarios

1. Ve a [logrocket.com](https://logrocket.com/signup/)
2. Create account
3. Get App ID

```env
VITE_LOGROCKET_APP_ID=tu-app/id
```

**Costo**: Gratis hasta 1k sessions/mes
**Útil**: Debugging visual

---

### PostHog (Product Analytics)
**Para**: Analytics de producto

1. Ve a [posthog.com](https://posthog.com/signup)
2. Deploy (cloud o self-hosted)
3. Get project API key

```env
VITE_POSTHOG_API_KEY=phc_...
VITE_POSTHOG_HOST=https://app.posthog.com
```

**Costo**: Gratis hasta 1M events/mes
**Open source**: Puedes self-host

---

### Mixpanel (Analytics Alternativo)
**Para**: User analytics y funnels

1. Ve a [mixpanel.com](https://mixpanel.com/register/)
2. Create project
3. Get token

```env
VITE_MIXPANEL_TOKEN=...
```

**Costo**: Gratis hasta 20M events/mes

---

## ☁️ Servicios Adicionales

### Cloudinary (Imágenes)
**Para**: Upload y transformación de imágenes

1. Ve a [cloudinary.com](https://cloudinary.com/users/register_free)
2. Sign up (gratis)
3. Dashboard > API Keys

```env
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_API_KEY=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

**Costo**: Gratis hasta 25 GB/mes

---

### Clerk (Autenticación Moderna)
**Para**: Auth con UI pre-construida

1. Ve a [clerk.com](https://clerk.com/)
2. Create application
3. Get keys

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

**Costo**: Gratis hasta 5k MAU
**Ventaja**: UI hermosa out-of-the-box

---

## 📝 Archivo .env Final

Copia `.env.example` a `.env` y agrega tus keys:

```bash
cp .env.example .env
```

Luego edita `.env` con tus API keys reales.

---

## ⚡ Prioridades de Implementación

### Nivel 1 - Esenciales (Empieza aquí)
1. **OpenAI** - Para AI Assistant
2. **Supabase** - Para base de datos real
3. **Mapbox** - Para Apollo
4. **CoinGecko** - Para ShadowPrime (free tier)

### Nivel 2 - Importantes
5. **Stripe** - Para pagos en FlowDistributor
6. **SendGrid** - Para emails
7. **Sentry** - Para error tracking
8. **Cloudinary** - Para imágenes

### Nivel 3 - Avanzadas
9. **ElevenLabs** - Voice en Synapse
10. **Pinecone** - Memoria IA
11. **Twilio** - SMS
12. **LogRocket** - Session replay

---

## 🔒 Seguridad

### ⚠️ IMPORTANTE

1. **NUNCA** commits el archivo `.env` a Git
2. Ya está en `.gitignore` - verifica que esté ahí
3. Rota las keys regularmente
4. Usa diferentes keys para dev/staging/production
5. En producción, usa variables de entorno del hosting (Vercel, Netlify, etc)

### Verificar .gitignore

Asegúrate que `.gitignore` incluya:

```
.env
.env.local
.env.*.local
```

---

## 🚀 Hosting - Variables de Entorno

### Vercel
1. Project Settings > Environment Variables
2. Agrega cada `VITE_*` variable
3. Separa por environment (Production, Preview, Development)

### Netlify
1. Site settings > Build & deploy > Environment
2. Add variable
3. Redeploy

---

## 💡 Tips

1. **Empieza con Free Tiers**: Casi todas las APIs tienen planes gratuitos
2. **Modo Development**: Usa keys de test/sandbox primero
3. **Monitoreo**: Configura alerts para cuotas de API
4. **Cache**: Implementa caching para reducir calls a APIs
5. **Rate Limiting**: Respeta los límites de las APIs

---

## 🆘 Soporte

Si una API no funciona:

1. Verifica que la key esté correcta en `.env`
2. Reinicia el servidor de desarrollo (`npm run dev`)
3. Verifica los logs de consola
4. Revisa la documentación oficial de la API
5. Verifica límites de rate/quota

---

## 📊 Tabla Resumen de Costos

| Servicio | Free Tier | Costo Aprox/Mes |
|----------|-----------|-----------------|
| OpenAI | $5 crédito | $20-50 |
| Supabase | 500MB DB | $25 (Pro) |
| Mapbox | 50k loads | $5 (después) |
| Stripe | N/A | % de transacciones |
| SendGrid | 100/día | $15 (40k emails) |
| CoinGecko | ∞ (limitado) | $0 |
| Sentry | 5k events | $26 (Team) |
| Cloudinary | 25GB | $89 (Plus) |
| **TOTAL** | **~$50** | **~$150-200** |

**Con free tiers inteligentemente usados, puedes correr todo con $0-20/mes inicialmente.**

---

**¿Necesitas ayuda?** Revisa la documentación de cada servicio o contacta a su soporte.
