/**
 * 📊 ENTITY EXTRACTOR - Extractor de Entidades
 * ============================================
 *
 * Extrae información estructurada del mensaje:
 * - Números/Cantidades
 * - Fechas
 * - Nombres (clientes, productos, destinos)
 * - Tipos (gasto, ingreso, venta)
 * - Paneles/Destinos
 */

export class EntityExtractor {
  /**
   * Extraer entidades según el tipo de intención
   */
  static extract(message, intentType) {
    const entities = {
      originalMessage: message,
      extractedAt: new Date().toISOString(),
    };

    // Extraer según intención
    switch (intentType) {
      case 'NAVIGATE':
        entities.panel = this.extractPanel(message);
        break;

      case 'CREATE_RECORD':
        entities.recordType = this.extractRecordType(message);
        entities.amount = this.extractAmount(message);
        entities.concept = this.extractConcept(message);
        entities.destination = this.extractDestination(message);
        entities.date = this.extractDate(message);
        break;

      case 'QUERY_DATA':
        entities.queryType = this.extractQueryType(message);
        entities.entity = this.extractEntityType(message);
        entities.timeRange = this.extractTimeRange(message);
        break;

      case 'GENERATE_CHART':
        entities.chartType = this.extractChartType(message);
        entities.dataSource = this.extractEntityType(message);
        entities.timeRange = this.extractTimeRange(message);
        entities.groupBy = this.extractGroupBy(message);
        break;

      case 'EXPORT_REPORT':
        entities.reportType = this.extractEntityType(message);
        entities.format = this.extractExportFormat(message);
        entities.timeRange = this.extractTimeRange(message);
        break;

      case 'ANALYZE':
        entities.analysisType = this.extractAnalysisType(message);
        entities.entity = this.extractEntityType(message);
        entities.timeRange = this.extractTimeRange(message);
        break;
    }

    return entities;
  }

  /**
   * Extraer panel/destino de navegación
   */
  static extractPanel(message) {
    const panels = {
      dashboard: ['dashboard', 'inicio', 'principal'],
      GYA: ['gya', 'gastos', 'abonos', 'gastos y abonos'],
      ventas: ['ventas', 'venta', 'vender'],
      clientes: ['clientes', 'cliente'],
      distribuidores: ['distribuidores', 'distribuidor', 'proveedor', 'proveedores'],
      'bóveda usa': ['boveda usa', 'bóveda usa', 'usa', 'estados unidos'],
      'bóveda monte': ['boveda monte', 'bóveda monte', 'monte', 'monterrey'],
      almacén: ['almacen', 'almacén', 'inventario'],
      reportes: ['reportes', 'reporte'],
      analytics: ['analytics', 'análisis', 'analítica'],
    };

    const normalized = message.toLowerCase();

    for (const [panel, keywords] of Object.entries(panels)) {
      for (const keyword of keywords) {
        if (normalized.includes(keyword)) {
          return panel;
        }
      }
    }

    return null;
  }

  /**
   * Extraer tipo de registro
   */
  static extractRecordType(message) {
    const normalized = message.toLowerCase();

    if (/ingreso|cobr[oé]|recib[ií]|entr[oó]/.test(normalized)) {
      return 'ingreso';
    }
    if (/abono|pag[oué]|abon[oé]/.test(normalized)) {
      return 'abono';
    }
    if (/gasto|compr[eé]|gast[eé]|compra/.test(normalized)) {
      return 'gasto';
    }
    if (/venta|vend[ií]/.test(normalized)) {
      return 'venta';
    }

    return 'gasto'; // default
  }

  /**
   * Extraer cantidad/monto
   */
  static extractAmount(message) {
    // Buscar números con formato común
    const patterns = [
      /\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/, // $1,000.00 o 1000.00
      /(\d+)\s*(?:pesos|dolares|usd|mxn)/i, // 1000 pesos
      /(?:de|por)\s+(\d+)/i, // de 5000
      /(\d+)\s+(?:para|por)/i, // 5000 para
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return parseFloat(amount);
      }
    }

    return null;
  }

  /**
   * Extraer concepto
   */
  static extractConcept(message) {
    // Buscar después de "para", "de", "por"
    const patterns = [
      /para\s+([^\d,.]+?)(?:\s+de|\s+por|$)/i,
      /de\s+([^\d,.]+?)(?:\s+de|\s+por|$)/i,
      /concepto[:\s]+([^\d,.]+?)(?:\s+de|\s+por|$)/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // Buscar palabras clave comunes
    const keywords = ['gasolina', 'renta', 'luz', 'agua', 'nómina', 'compra', 'venta', 'pago'];
    const normalized = message.toLowerCase();

    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }

    return null;
  }

  /**
   * Extraer destino
   */
  static extractDestination(message) {
    const normalized = message.toLowerCase();

    // Destinos comunes
    const destinos = [
      'gya',
      'pacman',
      'q-maya',
      'valle-monte',
      'monte',
      'usa',
      'almacén',
      'bodega',
      'tienda',
      'oficina',
      'personal',
    ];

    for (const destino of destinos) {
      if (normalized.includes(destino)) {
        return destino.toUpperCase();
      }
    }

    return null;
  }

  /**
   * Extraer fecha
   */
  static extractDate(message) {
    const normalized = message.toLowerCase();

    // Fechas relativas
    if (/hoy|ahorita/.test(normalized)) {
      return new Date();
    }
    if (/ayer/.test(normalized)) {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date;
    }
    if (/ma[ñn]ana/.test(normalized)) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    }

    // Formato DD/MM/YYYY o DD-MM-YYYY
    const datePattern = /(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/;
    const match = message.match(datePattern);
    if (match) {
      const [, day, month, year] = match;
      return new Date(`${year}-${month}-${day}`);
    }

    return new Date(); // default: hoy
  }

  /**
   * Extraer tipo de query
   */
  static extractQueryType(message) {
    const normalized = message.toLowerCase();

    if (/cu[aá]nto[s]?|total|suma|cantidad/.test(normalized)) {
      if (/cu[aá]ntos/.test(normalized)) {
        return 'COUNT';
      }
      return 'SUM';
    }
    if (/qui[eé]n|cual|top|mayor|menor/.test(normalized)) {
      return 'FIND';
    }
    if (/promedio|media/.test(normalized)) {
      return 'AVG';
    }

    return 'GENERAL';
  }

  /**
   * Extraer tipo de entidad
   */
  static extractEntityType(message) {
    const normalized = message.toLowerCase();

    if (/cliente[s]?/.test(normalized)) return 'clientes';
    if (/venta[s]?/.test(normalized)) return 'ventas';
    if (/gasto[s]?|gya/.test(normalized)) return 'gya';
    if (/ingreso[s]?/.test(normalized)) return 'ingresos';
    if (/distribuidor[es]?|proveedor[es]?/.test(normalized)) return 'distribuidores';
    if (/producto[s]?|inventario/.test(normalized)) return 'productos';
    if (/orden[es]?/.test(normalized)) return 'ordenes';

    return 'general';
  }

  /**
   * Extraer rango de tiempo
   */
  static extractTimeRange(message) {
    const normalized = message.toLowerCase();

    if (/hoy|día/.test(normalized)) return 'today';
    if (/ayer/.test(normalized)) return 'yesterday';
    if (/esta\s+semana|semana/.test(normalized)) return 'this_week';
    if (/este\s+mes|mes(?!\s+pasado)/.test(normalized)) return 'this_month';
    if (/mes\s+pasado|último\s+mes/.test(normalized)) return 'last_month';
    if (/este\s+año|año/.test(normalized)) return 'this_year';
    if (/trimestre/.test(normalized)) return 'quarter';
    if (/últimos?\s+(\d+)\s+días?/.test(normalized)) {
      const match = normalized.match(/últimos?\s+(\d+)\s+días?/);
      return `last_${match[1]}_days`;
    }

    return 'all_time';
  }

  /**
   * Extraer tipo de gráfica
   */
  static extractChartType(message) {
    const normalized = message.toLowerCase();

    if (/barras?|bar/.test(normalized)) return 'bar';
    if (/l[ií]nea[s]?|line/.test(normalized)) return 'line';
    if (/pie|pastel|circular/.test(normalized)) return 'pie';
    if (/área|area/.test(normalized)) return 'area';
    if (/scatter|dispersi[oó]n/.test(normalized)) return 'scatter';

    return 'bar'; // default
  }

  /**
   * Extraer agrupación
   */
  static extractGroupBy(message) {
    const normalized = message.toLowerCase();

    if (/d[ií]a|diario/.test(normalized)) return 'day';
    if (/semana|semanal/.test(normalized)) return 'week';
    if (/mes|mensual/.test(normalized)) return 'month';
    if (/año|anual/.test(normalized)) return 'year';
    if (/cliente/.test(normalized)) return 'cliente';
    if (/producto/.test(normalized)) return 'producto';
    if (/distribuidor/.test(normalized)) return 'distribuidor';

    return 'month'; // default
  }

  /**
   * Extraer formato de exportación
   */
  static extractExportFormat(message) {
    const normalized = message.toLowerCase();

    if (/pdf/.test(normalized)) return 'pdf';
    if (/excel|xlsx|xls/.test(normalized)) return 'excel';
    if (/csv/.test(normalized)) return 'csv';
    if (/json/.test(normalized)) return 'json';

    return 'pdf'; // default
  }

  /**
   * Extraer tipo de análisis
   */
  static extractAnalysisType(message) {
    const normalized = message.toLowerCase();

    if (/tendencia|trend/.test(normalized)) return 'trend';
    if (/predicci[oó]n|forecast/.test(normalized)) return 'forecast';
    if (/comparaci[oó]n|compar/.test(normalized)) return 'comparison';
    if (/top|mejores?|peores?/.test(normalized)) return 'ranking';
    if (/distribuci[oó]n/.test(normalized)) return 'distribution';

    return 'general';
  }
}
