// Placeholder para inicializador de distribuidores
export const distribuidoresIniciales = [];

export function inicializarDistribuidores() {
  return distribuidoresIniciales;
}

export function inicializarSistemaDistribuidores() {
  return distribuidoresIniciales;
}

export function registrarPagoDistribuidor() {
  return { success: true };
}

export function verificarEstadoDistribuidores() {
  return { estado: 'ok' };
}

export default inicializarDistribuidores;
