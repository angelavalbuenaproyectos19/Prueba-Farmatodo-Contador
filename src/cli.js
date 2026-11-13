#!/usr/bin/env node
// Interfaz de línea de comandos: lee un archivo de texto e imprime el análisis.
const fs = require('node:fs');
const { analyze } = require('./wordFrequency');
const { format } = require('./format');

const USO = 'Uso: node src/cli.js <archivo-de-texto>';

/**
 * Ejecuta el CLI sin tocar el proceso: devuelve el código de salida y lo que se debe imprimir.
 * @param {string[]} args argumentos (sin "node" ni el script)
 * @param {{readFile?: (path: string, encoding: string) => string}} deps dependencias inyectables (para pruebas)
 */
function run(args, { readFile = fs.readFileSync } = {}) {
  if (args.length !== 1) {
    return { code: 1, stdout: '', stderr: USO };
  }
  let text;
  try {
    text = readFile(args[0], 'utf8');
  } catch (error) {
    const motivos = { ENOENT: 'el archivo no existe', EISDIR: 'es un directorio, no un archivo' };
    const motivo = motivos[error.code] || error.message;
    return { code: 1, stdout: '', stderr: `No se pudo leer "${args[0]}": ${motivo}` };
  }
  return { code: 0, stdout: format(analyze(text)), stderr: '' };
}

if (require.main === module) {
  const { code, stdout, stderr } = run(process.argv.slice(2));
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  process.exitCode = code;
}

module.exports = { run, USO };
