const test = require('node:test');
const assert = require('node:assert/strict');
const { format } = require('../../src/format');

test('imprime totales, línea en blanco y una línea "palabra: frecuencia" por palabra', () => {
  const salida = format({
    words: 3,
    characters: 11,
    frequencies: [
      ['hola', 2],
      ['mundo', 1],
    ],
  });
  assert.equal(salida, ['3 words', '11 characters', '', 'hola: 2', 'mundo: 1'].join('\n'));
});

test('sin palabras imprime solo los totales', () => {
  assert.equal(format({ words: 0, characters: 0, frequencies: [] }), '0 words\n0 characters');
});
