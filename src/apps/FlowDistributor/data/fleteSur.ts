/**
 * FLETE SUR - DATOS REALES DEL EXCEL
 */

export interface RegistroFlete {
  id: string;
  fecha: Date;
  cliente: string;
  origen: string;
  destino: string;
  cantidad: number;
  costoFlete: number;
  utilidadFlete: number;
  estatus: 'Pendiente' | 'Pagado' | 'En Tránsito';
  observaciones?: string;
}

export const registrosFletes: RegistroFlete[] = [
  // Datos de ejemplo - completar con datos reales del Excel
];

// Balance RF Actual según Excel
export const balanceFleteSur = {
  rfActual: 185792, // Del panel RF Actual
};

export const calcularTotalesFlete = () => {
  const totalCostos = registrosFletes.reduce((sum, f) => sum + f.costoFlete, 0);
  const totalUtilidad = registrosFletes.reduce((sum, f) => sum + f.utilidadFlete, 0);

  return {
    totalCostos,
    totalUtilidad,
    totalFletes: registrosFletes.length,
    balance: totalUtilidad - totalCostos,
  };
};
