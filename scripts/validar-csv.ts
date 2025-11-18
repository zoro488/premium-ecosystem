/**
 * ═══════════════════════════════════════════════════════════════
 * 🔍 VALIDADOR DE ARCHIVOS CSV
 * ═══════════════════════════════════════════════════════════════
 *
 * Este script valida que todos los archivos CSV existen y tienen
 * la estructura correcta ANTES de ejecutar la importación.
 *
 * EJECUTAR ANTES DE importar-csv-firestore.ts
 *
 * COMANDO: npx ts-node scripts/validar-csv.ts
 * ═══════════════════════════════════════════════════════════════
 */
import chalk from 'chalk';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';

const CSV_DIR = './data/csv/';

const ARCHIVOS_REQUERIDOS = [
  'Copia de Administación_General - Clientes.csv',
  'Copia de Administación_General - Distribuidores.csv',
  'Copia de Administación_General - Control_Maestro.csv',
  'Copia de Administación_General - Almacen_Monte.csv',
  'Copia de Administación_General - Bóveda_Monte.csv',
  'Copia de Administación_General - Bóveda_USA.csv',
  'Copia de Administación_General - Profit.csv',
  'Copia de Administación_General - Leftie.csv',
  'Copia de Administación_General - Flete_Sur.csv',
  'Copia de Administación_General - Utilidades.csv',
  'Copia de Administación_General - Azteca.csv',
];

interface ValidationResult {
  archivo: string;
  existe: boolean;
  filas: number;
  columnas: string[];
  tamanio: string;
  errores: string[];
}

async function validarCSV(archivo: string): Promise<ValidationResult> {
  const rutaCompleta = path.join(CSV_DIR, archivo);
  const resultado: ValidationResult = {
    archivo,
    existe: false,
    filas: 0,
    columnas: [],
    tamanio: '0 KB',
    errores: [],
  };

  // 1. Verificar si existe
  if (!fs.existsSync(rutaCompleta)) {
    resultado.errores.push('Archivo no encontrado');
    return resultado;
  }

  resultado.existe = true;

  // 2. Obtener tamaño
  try {
    const stats = fs.statSync(rutaCompleta);
    const tamanioKB = (stats.size / 1024).toFixed(2);
    resultado.tamanio = `${tamanioKB} KB`;

    if (stats.size === 0) {
      resultado.errores.push('Archivo vacío (0 bytes)');
      return resultado;
    }
  } catch (error) {
    resultado.errores.push(`Error leyendo tamaño: ${error}`);
  }

  // 3. Parsear CSV y contar filas
  return new Promise((resolve) => {
    const filas: any[] = [];
    let primeraFila = true;

    fs.createReadStream(rutaCompleta)
      .pipe(csv())
      .on('data', (data) => {
        if (primeraFila) {
          resultado.columnas = Object.keys(data);
          primeraFila = false;
        }
        filas.push(data);
      })
      .on('end', () => {
        resultado.filas = filas.length;

        // Validaciones adicionales
        if (resultado.filas === 0) {
          resultado.errores.push('CSV sin datos (solo headers)');
        }

        if (resultado.columnas.length === 0) {
          resultado.errores.push('CSV sin columnas (malformado)');
        }

        resolve(resultado);
      })
      .on('error', (error) => {
        resultado.errores.push(`Error parseando CSV: ${error.message}`);
        resolve(resultado);
      });
  });
}

async function validarServiceAccount(): Promise<boolean> {
  const rutaServiceAccount = './firebase/serviceAccountKey.json';

  console.log(chalk.cyan('\n🔐 Validando Service Account Key...\n'));

  if (!fs.existsSync(rutaServiceAccount)) {
    console.log(chalk.red('❌ serviceAccountKey.json NO encontrado'));
    console.log(chalk.yellow('   Ruta esperada: ./firebase/serviceAccountKey.json'));
    console.log(
      chalk.yellow('   Descárgalo desde Firebase Console > Project Settings > Service Accounts\n')
    );
    return false;
  }

  try {
    const contenido = JSON.parse(fs.readFileSync(rutaServiceAccount, 'utf8'));

    const camposRequeridos = ['project_id', 'private_key', 'client_email'];
    const camposFaltantes = camposRequeridos.filter((campo) => !contenido[campo]);

    if (camposFaltantes.length > 0) {
      console.log(chalk.red('❌ serviceAccountKey.json INVÁLIDO'));
      console.log(chalk.yellow(`   Campos faltantes: ${camposFaltantes.join(', ')}\n`));
      return false;
    }

    console.log(chalk.green('✅ serviceAccountKey.json válido'));
    console.log(chalk.gray(`   Project ID: ${contenido.project_id}`));
    console.log(chalk.gray(`   Client Email: ${contenido.client_email}\n`));
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Error parseando serviceAccountKey.json'));
    console.log(chalk.yellow(`   ${error}\n`));
    return false;
  }
}

async function main() {
  console.log('\n' + chalk.cyan('═'.repeat(70)));
  console.log(chalk.cyan.bold('           🔍 VALIDADOR DE ARCHIVOS CSV           '));
  console.log(chalk.cyan('═'.repeat(70)) + '\n');

  // 1. Verificar directorio CSV
  if (!fs.existsSync(CSV_DIR)) {
    console.log(chalk.red(`❌ El directorio '${CSV_DIR}' no existe.`));
    console.log(chalk.yellow(`   Crea la carpeta y coloca los 12 CSVs ahí.\n`));
    process.exit(1);
  }

  console.log(chalk.cyan(`📁 Directorio CSV: ${CSV_DIR}\n`));

  // 2. Validar cada archivo
  const resultados: ValidationResult[] = [];
  let erroresEncontrados = 0;

  for (const archivo of ARCHIVOS_REQUERIDOS) {
    const resultado = await validarCSV(archivo);
    resultados.push(resultado);

    if (resultado.errores.length > 0) {
      erroresEncontrados++;
    }
  }

  // 3. Mostrar resultados
  console.log(chalk.cyan('═'.repeat(70)));
  console.log(chalk.cyan.bold('  📊 RESULTADOS DE VALIDACIÓN'));
  console.log(chalk.cyan('═'.repeat(70)) + '\n');

  for (const resultado of resultados) {
    const icono = resultado.errores.length === 0 ? chalk.green('✅') : chalk.red('❌');
    const nombre = resultado.archivo.replace('Copia de Administación_General - ', '');

    console.log(`${icono} ${chalk.white(nombre)}`);

    if (resultado.existe) {
      console.log(
        chalk.gray(
          `   │ Filas: ${resultado.filas} | Columnas: ${resultado.columnas.length} | Tamaño: ${resultado.tamanio}`
        )
      );

      if (resultado.errores.length > 0) {
        resultado.errores.forEach((error) => {
          console.log(chalk.red(`   │ ⚠️  ${error}`));
        });
      }
    } else {
      console.log(chalk.red(`   │ ⚠️  Archivo no encontrado`));
    }

    console.log('');
  }

  // 4. Validar Service Account
  const serviceAccountValido = await validarServiceAccount();

  // 5. Resumen final
  console.log(chalk.cyan('═'.repeat(70)));
  console.log(chalk.cyan.bold('  📋 RESUMEN'));
  console.log(chalk.cyan('═'.repeat(70)) + '\n');

  const archivosValidos = resultados.filter((r) => r.errores.length === 0).length;
  const totalFilas = resultados.reduce((sum, r) => sum + r.filas, 0);

  console.log(
    chalk.white(`  Archivos válidos:        ${archivosValidos}/${ARCHIVOS_REQUERIDOS.length}`)
  );
  console.log(chalk.white(`  Total de filas:          ${totalFilas.toLocaleString()}`));
  console.log(
    chalk.white(`  Service Account:         ${serviceAccountValido ? '✅ Válido' : '❌ Inválido'}`)
  );
  console.log('');

  if (erroresEncontrados > 0 || !serviceAccountValido) {
    console.log(chalk.red.bold('  ❌ VALIDACIÓN FALLIDA'));
    console.log(chalk.yellow('     Corrige los errores antes de ejecutar la importación.\n'));
    console.log(chalk.cyan('═'.repeat(70)) + '\n');
    process.exit(1);
  } else {
    console.log(chalk.green.bold('  ✅ VALIDACIÓN EXITOSA'));
    console.log(chalk.green('     Todos los archivos están listos para importar.\n'));
    console.log(chalk.white('  Siguiente paso:'));
    console.log(chalk.cyan('     npm run import:csv\n'));
    console.log(chalk.cyan('═'.repeat(70)) + '\n');
    process.exit(0);
  }
}

main();
