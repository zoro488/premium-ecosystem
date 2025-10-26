/**
 * 🔄 DATA INITIALIZER
 * Sistema de inicialización automática de datos del Excel
 */

/**
 * Inicializa todos los datos si están vacíos
 * Lee el archivo excel_data.json y carga los datos en el sistema
 * @param {Function} setClientes - Función para actualizar clientes
 * @param {Function} setDistribuidores - Función para actualizar distribuidores
 * @param {Function} setVentas - Función para actualizar ventas
 * @param {Function} setAlmacen - Función para actualizar almacén
 * @param {Function} setBanco - Función para actualizar banco
 * @returns {Promise<Object>} Resultado de la inicialización
 */
export const inicializarTodosSiVacio = async (
  setClientes,
  setDistribuidores,
  setVentas,
  setAlmacen,
  setBanco
) => {
  try {
    // Verificar si ya hay datos cargados en localStorage
    const datosGuardados = localStorage.getItem('flowDistributor_initialized');

    if (datosGuardados) {
      console.log('✅ Datos ya inicializados previamente');
      return {
        success: true,
        mensaje: 'Datos ya inicializados',
        yaInicializado: true,
      };
    }

    // Intentar cargar el archivo excel_data.json desde public
    const response = await fetch('/excel_data.json');

    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo excel_data.json');
    }

    const datosExcel = await response.json();

    // Inicializar clientes
    if (datosExcel.clientes && Array.isArray(datosExcel.clientes)) {
      setClientes(datosExcel.clientes);
      console.log(`✅ ${datosExcel.clientes.length} clientes cargados`);
    }

    // Inicializar distribuidores
    if (datosExcel.distribuidores && Array.isArray(datosExcel.distribuidores)) {
      setDistribuidores(datosExcel.distribuidores);
      console.log(
        `✅ ${datosExcel.distribuidores.length} distribuidores cargados`
      );
    }

    // Inicializar ventas
    if (datosExcel.ventas && Array.isArray(datosExcel.ventas)) {
      setVentas(datosExcel.ventas);
      console.log(`✅ ${datosExcel.ventas.length} ventas cargadas`);
    }

    // Inicializar almacén
    if (datosExcel.almacen && Array.isArray(datosExcel.almacen)) {
      setAlmacen(datosExcel.almacen);
      console.log(`✅ ${datosExcel.almacen.length} productos en almacén`);
    }

    // Inicializar datos bancarios
    if (datosExcel.banco) {
      setBanco(datosExcel.banco);
      console.log('✅ Datos bancarios cargados');
    }

    // Marcar como inicializado
    localStorage.setItem('flowDistributor_initialized', 'true');
    localStorage.setItem(
      'flowDistributor_initDate',
      new Date().toISOString()
    );

    return {
      success: true,
      mensaje: 'Datos inicializados correctamente desde Excel',
      clientes: datosExcel.clientes?.length || 0,
      distribuidores: datosExcel.distribuidores?.length || 0,
      ventas: datosExcel.ventas?.length || 0,
      almacen: datosExcel.almacen?.length || 0,
    };
  } catch (error) {
    console.error('❌ Error al inicializar datos:', error);
    return {
      success: false,
      error: error.message,
      mensaje: 'Error al inicializar datos desde Excel',
    };
  }
};

/**
 * Reinicia la bandera de inicialización
 * Útil para forzar una nueva carga de datos
 */
export const reiniciarInicializacion = () => {
  localStorage.removeItem('flowDistributor_initialized');
  localStorage.removeItem('flowDistributor_initDate');
  console.log('✅ Bandera de inicialización reiniciada');
};

/**
 * Verifica si los datos ya fueron inicializados
 * @returns {boolean} true si ya están inicializados
 */
export const datosYaInicializados = () => {
  return localStorage.getItem('flowDistributor_initialized') === 'true';
};

/**
 * Obtiene la fecha de la última inicialización
 * @returns {string|null} Fecha ISO de inicialización o null
 */
export const obtenerFechaInicializacion = () => {
  return localStorage.getItem('flowDistributor_initDate');
};

export default {
  inicializarTodosSiVacio,
  reiniciarInicializacion,
  datosYaInicializados,
  obtenerFechaInicializacion,
};
