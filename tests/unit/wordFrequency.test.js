const test = require('node:test');
const assert = require('node:assert/strict');
const { analyze } = require('../../src/wordFrequency');

const EJEMPLO = 'farmatodo farmatodo farmatodo farmatodo farmatodo cuida cuida tu salud\nfarmatodo cuida toda tu salud';

test('el ejemplo del enunciado da 14 palabras y 99 caracteres', () => {
  const { words, characters } = analyze(EJEMPLO);
  assert.equal(words, 14);
  assert.equal(characters, 99);
});

test('el ejemplo del enunciado da las frecuencias esperadas, ordenadas', () => {
  assert.deepEqual(analyze(EJEMPLO).frequencies, [
    ['farmatodo', 6],
    ['cuida', 3],
    ['salud', 2],
    ['tu', 2],
    ['toda', 1],
  ]);
});

test('los empates se ordenan alfabéticamente', () => {
  assert.deepEqual(analyze('b a c a b c').frequencies, [
    ['a', 2],
    ['b', 2],
    ['c', 2],
  ]);
});

test('el orden alfabético respeta el español (la tilde no cambia el orden de la letra y la ñ va después de la n)', () => {
  const orden = analyze('ñu nu oso áspero ave').frequencies.map(([palabra]) => palabra);
  assert.deepEqual(orden, ['áspero', 'ave', 'nu', 'ñu', 'oso']);
});

test('no distingue mayúsculas de minúsculas', () => {
  assert.deepEqual(analyze('Sol sol SOL').frequencies, [['sol', 3]]);
});

test('descarta la puntuación al inicio y al final, incluidos ¿ ¡ « »', () => {
  assert.deepEqual(analyze('¿Hola? ¡hola! «hola» (hola) hola,').frequencies, [['hola', 5]]);
});

test('conserva la puntuación interna de la palabra', () => {
  assert.deepEqual(analyze('bien-estar bien-estar').frequencies, [['bien-estar', 2]]);
});

test('un fragmento sin letras ni números no es una palabra', () => {
  const { words, frequencies } = analyze('hola - ... hola');
  assert.equal(words, 2);
  assert.deepEqual(frequencies, [['hola', 2]]);
});

test('los números cuentan como palabras', () => {
  assert.deepEqual(analyze('123 123 456').frequencies, [
    ['123', 2],
    ['456', 1],
  ]);
});

test('los saltos de línea no cuentan como caracteres, los espacios sí', () => {
  assert.equal(analyze('a b\nc').characters, 4);
  assert.equal(analyze('a b\r\nc').characters, 4);
});

test('los espacios múltiples y de los extremos cuentan como caracteres pero no crean palabras', () => {
  const { words, characters } = analyze('  hola   mundo  ');
  assert.equal(words, 2);
  assert.equal(characters, 16);
});

test('una letra con tilde cuenta como un solo carácter aunque venga descompuesta', () => {
  const compuesta = 'ñ';
  const descompuesta = 'ñ';
  assert.equal(analyze(compuesta).characters, 1);
  assert.equal(analyze(descompuesta).characters, 1);
  assert.deepEqual(analyze(`${compuesta} ${descompuesta}`).frequencies, [['ñ', 2]]);
});

test('un carácter fuera del plano básico (emoji) cuenta como uno', () => {
  assert.equal(analyze('a😀b').characters, 3);
});

test('un texto vacío da cero palabras, cero caracteres y ninguna frecuencia', () => {
  assert.deepEqual(analyze(''), { words: 0, characters: 0, frequencies: [] });
});

test('un texto de solo espacios y saltos de línea no tiene palabras', () => {
  assert.deepEqual(analyze('  \n \r\n  '), { words: 0, characters: 5, frequencies: [] });
});

test('el total de palabras es la suma de las frecuencias', () => {
  const { words, frequencies } = analyze('uno dos dos tres tres tres');
  assert.equal(
    words,
    frequencies.reduce((suma, [, n]) => suma + n, 0)
  );
});

test('procesa un texto grande de forma lineal y correcta', () => {
  const texto = 'gato '.repeat(100_000).trim();
  const { words, characters, frequencies } = analyze(texto);
  assert.equal(words, 100_000);
  assert.equal(characters, 100_000 * 4 + 99_999);
  assert.deepEqual(frequencies, [['gato', 100_000]]);
});

test('un BOM al inicio del archivo no cuenta como carácter ni altera las palabras', () => {
  const conBom = analyze('\uFEFFhola mundo hola');
  assert.deepEqual(conBom, analyze('hola mundo hola'));
  assert.equal(conBom.characters, 15);
});
