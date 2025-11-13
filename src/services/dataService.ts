/**
 * 🗄️ DATA SERVICE
 *
 * Servicio centralizado para carga de datos con:
 * - Fetch dinámico de JSON (evita problemas de import estático)
 * - Caché en memoria para performance
 * - Fallbacks y manejo de errores robusto
 * - TypeScript types completos
 *
 * @author Premium Ecosystem
 * @version 1.0.0
 */

// ==================== TYPES ====================

interface Metadata {
  fechaExtraccion: string;
  version: string;
  fuente: string;
  descripcion: string;
}

interface RFActual {
  totalSistema: number;
  paneles: Record<string, number>;
}

interface ControlMaestro {
  rfActual: RFActual;
  ventas: any[];
  gya: any[];
}

interface RegistroIngreso {
  OC: string;
  Cliente: string;
  Distribuidor: string;
  Cantidad: number;
}

interface RegistroSalida {
  Fecha: string;
  Cliente: string;
  Cantidad: number;
  Concepto: string;
  Observaciones: string;
}

interface Panel {
  panel: string;
  tipoPanel: string;
  ingresos: {
    total: number;
    registros: RegistroIngreso[];
    cantidad: number;
  };
  salidas: {
    total: number;
    registros: RegistroSalida[];
    cantidad: number;
    nombreSeccion?: string;
  };
  rfActual?: {
    total: number;
  };
}

export interface DatosCompletos {
  metadata: Metadata;
  controlMaestro: ControlMaestro;
  paneles: Panel[];
}

// ==================== CACHE ====================

class DataCache {
  private static instance: DataCache;
  private cache: DatosCompletos | null = null;
  private loading: Promise<DatosCompletos> | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  private constructor() {}

  static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }

  async get(): Promise<DatosCompletos> {
    const now = Date.now();

    // Si hay datos en caché y no han expirado
    if (this.cache && now - this.lastFetch < this.CACHE_DURATION) {
      return this.cache;
    }

    // Si ya hay una carga en progreso, esperar
    if (this.loading) {
      return this.loading;
    }

    // Iniciar nueva carga
    this.loading = this.fetchData();

    try {
      const data = await this.loading;
      this.cache = data;
      this.lastFetch = now;
      return data;
    } finally {
      this.loading = null;
    }
  }

  private async fetchData(): Promise<DatosCompletos> {
    try {
      // SOLO fetch desde public/ - sin dynamic import que cause conflictos
      const response = await fetch('/datos_bovedas_completos.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Validar estructura básica
      if (!data.controlMaestro || !data.paneles) {
        throw new Error('Invalid data structure');
      }

      return data as DatosCompletos;
    } catch (error) {
      console.error('❌ Error fetching data from public/:', error);

      // Si falla, retornar datos de fallback
      // NO usar dynamic import para evitar conflictos de bundling
      return this.getFallbackData();
    }
  }

  private getFallbackData(): DatosCompletos {
    return {
      metadata: {
        fechaExtraccion: new Date().toISOString(),
        version: '1.0.0',
        fuente: 'Fallback',
        descripcion: 'Datos de respaldo',
      },
      controlMaestro: {
        rfActual: {
          totalSistema: 0,
          paneles: {},
        },
        ventas: [],
        gya: [],
      },
      paneles: [],
    };
  }

  clear(): void {
    this.cache = null;
    this.lastFetch = 0;
  }
}

// ==================== API PÚBLICA ====================

/**
 * Obtiene los datos completos del sistema
 */
export async function getDatosCompletos(): Promise<DatosCompletos> {
  const cache = DataCache.getInstance();
  return cache.get();
}

/**
 * Obtiene el RF Actual del sistema
 */
export async function getRFActual(): Promise<RFActual> {
  const datos = await getDatosCompletos();
  return datos.controlMaestro.rfActual;
}

/**
 * Obtiene un panel específico por nombre
 */
export async function getPanel(nombre: string): Promise<Panel | undefined> {
  const datos = await getDatosCompletos();
  return datos.paneles.find(
    (p) => p.panel === nombre || p.panel.toLowerCase().includes(nombre.toLowerCase())
  );
}

/**
 * Obtiene todos los paneles de un tipo específico
 */
export async function getPanelesByTipo(tipo: string): Promise<Panel[]> {
  const datos = await getDatosCompletos();
  return datos.paneles.filter((p) => p.tipoPanel === tipo);
}

/**
 * Obtiene el panel de Almacén
 */
export async function getPanelAlmacen(): Promise<Panel | undefined> {
  const datos = await getDatosCompletos();
  return datos.paneles.find(
    (p) => p.tipoPanel === 'almacen' || p.panel.toLowerCase().includes('almac')
  );
}

/**
 * Obtiene el panel de Utilidades
 */
export async function getPanelUtilidades(): Promise<Panel | undefined> {
  const datos = await getDatosCompletos();
  return datos.paneles.find((p) => p.panel === 'Utilidades');
}

/**
 * Limpia la caché (útil para testing o refresh manual)
 */
export function clearCache(): void {
  DataCache.getInstance().clear();
}
