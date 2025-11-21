/**
 * Validación de Variables de Entorno
 * Asegura que todas las configuraciones críticas estén presentes
 */

interface EnvValidation {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Variables de entorno requeridas para Firebase
 */
const REQUIRED_FIREBASE_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

/**
 * Variables de entorno opcionales pero recomendadas
 */
const OPTIONAL_VARS = ['VITE_FIREBASE_MEASUREMENT_ID', 'VITE_SENTRY_DSN'];

/**
 * Valida que todas las variables de entorno requeridas estén presentes
 */
export const validateEnv = (): EnvValidation => {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Verificar variables requeridas
  for (const varName of REQUIRED_FIREBASE_VARS) {
    const value = import.meta.env[varName];
    if (!value || value === '' || value === 'undefined') {
      missing.push(varName);
    }
  }

  // Verificar variables opcionales
  for (const varName of OPTIONAL_VARS) {
    const value = import.meta.env[varName];
    if (!value || value === '' || value === 'undefined') {
      warnings.push(`${varName} no configurado (opcional)`);
    }
  }

  const isValid = missing.length === 0;

  return {
    isValid,
    missing,
    warnings,
  };
};

/**
 * Valida y muestra errores en consola si hay problemas
 */
export const validateAndWarnEnv = (): boolean => {
  const validation = validateEnv();

  if (!validation.isValid) {
    console.error('❌ ERROR: Variables de entorno faltantes');
    console.error('');
    console.error('Variables requeridas faltantes:');
    for (const varName of validation.missing) {
      console.error(`  ❌ ${varName}`);
    }
    console.error('');
    console.error('💡 Solución:');
    console.error('  1. Copia .env.example a .env');
    console.error('  2. Rellena todas las variables requeridas');
    console.error('  3. En Vercel: Settings > Environment Variables');
    console.error('');
    return false;
  }

  if (validation.warnings.length > 0 && import.meta.env.DEV) {
    console.warn('⚠️ Advertencias de configuración:');
    for (const warning of validation.warnings) {
      console.warn(`  ⚠️ ${warning}`);
    }
    console.warn('');
  }

  return true;
};

/**
 * Obtiene el valor de una variable de entorno con validación
 */
export const getEnvVar = (varName: string, defaultValue?: string): string => {
  const value = import.meta.env[varName];

  if (!value || value === '' || value === 'undefined') {
    if (defaultValue !== undefined) {
      if (import.meta.env.DEV) {
        console.warn(`⚠️ ${varName} no configurado, usando valor por defecto`);
      }
      return defaultValue;
    }
    throw new Error(`Variable de entorno ${varName} no configurada`);
  }

  return value;
};

/**
 * Obtiene configuración de Firebase validada
 */
export const getFirebaseConfig = () => {
  try {
    return {
      apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
      authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
      projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
      storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
      appId: getEnvVar('VITE_FIREBASE_APP_ID'),
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
    };
  } catch (error) {
    console.error('❌ Error al obtener configuración de Firebase:', error);
    throw error;
  }
};

export default {
  validateEnv,
  validateAndWarnEnv,
  getEnvVar,
  getFirebaseConfig,
};
