// Algoritmo de frecuencia de palabras.
//
// Reglas (supuestos documentados en el README):
//  - Una palabra es un fragmento separado por espacios en blanco que contiene al menos una letra o un número.
//  - La puntuación al inicio o al final se descarta ("¿Hola?" -> "hola"); la interna se conserva ("bien-estar").
//  - No se distingue entre mayúsculas y minúsculas.
//  - Un BOM inicial (U+FEFF, típico de archivos de Windows) no es contenido y se ignora.
//  - Los caracteres incluyen espacios y excluyen los saltos de línea (\r y \n). Se cuentan puntos de código Unicode.
//  - Orden del resultado: frecuencia descendente y, en caso de empate, alfabético (según el español).

const EDGE_NON_WORD = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;
const HAS_LETTER_OR_NUMBER = /[\p{L}\p{N}]/u;
const collator = new Intl.Collator('es');

/** Devuelve la palabra normalizada o null si el fragmento no es una palabra (ej. "-" o "..."). */
function toWord(token) {
  const word = token.replace(EDGE_NON_WORD, '').toLowerCase();
  return HAS_LETTER_OR_NUMBER.test(word) ? word : null;
}

/**
 * @param {string} text
 * @returns {{words: number, characters: number, frequencies: [string, number][]}}
 */
function analyze(text) {
  const normalized = text.replace(/^\uFEFF/, '').normalize('NFC');
  const characters = Array.from(normalized.replace(/[\r\n]/g, '')).length;

  const counts = new Map();
  let words = 0;
  for (const token of normalized.split(/\s+/)) {
    const word = toWord(token);
    if (word === null) continue;
    words++;
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  const frequencies = [...counts.entries()].sort((a, b) => b[1] - a[1] || collator.compare(a[0], b[0]));
  return { words, characters, frequencies };
}

module.exports = { analyze };
