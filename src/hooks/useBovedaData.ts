import { useState, useEffect, useMemo } from 'react';
import DATOS_BOVEDAS from '@/data/datos_bovedas_completos.json';

interface Movimiento {
  id: string;
  fecha: string | Date;
  concepto: string;
  monto: number;
  categoria?: string;
  referencia?: string;
  usuario?: string;
  [key: string]: any;
}

interface Transferencia {
  id: string;
  fecha: string | Date;
  origenBoveda: string;
  destinoBoveda: string;
  concepto: string;
  montoUSD: number;
  tc?: number;
  montoMXN?: number;
  estado: 'completada' | 'pendiente' | 'cancelada';
  referencia?: string;
  usuario?: string;
}

interface Corte {
  id: string;
  fecha: string | Date;
  rfAnterior: number;
  totalIngresos: number;
  totalGastos: number;
  rfActual: number;
  usuario: string;
  notas?: string;
  alertas?: string[];
  [key: string]: any;
}

interface BovedaData {
  id: string;
  nombre: string;
  saldoActual: number;
  moneda: string;
  tipo?: string;
  ingresos: Movimiento[];
  gastos: Movimiento[];
  cortes: Corte[];
  transferencias: Transferencia[];
}

interface UseBovedaDataReturn {
  boveda: BovedaData | null;
  ingresos: Movimiento[];
  gastos: Movimiento[];
  cortes: Corte[];
  transferencias: Transferencia[];
  transferenciasEntrada: Transferencia[];
  transferenciasSalida: Transferencia[];
  loading: boolean;
  error: string | null;
  stats: {
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    saldoActual: number;
    numIngresos: number;
    numGastos: number;
    numTransferencias: number;
    rfActual: number;
    ultimoCorte: Corte | null;
  };
  refetch: () => void;
}

/**
 * Hook para cargar y gestionar datos completos de bóvedas
 * Incluye ingresos, gastos, cortes y transferencias
 *
 * @param bovedaId - ID de la bóveda a cargar
 * @returns Datos completos de la bóveda con stats calculados
 */
export const useBovedaData = (bovedaId: string): UseBovedaDataReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Cargar datos de la bóveda
  const boveda = useMemo<BovedaData | null>(() => {
    try {
      const data = DATOS_BOVEDAS[bovedaId as keyof typeof DATOS_BOVEDAS];
      if (!data) {
        setError(`Bóveda "${bovedaId}" no encontrada`);
        return null;
      }
      setError(null);
      return data as BovedaData;
    } catch (err) {
      setError(`Error al cargar datos: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [bovedaId, refreshKey]);

  // Extraer arrays de movimientos
  const ingresos = useMemo(() => boveda?.ingresos || [], [boveda]);
  const gastos = useMemo(() => boveda?.gastos || [], [boveda]);
  const cortes = useMemo(() => boveda?.cortes || [], [boveda]);
  const transferencias = useMemo(() => boveda?.transferencias || [], [boveda]);

  // Filtrar transferencias por dirección
  const transferenciasEntrada = useMemo(
    () => transferencias.filter(t => t.destinoBoveda === bovedaId),
    [transferencias, bovedaId]
  );

  const transferenciasSalida = useMemo(
    () => transferencias.filter(t => t.origenBoveda === bovedaId),
    [transferencias, bovedaId]
  );

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalIngresos = ingresos.reduce((sum, ing) => sum + ing.monto, 0);
    const totalGastos = gastos.reduce((sum, gast) => sum + gast.monto, 0);
    const balance = totalIngresos - totalGastos;

    const ultimoCorte = cortes.length > 0
      ? cortes.reduce((latest, corte) =>
          new Date(corte.fecha) > new Date(latest.fecha) ? corte : latest
        )
      : null;

    return {
      totalIngresos,
      totalGastos,
      balance,
      saldoActual: boveda?.saldoActual || 0,
      numIngresos: ingresos.length,
      numGastos: gastos.length,
      numTransferencias: transferencias.length,
      rfActual: ultimoCorte?.rfActual || boveda?.saldoActual || 0,
      ultimoCorte,
    };
  }, [ingresos, gastos, cortes, transferencias, boveda]);

  // Función para refrescar datos
  const refetch = () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    setLoading(true);
    // Simular carga async
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [bovedaId, refreshKey]);

  return {
    boveda,
    ingresos,
    gastos,
    cortes,
    transferencias,
    transferenciasEntrada,
    transferenciasSalida,
    loading,
    error,
    stats,
    refetch,
  };
};

/**
 * Hook para obtener todas las bóvedas
 */
export const useAllBovedas = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bovedas = useMemo(() => {
    try {
      setError(null);
      return Object.values(DATOS_BOVEDAS) as BovedaData[];
    } catch (err) {
      setError(`Error al cargar bóvedas: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const totalSistema = useMemo(() => {
    return bovedas.reduce((sum, b) => sum + b.saldoActual, 0);
  }, [bovedas]);

  return {
    bovedas,
    totalSistema,
    loading,
    error,
  };
};

/**
 * Hook para obtener transferencias entre dos bóvedas específicas
 */
export const useTransferenciasBetween = (
  bovedaOrigenId: string,
  bovedaDestinoId: string
) => {
  const { boveda: bovedaOrigen } = useBovedaData(bovedaOrigenId);
  const { boveda: bovedaDestino } = useBovedaData(bovedaDestinoId);

  const transferencias = useMemo(() => {
    if (!bovedaOrigen || !bovedaDestino) return [];

    const allTransferencias = [
      ...bovedaOrigen.transferencias,
      ...bovedaDestino.transferencias,
    ];

    // Eliminar duplicados por ID
    const uniqueMap = new Map<string, Transferencia>();
    allTransferencias.forEach(t => {
      if (
        (t.origenBoveda === bovedaOrigenId && t.destinoBoveda === bovedaDestinoId) ||
        (t.origenBoveda === bovedaDestinoId && t.destinoBoveda === bovedaOrigenId)
      ) {
        uniqueMap.set(t.id, t);
      }
    });

    return Array.from(uniqueMap.values());
  }, [bovedaOrigen, bovedaDestino, bovedaOrigenId, bovedaDestinoId]);

  return {
    transferencias,
    count: transferencias.length,
  };
};

/**
 * Hook para obtener movimientos recientes de una bóveda
 */
export const useMovimientosRecientes = (
  bovedaId: string,
  limit: number = 10
) => {
  const { ingresos, gastos, transferencias } = useBovedaData(bovedaId);

  const movimientosRecientes = useMemo(() => {
    const allMovimientos = [
      ...ingresos.map(m => ({ ...m, tipo: 'ingreso' as const })),
      ...gastos.map(m => ({ ...m, tipo: 'gasto' as const })),
      ...transferencias.map(m => ({
        ...m,
        tipo: 'transferencia' as const,
        monto: m.montoUSD
      })),
    ];

    return allMovimientos
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, limit);
  }, [ingresos, gastos, transferencias, limit]);

  return movimientosRecientes;
};

export default useBovedaData;
