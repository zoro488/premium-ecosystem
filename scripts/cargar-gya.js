/**
 * Script para cargar 306 registros de Gastos y Abonos (GYA) a Firestore
 * Usa REST API debido a problemas con Firebase Client SDK
 */
import https from 'https';

const PROJECT_ID = 'premium-ecosystem-1760790572';
const DATABASE_ID = '(default)';

// Función para limpiar valores numéricos (remover $, comas)
const limpiarValor = (valor) => {
  if (typeof valor === 'string') {
    return parseFloat(valor.replace(/[$,]/g, '')) || 0;
  }
  return valor || 0;
};

// Función para convertir fecha DD/MM/YYYY a YYYY-MM-DD
const convertirFecha = (fecha) => {
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
};

/**
 * Convierte objeto JavaScript a formato Firestore
 */
function convertirAFirestoreFormat(obj) {
  const fields = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        fields[key] = { integerValue: value.toString() };
      } else {
        fields[key] = { doubleValue: value };
      }
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map((item) => {
            if (typeof item === 'object') {
              return { mapValue: { fields: convertirAFirestoreFormat(item) } };
            }
            return convertirAFirestoreFormat({ temp: item }).temp;
          }),
        },
      };
    } else if (typeof value === 'object') {
      fields[key] = {
        mapValue: { fields: convertirAFirestoreFormat(value) },
      };
    }
  }

  return fields;
}

/**
 * Sube documento a Firestore usando REST API
 */
function subirDocumento(collectionPath, documentId, data) {
  return new Promise((resolve, reject) => {
    const fields = convertirAFirestoreFormat(data);

    const requestBody = JSON.stringify({ fields });

    const path = `/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/${collectionPath}?documentId=${documentId}`;

    const options = {
      hostname: 'firestore.googleapis.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 409) {
          resolve({ success: true, status: res.statusCode });
        } else {
          reject({ success: false, status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    req.write(requestBody);
    req.end();
  });
}

// ===== DATOS GYA (306 registros) =====
// Los datos se cargarán desde la tabla que enviaste
const gastosAbonos = [
  {
    fecha: '23/08/2025',
    origen: 'Valle',
    valor: 189000,
    tc: 0,
    pesos: 0,
    destino: 'Boveda Monte',
    concepto: '',
    observaciones: '',
  },
  {
    fecha: '23/08/2025',
    origen: 'Valle',
    valor: 30000,
    tc: 0,
    pesos: 0,
    destino: 'Flete Sur',
    concepto: '',
    observaciones: '',
  },
  {
    fecha: '25/08/2025',
    origen: 'Lamas',
    valor: 213000,
    tc: 0,
    pesos: 0,
    destino: 'Leftie',
    concepto: 'playa azul#30 (7,100x30)',
    observaciones: 'lamas #30 playa azul',
  },
  {
    fecha: '22/08/2025',
    origen: 'Gasto Bóveda Monte',
    valor: 189000,
    tc: 0,
    pesos: 0,
    destino: 'Profit',
    concepto: '',
    observaciones: 'corporativo-boveda valle',
  },
  {
    fecha: '22/08/2025',
    origen: 'Gasto Bóveda Monte',
    valor: 136000,
    tc: 0,
    pesos: 0,
    destino: 'Profit',
    concepto: '',
    observaciones: 'corporativo-boveda valle',
  },
  {
    fecha: '25/08/2025',
    origen: 'Gasto Bóveda Monte',
    valor: 350000,
    tc: 0,
    pesos: 0,
    destino: 'Profit',
    concepto: '',
    observaciones: 'corporativo-boveda valle',
  },
  {
    fecha: '25/08/2025',
    origen: 'Gasto Bóveda Monte',
    valor: 50000,
    tc: 0,
    pesos: 0,
    destino: 'Profit',
    concepto: '',
    observaciones: 'corporativo-boveda valle',
  },
  {
    fecha: '18/08/2025',
    origen: 'NA',
    valor: 65919,
    tc: 0,
    pesos: 0,
    destino: 'Bóveda USA',
    concepto: '',
    observaciones: '',
  },
  {
    fecha: '23/08/2025',
    origen: 'NA',
    valor: 216400,
    tc: 0,
    pesos: 0,
    destino: 'Bóveda USA',
    concepto: '',
    observaciones: 'Gordito planta H-GabyR3',
  },
  {
    fecha: '25/08/2025',
    origen: 'NA',
    valor: 10000,
    tc: 0,
    pesos: 0,
    destino: 'Bóveda USA',
    concepto: '',
    observaciones: 'apoyo sierra alpha valle',
  },
  {
    fecha: '20/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 8800,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: '',
    observaciones: 'inge adelanto guate#488',
  },
  {
    fecha: '23/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 6490,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'pago gaby R3',
    observaciones: 'popel gordito planta h 216,400 x %3',
  },
  {
    fecha: '24/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 28000,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'pago flete a/x#35',
    observaciones: 'arabe mc-planta',
  },
  {
    fecha: '24/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 22400,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'pago flete a/x#32',
    observaciones: 'chavis mc-planta',
  },
  {
    fecha: '18/08/2025',
    origen: 'Gasto Utilidades',
    valor: 5000,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'caja mex',
    observaciones: '',
  },
  {
    fecha: '18/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 2724,
    tc: 18.35,
    pesos: 49985.4,
    destino: 'NA',
    concepto: 'gasto franco werito',
    observaciones: '',
  },
  {
    fecha: '18/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 136,
    tc: 18.35,
    pesos: 2495.6,
    destino: 'NA',
    concepto: 'gasolina brayan',
    observaciones: '',
  },
  {
    fecha: '18/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 321,
    tc: 18.35,
    pesos: 5890.35,
    destino: 'NA',
    concepto: 'servicio nissan frontier',
    observaciones: '',
  },
  {
    fecha: '18/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 215,
    tc: 18.35,
    pesos: 3945.25,
    destino: 'NA',
    concepto: 'renta equipo corte',
    observaciones: '',
  },
  {
    fecha: '18/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 126,
    tc: 18.35,
    pesos: 2312.1,
    destino: 'NA',
    concepto: 'cfe gaviota',
    observaciones: '',
  },
  {
    fecha: '18/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 299,
    tc: 18.35,
    pesos: 5486.65,
    destino: 'NA',
    concepto: 'placas veracruz',
    observaciones: '',
  },
  {
    fecha: '18/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 948,
    tc: 18.35,
    pesos: 17395.8,
    destino: 'NA',
    concepto: 'bateria camion werito',
    observaciones: '',
  },
  {
    fecha: '20/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 1089,
    tc: 18.35,
    pesos: 19983.15,
    destino: 'NA',
    concepto: 'celular werito',
    observaciones: '',
  },
  {
    fecha: '20/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 13400,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'fierros chavis',
    observaciones: '',
  },
  {
    fecha: '22/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 819,
    tc: 18.3,
    pesos: 14987.7,
    destino: 'NA',
    concepto: 'equipos gallos',
    observaciones: '',
  },
  {
    fecha: '22/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 273,
    tc: 18.3,
    pesos: 4995.9,
    destino: 'NA',
    concepto: 'gastos franco',
    observaciones: '',
  },
  {
    fecha: '23/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 16052,
    tc: 19.0,
    pesos: 304988.0,
    destino: 'NA',
    concepto: 'gastos flete#423 gaviota',
    observaciones: '',
  },
  {
    fecha: '23/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 25000,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'brinco salsa,jaiba#423',
    observaciones: '',
  },
  {
    fecha: '23/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 1089,
    tc: 18.3,
    pesos: 19928.7,
    destino: 'NA',
    concepto: 'gastos jr',
    observaciones: '',
  },
  {
    fecha: '26/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 36500,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'pago inge guate #488',
    observaciones: '',
  },
  {
    fecha: '25/08/2025',
    origen: 'Gasto Utilidades',
    valor: 10000,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'caja mex',
    observaciones: '',
  },
  {
    fecha: '25/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 874,
    tc: 18.3,
    pesos: 15994.2,
    destino: 'NA',
    concepto: 'factura playa azul #50',
    observaciones: '',
  },
  {
    fecha: '25/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 437,
    tc: 18.3,
    pesos: 7997.1,
    destino: 'NA',
    concepto: 'pago fito (werito)',
    observaciones: '',
  },
  {
    fecha: '25/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 136,
    tc: 18.3,
    pesos: 2488.8,
    destino: 'NA',
    concepto: 'gasolina brayan',
    observaciones: '',
  },
  {
    fecha: '26/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 49000,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'pago mp (7x7,000 venta local lamas)',
    observaciones: '',
  },
  {
    fecha: '26/08/2025',
    origen: 'Gasto Bóveda Monte',
    valor: 400000,
    tc: 0,
    pesos: 0,
    destino: 'Profit',
    concepto: 'corporativo-boveda valle',
    observaciones: '',
  },
  {
    fecha: '26/08/2025',
    origen: 'Lamas',
    valor: 280000,
    tc: 0,
    pesos: 0,
    destino: 'Leftie',
    concepto: 'monte (7,000x40)',
    observaciones: 'lamas #40 monte',
  },
  {
    fecha: '26/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 2000,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'pago carlos playa azul#50 (wero b, lamas)',
    observaciones: '',
  },
  {
    fecha: '26/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 382,
    tc: 18.3,
    pesos: 6990.6,
    destino: 'NA',
    concepto: 'material pistones (werito)',
    observaciones: '',
  },
  {
    fecha: '28/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 3835,
    tc: 18.3,
    pesos: 70180.5,
    destino: 'NA',
    concepto: 'pago vuelta playa azul#50',
    observaciones: '',
  },
  {
    fecha: '28/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 81,
    tc: 18.3,
    pesos: 1482.3,
    destino: 'NA',
    concepto: 'gastos franco (werito)',
    observaciones: '',
  },
  {
    fecha: '28/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 1366,
    tc: 18.3,
    pesos: 24997.8,
    destino: 'NA',
    concepto: 'cel jr (werito)',
    observaciones: '',
  },
  {
    fecha: '28/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 273,
    tc: 18.3,
    pesos: 4995.9,
    destino: 'NA',
    concepto: '2 cuentas radio (werito)',
    observaciones: '',
  },
  {
    fecha: '29/08/2025',
    origen: 'Robalo',
    valor: 198000,
    tc: 0,
    pesos: 0,
    destino: 'Boveda Monte',
    concepto: 'robalo #30 gaviota',
    observaciones: '',
  },
  {
    fecha: '29/08/2025',
    origen: 'Gasto Bóveda Monte',
    valor: 198000,
    tc: 0,
    pesos: 0,
    destino: 'Profit',
    concepto: 'corporativo-boveda valle',
    observaciones: '',
  },
  {
    fecha: '29/08/2025',
    origen: 'Gasto Leftie',
    valor: 650000,
    tc: 0,
    pesos: 0,
    destino: 'Bóveda USA',
    concepto: 'monte F20792585K',
    observaciones: '',
  },
  {
    fecha: '30/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 43200,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'pago chucho flete#48 silla-mc chavis',
    observaciones: '',
  },
  {
    fecha: '30/08/2025',
    origen: 'Gasto Bóveda Usa',
    valor: 43200,
    tc: 0,
    pesos: 0,
    destino: 'NA',
    concepto: 'pago chucho flete#48 silla-mc jr',
    observaciones: '',
  },
  {
    fecha: '30/08/2025',
    origen: 'Gasto Azteca',
    valor: 1500,
    tc: 0,
    pesos: 0,
    destino: 'Bóveda USA',
    concepto: 'prestamo sra karla-a/x playa azul',
    observaciones: '',
  },
  {
    fecha: '30/08/2025',
    origen: 'Gasto Flete Sur',
    valor: 2465,
    tc: 18.25,
    pesos: 44986.25,
    destino: 'NA',
    concepto: 'deposito material pistones (werito)',
    observaciones: '',
  },
  // Continuaré con el resto de registros en siguiente llamada debido al límite de caracteres
];

/**
 * Main
 */
async function main() {
  console.log('🚀 Iniciando carga de Gastos y Abonos...\n');
  console.log(`📊 Total de registros a procesar: ${gastosAbonos.length}\n`);

  let gyaExitosos = 0;
  let gyaError = 0;

  for (let i = 0; i < gastosAbonos.length; i++) {
    const gya = gastosAbonos[i];
    const id = `GYA${String(i + 1).padStart(4, '0')}`;

    // Convertir fecha y limpiar valores
    const documento = {
      id: id,
      fecha: convertirFecha(gya.fecha),
      origen: gya.origen || '',
      valor: gya.valor,
      tc: gya.tc,
      pesos: gya.pesos,
      destino: gya.destino || '',
      concepto: gya.concepto || '',
      observaciones: gya.observaciones || '',
    };

    try {
      await subirDocumento('gastos_abonos', id, documento);
      gyaExitosos++;

      if (gyaExitosos % 20 === 0) {
        console.log(`✅ Procesados ${gyaExitosos}/${gastosAbonos.length}...`);
      }
    } catch (error) {
      if (error.status === 409) {
        gyaExitosos++;
      } else {
        gyaError++;
        console.error(`❌ Error en registro ${id}: ${error.error || error.data}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DE CARGA GYA');
  console.log('='.repeat(60));
  console.log(`✅ Registros exitosos: ${gyaExitosos}/${gastosAbonos.length}`);
  console.log(`❌ Registros con error: ${gyaError}`);
  console.log('='.repeat(60));

  console.log('\n🎉 Proceso completado!');
}

main().catch(console.error);
