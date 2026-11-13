// Formato de salida del contador (el mismo del enunciado: totales, línea en blanco y "palabra: frecuencia").

/**
 * @param {{words: number, characters: number, frequencies: [string, number][]}} resultado
 * @returns {string}
 */
function format({ words, characters, frequencies }) {
  const lines = [`${words} words`, `${characters} characters`];
  if (frequencies.length) {
    lines.push('');
    for (const [word, count] of frequencies) lines.push(`${word}: ${count}`);
  }
  return lines.join('\n');
}

module.exports = { format };
