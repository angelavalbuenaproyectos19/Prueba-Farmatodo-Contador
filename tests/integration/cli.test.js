const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { run, USO } = require('../../src/cli');

const CLI = path.join(__dirname, '../../src/cli.js');
const fixture = (nombre) => path.join(__dirname, '../fixtures', nombre);
const ejecutar = (...args) => spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });

const SALIDA_ENUNCIADO = [
  '14 words',
  '99 characters',
  '',
  'farmatodo: 6',
  'cuida: 3',
  'salud: 2',
  'tu: 2',
  'toda: 1',
].join('\n');

test('ejecutado como programa, imprime exactamente la salida del enunciado', () => {
  const r = ejecutar(fixture('ejemplo.txt'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout, SALIDA_ENUNCIADO + '\n');
  assert.equal(r.stderr, '');
});

test('el mismo texto con saltos CRLF y sin salto final da la misma salida', () => {
  const r = ejecutar(fixture('ejemplo-crlf-sin-salto-final.txt'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout, SALIDA_ENUNCIADO + '\n');
});

test('un archivo vacío imprime solo los totales en cero', () => {
  const r = ejecutar(fixture('vacio.txt'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '0 words\n0 characters\n');
});

test('un texto en español agrupa mayúsculas, tildes y puntuación', () => {
  const r = ejecutar(fixture('espanol.txt'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout, ['6 words', '48 characters', '', 'ñandú: 3', 'canción: 2', 'corazón: 1'].join('\n') + '\n');
});

test('los empates salen en orden alfabético', () => {
  const r = ejecutar(fixture('empate.txt'));
  assert.equal(r.stdout, ['6 words', '11 characters', '', 'a: 2', 'b: 2', 'c: 2'].join('\n') + '\n');
});

test('sin argumentos muestra el uso y termina con código 1', () => {
  const r = ejecutar();
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  assert.equal(r.stderr.trim(), USO);
});

test('con más de un argumento muestra el uso y termina con código 1', () => {
  const r = ejecutar('a.txt', 'b.txt');
  assert.equal(r.status, 1);
  assert.equal(r.stderr.trim(), USO);
});

test('un archivo que no existe da un mensaje claro y código 1', () => {
  const r = ejecutar(fixture('no-existe.txt'));
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /No se pudo leer ".*no-existe\.txt": el archivo no existe/);
});

test('run() usa la función de lectura inyectada', () => {
  const r = run(['cualquiera.txt'], { readFile: () => 'hola hola mundo' });
  assert.deepEqual(r, { code: 0, stdout: '3 words\n15 characters\n\nhola: 2\nmundo: 1', stderr: '' });
});

test('run() informa los errores de lectura distintos de "no existe"', () => {
  const readFile = () => {
    throw Object.assign(new Error('permiso denegado'), { code: 'EACCES' });
  };
  const r = run(['x.txt'], { readFile });
  assert.equal(r.code, 1);
  assert.match(r.stderr, /permiso denegado/);
});

test('un directorio en lugar de un archivo da un mensaje claro y código 1', () => {
  const r = ejecutar(path.join(__dirname, '../fixtures'));
  assert.equal(r.status, 1);
  assert.match(r.stderr, /es un directorio, no un archivo/);
});

test('un archivo con BOM da el mismo resultado que sin BOM', () => {
  const r = ejecutar(fixture('con-bom.txt'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '3 words\n15 characters\n\nhola: 2\nmundo: 1\n');
});
