/**
 * API Configuration
 * Centraliza todas las configuraciones de APIs
 */

// ============================================
// GLOBAL APIS
// ============================================

export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
  orgId: import.meta.env.VITE_OPENAI_ORG_ID || '',
  baseURL: 'https://api.openai.com/v1',
};

export const ANTHROPIC_CONFIG = {
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  model: import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-opus-20240229',
  baseURL: 'https://api.anthropic.com/v1',
};

export const GOOGLE_AI_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
  model: import.meta.env.VITE_GOOGLE_AI_MODEL || 'gemini-pro',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
};

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  serviceKey: import.meta.env.VITE_SUPABASE_SERVICE_KEY || '',
};

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// ============================================
// FLOWDISTRIBUTOR APIS
// ============================================

export const FLOW_CONFIG = {
  apiUrl: import.meta.env.VITE_FLOW_API_URL || 'http://localhost:3001/api',
  apiKey: import.meta.env.VITE_FLOW_API_KEY || '',
};

export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
};

export const QUICKBOOKS_CONFIG = {
  clientId: import.meta.env.VITE_QUICKBOOKS_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_QUICKBOOKS_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_QUICKBOOKS_REDIRECT_URI || '',
};

export const TWILIO_CONFIG = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
};

export const SENDGRID_CONFIG = {
  apiKey: import.meta.env.VITE_SENDGRID_API_KEY || '',
  fromEmail: import.meta.env.VITE_SENDGRID_FROM_EMAIL || '',
};

export const PLAID_CONFIG = {
  clientId: import.meta.env.VITE_PLAID_CLIENT_ID || '',
  secret: import.meta.env.VITE_PLAID_SECRET || '',
  env: import.meta.env.VITE_PLAID_ENV || 'sandbox',
};

// ============================================
// SHADOWPRIME APIS
// ============================================

export const TRONGRID_CONFIG = {
  apiKey: import.meta.env.VITE_TRONGRID_API_KEY || '',
  url: import.meta.env.VITE_TRONGRID_URL || 'https://api.trongrid.io',
};

export const INFURA_CONFIG = {
  projectId: import.meta.env.VITE_INFURA_PROJECT_ID || '',
  projectSecret: import.meta.env.VITE_INFURA_PROJECT_SECRET || '',
  endpoint: import.meta.env.VITE_INFURA_ENDPOINT || 'https://mainnet.infura.io/v3/',
};

export const ALCHEMY_CONFIG = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || '',
  network: import.meta.env.VITE_ALCHEMY_NETWORK || 'eth-mainnet',
};

export const COINGECKO_CONFIG = {
  apiKey: import.meta.env.VITE_COINGECKO_API_KEY || '',
  proUrl: import.meta.env.VITE_COINGECKO_PRO_URL || 'https://pro-api.coingecko.com/api/v3',
  freeUrl: 'https://api.coingecko.com/api/v3',
};

export const CMC_CONFIG = {
  apiKey: import.meta.env.VITE_CMC_API_KEY || '',
  url: import.meta.env.VITE_CMC_URL || 'https://pro-api.coinmarketcap.com/v1',
};

export const BINANCE_CONFIG = {
  apiKey: import.meta.env.VITE_BINANCE_API_KEY || '',
  secretKey: import.meta.env.VITE_BINANCE_SECRET_KEY || '',
  url: import.meta.env.VITE_BINANCE_URL || 'https://api.binance.com',
};

export const ETHERSCAN_CONFIG = {
  apiKey: import.meta.env.VITE_ETHERSCAN_API_KEY || '',
  url: import.meta.env.VITE_ETHERSCAN_URL || 'https://api.etherscan.io/api',
};

export const BSCSCAN_CONFIG = {
  apiKey: import.meta.env.VITE_BSCSCAN_API_KEY || '',
  url: import.meta.env.VITE_BSCSCAN_URL || 'https://api.bscscan.com/api',
};

export const WALLETCONNECT_CONFIG = {
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
};

// ============================================
// APOLLO APIS
// ============================================

export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  style: import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/dark-v11',
};

export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || '',
};

export const CESIUM_CONFIG = {
  accessToken: import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN || '',
  assetId: import.meta.env.VITE_CESIUM_ION_ASSET_ID || '',
};

export const HERE_CONFIG = {
  apiKey: import.meta.env.VITE_HERE_API_KEY || '',
};

export const DJI_CONFIG = {
  appKey: import.meta.env.VITE_DJI_APP_KEY || '',
  appSecret: import.meta.env.VITE_DJI_APP_SECRET || '',
};

export const FLEET_CONFIG = {
  apiUrl: import.meta.env.VITE_FLEET_API_URL || '',
  apiKey: import.meta.env.VITE_FLEET_API_KEY || '',
};

export const TRACCAR_CONFIG = {
  url: import.meta.env.VITE_TRACCAR_URL || '',
  username: import.meta.env.VITE_TRACCAR_USERNAME || '',
  password: import.meta.env.VITE_TRACCAR_PASSWORD || '',
};

export const OPENWEATHER_CONFIG = {
  apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  url: import.meta.env.VITE_OPENWEATHER_URL || 'https://api.openweathermap.org/data/2.5',
};

export const AIRMAP_CONFIG = {
  apiKey: import.meta.env.VITE_AIRMAP_API_KEY || '',
};

// ============================================
// SYNAPSE APIS
// ============================================

export const HUGGINGFACE_CONFIG = {
  apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY || '',
  baseURL: 'https://api-inference.huggingface.co/models',
};

export const COHERE_CONFIG = {
  apiKey: import.meta.env.VITE_COHERE_API_KEY || '',
  baseURL: 'https://api.cohere.ai/v1',
};

export const ELEVENLABS_CONFIG = {
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || '',
  baseURL: 'https://api.elevenlabs.io/v1',
};

export const ASSEMBLYAI_CONFIG = {
  apiKey: import.meta.env.VITE_ASSEMBLYAI_API_KEY || '',
  baseURL: 'https://api.assemblyai.com/v2',
};

export const DEEPGRAM_CONFIG = {
  apiKey: import.meta.env.VITE_DEEPGRAM_API_KEY || '',
  baseURL: 'https://api.deepgram.com/v1',
};

export const PINECONE_CONFIG = {
  apiKey: import.meta.env.VITE_PINECONE_API_KEY || '',
  environment: import.meta.env.VITE_PINECONE_ENVIRONMENT || '',
  index: import.meta.env.VITE_PINECONE_INDEX || '',
};

export const WEAVIATE_CONFIG = {
  url: import.meta.env.VITE_WEAVIATE_URL || '',
  apiKey: import.meta.env.VITE_WEAVIATE_API_KEY || '',
};

// ============================================
// NEXUS APIS
// ============================================

export const SENTRY_CONFIG = {
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  org: import.meta.env.VITE_SENTRY_ORG || '',
  project: import.meta.env.VITE_SENTRY_PROJECT || '',
};

export const LOGROCKET_CONFIG = {
  appId: import.meta.env.VITE_LOGROCKET_APP_ID || '',
};

export const DATADOG_CONFIG = {
  clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN || '',
  applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID || '',
  site: import.meta.env.VITE_DATADOG_SITE || 'datadoghq.com',
};

export const NEWRELIC_CONFIG = {
  licenseKey: import.meta.env.VITE_NEWRELIC_LICENSE_KEY || '',
  appId: import.meta.env.VITE_NEWRELIC_APP_ID || '',
};

export const MIXPANEL_CONFIG = {
  token: import.meta.env.VITE_MIXPANEL_TOKEN || '',
};

export const SEGMENT_CONFIG = {
  writeKey: import.meta.env.VITE_SEGMENT_WRITE_KEY || '',
};

export const POSTHOG_CONFIG = {
  apiKey: import.meta.env.VITE_POSTHOG_API_KEY || '',
  host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
};

// ============================================
// SERVICIOS ADICIONALES
// ============================================

export const REDIS_CONFIG = {
  url: import.meta.env.VITE_REDIS_URL || '',
  password: import.meta.env.VITE_REDIS_PASSWORD || '',
};

export const MONGODB_CONFIG = {
  uri: import.meta.env.VITE_MONGODB_URI || '',
};

export const POSTGRES_CONFIG = {
  url: import.meta.env.VITE_POSTGRES_URL || '',
};

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
};

export const AWS_CONFIG = {
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  s3Bucket: import.meta.env.VITE_AWS_S3_BUCKET || '',
};

export const VERCEL_CONFIG = {
  analyticsId: import.meta.env.VITE_VERCEL_ANALYTICS_ID || '',
};

export const CLERK_CONFIG = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
  secretKey: import.meta.env.VITE_CLERK_SECRET_KEY || '',
};

export const AUTH0_CONFIG = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_AUTH0_CLIENT_SECRET || '',
};

// ============================================
// APP CONFIG
// ============================================

export const APP_CONFIG = {
  env: import.meta.env.VITE_APP_ENV || 'development',
  debug: import.meta.env.VITE_APP_DEBUG === 'true',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:3004',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  wsUrl: import.meta.env.VITE_WS_URL || '',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verifica si una API está configurada
 */
export const isAPIConfigured = (apiConfig) => {
  if (typeof apiConfig === 'string') {
    return apiConfig.length > 0;
  }
  return Object.values(apiConfig).some((value) => value && value.length > 0);
};

/**
 * Obtiene el estado de todas las APIs
 */
export const getAPIStatus = () => {
  return {
    // Global
    openai: isAPIConfigured(OPENAI_CONFIG.apiKey),
    anthropic: isAPIConfigured(ANTHROPIC_CONFIG.apiKey),
    googleAI: isAPIConfigured(GOOGLE_AI_CONFIG.apiKey),
    supabase: isAPIConfigured(SUPABASE_CONFIG.url),
    firebase: isAPIConfigured(FIREBASE_CONFIG.apiKey),

    // FlowDistributor
    flow: isAPIConfigured(FLOW_CONFIG.apiKey),
    stripe: isAPIConfigured(STRIPE_CONFIG.publicKey),
    quickbooks: isAPIConfigured(QUICKBOOKS_CONFIG.clientId),
    twilio: isAPIConfigured(TWILIO_CONFIG.accountSid),
    sendgrid: isAPIConfigured(SENDGRID_CONFIG.apiKey),
    plaid: isAPIConfigured(PLAID_CONFIG.clientId),

    // ShadowPrime
    trongrid: isAPIConfigured(TRONGRID_CONFIG.apiKey),
    infura: isAPIConfigured(INFURA_CONFIG.projectId),
    alchemy: isAPIConfigured(ALCHEMY_CONFIG.apiKey),
    coingecko: isAPIConfigured(COINGECKO_CONFIG.apiKey),
    cmc: isAPIConfigured(CMC_CONFIG.apiKey),
    binance: isAPIConfigured(BINANCE_CONFIG.apiKey),

    // Apollo
    mapbox: isAPIConfigured(MAPBOX_CONFIG.accessToken),
    googleMaps: isAPIConfigured(GOOGLE_MAPS_CONFIG.apiKey),
    cesium: isAPIConfigured(CESIUM_CONFIG.accessToken),
    fleet: isAPIConfigured(FLEET_CONFIG.apiKey),
    traccar: isAPIConfigured(TRACCAR_CONFIG.url),
    openweather: isAPIConfigured(OPENWEATHER_CONFIG.apiKey),

    // Synapse
    huggingface: isAPIConfigured(HUGGINGFACE_CONFIG.apiKey),
    cohere: isAPIConfigured(COHERE_CONFIG.apiKey),
    elevenlabs: isAPIConfigured(ELEVENLABS_CONFIG.apiKey),
    assemblyai: isAPIConfigured(ASSEMBLYAI_CONFIG.apiKey),
    pinecone: isAPIConfigured(PINECONE_CONFIG.apiKey),

    // Nexus
    sentry: isAPIConfigured(SENTRY_CONFIG.dsn),
    logrocket: isAPIConfigured(LOGROCKET_CONFIG.appId),
    datadog: isAPIConfigured(DATADOG_CONFIG.clientToken),
    mixpanel: isAPIConfigured(MIXPANEL_CONFIG.token),
    posthog: isAPIConfigured(POSTHOG_CONFIG.apiKey),
  };
};

/**
 * Muestra advertencias de APIs no configuradas en consola
 */
export const logAPIWarnings = () => {
  if (!APP_CONFIG.debug) return;

  const status = getAPIStatus();
  const missingAPIs = Object.entries(status)
    .filter(([_, configured]) => !configured)
    .map(([api]) => api);

  if (missingAPIs.length > 0) {
    // console.warn('⚠️ Las siguientes APIs no están configuradas:');
    missingAPIs.forEach((api) => console.warn(`  - ${api}`));
    // console.warn('Configura las API keys en el archivo .env para habilitar estas funcionalidades');
  }
};

// Log de advertencias en desarrollo
if (APP_CONFIG.debug) {
  logAPIWarnings();
}

export default {
  OPENAI_CONFIG,
  ANTHROPIC_CONFIG,
  GOOGLE_AI_CONFIG,
  SUPABASE_CONFIG,
  FIREBASE_CONFIG,
  FLOW_CONFIG,
  STRIPE_CONFIG,
  MAPBOX_CONFIG,
  COINGECKO_CONFIG,
  APP_CONFIG,
  // ... todos los demás configs
  isAPIConfigured,
  getAPIStatus,
  logAPIWarnings,
};
