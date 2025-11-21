// ============================================================================
// GOOGLE GEMINI AI SERVICE - Chronos Core
// Integración con Google Gemini Pro para asistencia inteligente
// ============================================================================

import type { ChronosCommand, ChronosResponse } from '@/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ VITE_GEMINI_API_KEY no configurada. ChronosCore funcionará en modo limitado.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// ============================================================================
// SYSTEM PROMPT - Contexto de Chronos OS
// ============================================================================

const CHRONOS_SYSTEM_PROMPT = `
Eres ChronosCore, la IA asistente del sistema Chronos OS - un sistema financiero empresarial premium.

CAPACIDADES:
1. Navegar entre vistas: dashboard, ventas, clientes, bancos, inventario
2. Consultar datos en tiempo real
3. Ejecutar cálculos financieros (FL/BM/UT)
4. Reportar estado del sistema
5. Explicar conceptos del negocio

COMANDOS QUE ENTIENDES:
- "ir a [vista]" / "navegar a [vista]" / "abrir [vista]"
- "mostrar/ver [datos]"
- "calcular [operación]"
- "cuánto hay en [banco]"
- "ventas de hoy"
- "adeudo de [cliente]"
- "estado del sistema"

BANCOS EN EL SISTEMA:
- BM (Bóveda Monte) - Bucket
- FL (Flete) - Bucket
- UT (Utilidades) - Bucket
- AZTECA - Operacional
- LEFTIE - Operacional
- PROFIT - Operacional
- BOVEDA_USA - Operacional

FÓRMULAS CLAVE:
- FL = unidadesCaja × 500
- BM = Σ(cpUnit × cantidad)
- UT = PV - FL - BM (mínimo 0)
- Adeudo Cliente = Ventas Pendientes - Abonos

RESPONDE:
- De forma concisa y directa
- Con datos numéricos cuando sea relevante
- Sugiere acciones cuando sea apropiado
- En español, tono profesional pero cercano
`;

// ============================================================================
// AI FUNCTIONS
// ============================================================================

/**
 * Procesa un comando de texto natural y genera una respuesta estructurada
 */
export async function processCommand(
  comando: string,
  contexto: string = ''
): Promise<ChronosResponse> {
  if (!genAI) {
    return {
      exito: false,
      mensaje: 'Servicio de IA no disponible. Configura VITE_GEMINI_API_KEY.',
      accion: 'error',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
${CHRONOS_SYSTEM_PROMPT}

CONTEXTO ACTUAL: ${contexto}

COMANDO DEL USUARIO: "${comando}"

INSTRUCCIONES:
1. Analiza el comando
2. Determina la acción apropiada
3. Responde en formato JSON con esta estructura:
{
  "exito": true/false,
  "mensaje": "respuesta al usuario",
  "accion": "navigate" | "show-data" | "execute-calculation" | "error",
  "parametros": { /* datos relevantes */ }
}

EJEMPLOS:
- "ir a ventas" → {"exito": true, "mensaje": "Abriendo módulo de ventas", "accion": "navigate", "parametros": {"ruta": "/ventas"}}
- "cuánto hay en BM" → {"exito": true, "mensaje": "Capital en BM: $X,XXX", "accion": "show-data", "parametros": {"banco": "BM"}}
- "estado del sistema" → {"exito": true, "mensaje": "Sistema operativo. 7 bancos activos...", "accion": "show-data"}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Intentar parsear como JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          exito: parsed.exito || true,
          mensaje: parsed.mensaje || text,
          data: parsed.parametros,
          accion: parsed.accion || 'show-data',
        };
      }
    } catch {
      // Si no es JSON válido, devolver como texto
    }

    return {
      exito: true,
      mensaje: text,
      accion: 'show-data',
    };
  } catch (error) {
    console.error('Error en Gemini AI:', error);
    return {
      exito: false,
      mensaje: 'Error procesando comando. Intenta reformularlo.',
      accion: 'error',
    };
  }
}

/**
 * Genera explicación de un concepto del sistema
 */
export async function explainConcept(concepto: string): Promise<string> {
  if (!genAI) {
    return 'Servicio de IA no disponible.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
${CHRONOS_SYSTEM_PROMPT}

El usuario pregunta sobre: "${concepto}"

Explica este concepto en el contexto de Chronos OS de forma clara y concisa (máximo 3 párrafos).
Si es una fórmula, incluye un ejemplo numérico.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error explicando concepto:', error);
    return 'Error generando explicación.';
  }
}

/**
 * Analiza datos y genera insights
 */
export async function generateInsight(
  tipo: 'ventas' | 'bancos' | 'clientes',
  datos: unknown
): Promise<string> {
  if (!genAI) {
    return 'Servicio de IA no disponible.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
${CHRONOS_SYSTEM_PROMPT}

Analiza estos datos de ${tipo}:
${JSON.stringify(datos, null, 2)}

Genera un insight breve (2-3 oraciones) con:
1. Observación clave
2. Implicación o recomendación

Se profesional pero directo.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generando insight:', error);
    return 'No se pudo generar análisis en este momento.';
  }
}

/**
 * Detecta intención de comando simple (sin API)
 */
export function detectCommandIntent(comando: string): ChronosCommand {
  const cmd = comando.toLowerCase().trim();

  // Navegación
  if (cmd.match(/\b(ir|navegar|abrir|mostrar)\s+(a\s+)?(dashboard|inicio|home)\b/i)) {
    return {
      comando: 'navigate',
      parametros: { ruta: '/' },
      contexto: 'navegacion',
    };
  }

  if (cmd.match(/\b(ir|navegar|abrir)\s+(a\s+)?ventas?\b/i)) {
    return {
      comando: 'navigate',
      parametros: { ruta: '/ventas' },
      contexto: 'navegacion',
    };
  }

  if (cmd.match(/\b(ir|navegar|abrir)\s+(a\s+)?clientes?\b/i)) {
    return {
      comando: 'navigate',
      parametros: { ruta: '/clientes' },
      contexto: 'navegacion',
    };
  }

  if (cmd.match(/\b(ir|navegar|abrir)\s+(a\s+)?bancos?\b/i)) {
    return {
      comando: 'navigate',
      parametros: { ruta: '/bancos' },
      contexto: 'navegacion',
    };
  }

  // Consultas de datos
  if (cmd.match(/\b(capital|dinero|saldo)\s+(total|disponible)\b/i)) {
    return {
      comando: 'show-capital-total',
      contexto: 'consulta',
    };
  }

  if (cmd.match(/\bventas?\s+(de\s+)?hoy\b/i)) {
    return {
      comando: 'show-ventas-hoy',
      contexto: 'consulta',
    };
  }

  // Default: requiere AI
  return {
    comando: 'ai-process',
    parametros: { query: comando },
    contexto: 'general',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const chronosAI = {
  processCommand,
  explainConcept,
  generateInsight,
  detectCommandIntent,
};

export default chronosAI;
