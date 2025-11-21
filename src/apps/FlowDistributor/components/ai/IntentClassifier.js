/**
 * 🎯 INTENT CLASSIFIER - Clasificador de Intenciones
 * ==================================================
 *
 * Analiza el mensaje del usuario y determina qué quiere hacer:
 * - NAVIGATE: Ir a otro panel
 * - CREATE_RECORD: Crear un registro
 * - QUERY_DATA: Consultar información
 * - GENERATE_CHART: Crear visualización
 * - EXPORT_REPORT: Exportar reporte
 * - ANALYZE: Análisis de datos
 * - HELP: Ayuda
 * - OTHER: No clasificado
 */

export class IntentClassifier {
  static patterns = {
    NAVIGATE: [
      /(?:ir|navega|ve|muestra|abre|lleva)\s+(?:a|al|a la|hacia)?\s*(dashboard|gya|ventas?|clientes?|distribuidores?|b[oó]vedas?|almac[eé]n|reportes?|analytics?|análisis)/i,
      /quiero\s+ver\s+(?:el|la)?\s*(dashboard|gya|ventas?|clientes?|distribuidores?)/i,
      /panel\s+de\s+(gya|ventas?|clientes?|distribuidores?)/i,
    ],

    CREATE_RECORD: [
      /(?:registra|crea|agrega|añade|ingresa)\s+(?:un|una)?\s*(gasto|ingreso|abono|venta|cliente|orden)/i,
      /nuevo\s+(gasto|ingreso|abono|venta|cliente)/i,
      /quiero\s+(?:registrar|crear|agregar)\s+(un|una)\s+(gasto|ingreso|abono|venta)/i,
      /gast[eé]\s+(\d+)/i,
      /compr[eé]\s+/i,
      /vend[ií]\s+/i,
    ],

    QUERY_DATA: [
      /cu[aá]nto[s]?\s+(clientes?|ventas?|gastos?|ingresos?|distribuidores?)/i,
      /total\s+de\s+(ventas?|gastos?|ingresos?|clientes?)/i,
      /cu[aá]l\s+es\s+(?:el|la)?\s+(total|balance|capital)/i,
      /(?:mostrar|ver|dame)\s+(?:el|la|los|las)?\s+(total|saldo|balance|estad[ií]sticas?)/i,
      /qui[eé]n\s+(debe|adeuda|tiene\s+adeudo)/i,
      /cu[aá]nto\s+(debo|deben|adeudo|adeuda)/i,
    ],

    GENERATE_CHART: [
      /(?:muestra|genera|crea|haz)\s+(?:una?|un)?\s*gr[aá]fic[ao]/i,
      /(?:muestra|genera|crea)\s+(?:una?|un)?\s*visualizaci[oó]n/i,
      /(?:quiero|necesito)\s+ver\s+(?:una?|un)?\s*gr[aá]fic[ao]/i,
      /chart|gráfica|visualización/i,
    ],

    EXPORT_REPORT: [
      /(?:exporta|descarga|genera)\s+(?:un|una)?\s*reporte/i,
      /(?:exporta|descarga)\s+(?:en|a)?\s*(pdf|excel|csv)/i,
      /(?:quiero|necesito)\s+(?:un|una)?\s*reporte/i,
      /dame\s+(?:un|una)?\s*reporte/i,
    ],

    ANALYZE: [
      /analiza|análisis/i,
      /qu[eé]\s+(?:puedes|debes|recomiendas?|sugieres?)/i,
      /c[oó]mo\s+(?:van|están|anda)/i,
      /tendencia/i,
      /predicci[oó]n|predice/i,
      /forecast/i,
    ],

    HELP: [
      /ayuda|help/i,
      /qu[eé]\s+(?:puedes|sabes)\s+hacer/i,
      /c[oó]mo\s+(?:funciona|te\s+uso)/i,
      /comandos?|instrucciones?/i,
    ],
  };

  /**
   * Clasificar la intención del mensaje
   */
  static classify(message, context) {
    const normalizedMessage = message.toLowerCase().trim();

    // Revisar cada patrón
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        const match = normalizedMessage.match(pattern);
        if (match) {
          return {
            type: intent,
            confidence: this.calculateConfidence(normalizedMessage, intent),
            match: match[1] || match[0],
            originalMessage: message,
          };
        }
      }
    }

    // Si no coincide con ningún patrón, usar análisis de keywords
    return this.classifyByKeywords(normalizedMessage, message);
  }

  /**
   * Clasificación por keywords cuando no hay match directo
   */
  static classifyByKeywords(normalizedMessage, originalMessage) {
    const keywords = {
      NAVIGATE: ['panel', 'ir', 've', 'muestra', 'abre'],
      CREATE_RECORD: ['registra', 'crea', 'nuevo', 'agrega', 'añade', 'gasté', 'compré', 'vendí'],
      QUERY_DATA: ['cuánto', 'cuántos', 'total', 'dame', 'cuál', 'quién', 'debe'],
      GENERATE_CHART: ['gráfica', 'visualización', 'chart'],
      EXPORT_REPORT: ['exporta', 'descarga', 'reporte', 'pdf', 'excel'],
      ANALYZE: ['analiza', 'análisis', 'tendencia', 'predicción'],
      HELP: ['ayuda', 'cómo', 'qué puedes'],
    };

    let bestMatch = { intent: 'OTHER', score: 0 };

    for (const [intent, words] of Object.entries(keywords)) {
      let score = 0;
      for (const word of words) {
        if (normalizedMessage.includes(word)) {
          score++;
        }
      }

      if (score > bestMatch.score) {
        bestMatch = { intent, score };
      }
    }

    return {
      type: bestMatch.score > 0 ? bestMatch.intent : 'OTHER',
      confidence: Math.min(bestMatch.score * 0.3, 0.9),
      match: null,
      originalMessage,
    };
  }

  /**
   * Calcular confianza del match
   */
  static calculateConfidence(message, intent) {
    // Confianza basada en longitud y especificidad
    const baseConfidence = 0.7;
    const lengthBonus = Math.min(message.length / 100, 0.2);
    const specificityBonus = intent !== 'OTHER' ? 0.1 : 0;

    return Math.min(baseConfidence + lengthBonus + specificityBonus, 0.99);
  }

  /**
   * Obtener sugerencias según la intención
   */
  static getSuggestions(intent) {
    const suggestions = {
      NAVIGATE: ['Ir al Dashboard', 'Ver panel de ventas', 'Mostrar clientes', 'Abrir GYA'],
      CREATE_RECORD: [
        'Registra un gasto de 5000 para gasolina',
        'Nuevo ingreso de 8000 de venta',
        'Crear un cliente llamado Juan',
      ],
      QUERY_DATA: [
        'Cuántos clientes tengo',
        'Total de ventas del mes',
        'Cuánto deben los distribuidores',
        'Balance de bóveda USA',
      ],
      GENERATE_CHART: [
        'Muestra gráfica de ventas del mes',
        'Genera visualización de gastos',
        'Gráfica de clientes por mes',
      ],
      EXPORT_REPORT: [
        'Exporta reporte de ventas en PDF',
        'Descarga Excel de gastos',
        'Genera reporte mensual',
      ],
      ANALYZE: [
        'Analiza las ventas del trimestre',
        'Qué distribuidor tiene más adeudo',
        'Tendencia de gastos',
      ],
      HELP: ['Qué puedes hacer', 'Cómo funciona', 'Ayuda con reportes'],
      OTHER: ['Ve al panel de ventas', 'Cuántos clientes tengo', 'Registra un gasto de 3000'],
    };

    return suggestions[intent] || suggestions.OTHER;
  }
}
