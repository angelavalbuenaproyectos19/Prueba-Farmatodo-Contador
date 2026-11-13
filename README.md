# Contador de frecuencia de palabras

Programa en **Node.js** (sin dependencias de ejecución) que lee un archivo de texto, cuenta **palabras** y **caracteres** e imprime un **histograma** con la frecuencia de cada palabra, ordenado de mayor a menor.

## Ejemplo

Archivo `tests/fixtures/ejemplo.txt`:

```
farmatodo farmatodo farmatodo farmatodo farmatodo cuida cuida tu salud
farmatodo cuida toda tu salud
```

Salida:

```
14 words
99 characters

farmatodo: 6
cuida: 3
salud: 2
tu: 2
toda: 1
```

## Requisitos

- Node.js 20 o superior (`node -v`)
- Git

## Cómo ejecutarlo

```bash
# 1. Clonar el repositorio
git clone https://github.com/angelavalbuenaproyectos19/Prueba-Farmatodo-Contador.git
cd Prueba-Farmatodo-Contador

# 2. Instalar dependencias (solo herramientas de desarrollo: lint, formato)
npm install

# 3. Ejecutar con el archivo de ejemplo
npm start

# 4. Ejecutar con tu propio archivo
node src/cli.js ruta/a/tu-archivo.txt
```

Si falta el argumento o el archivo no existe, el programa muestra un mensaje claro y termina con código de salida `1`.

## Cómo ejecutar las pruebas

```bash
npm test                 # unitarias + integración del CLI
npm run lint             # ESLint
npm run format:check     # Prettier
```

Las pruebas cubren:

- **Unitarias** (`tests/unit/`): el ejemplo exacto del enunciado, el orden descendente y el desempate alfabético (según el español), mayúsculas y minúsculas, puntuación (`¿ ¡ « »`), números, saltos de línea, espacios, texto vacío, letras con tilde descompuestas, emojis y un texto de 100 000 palabras.
- **Integración** (`tests/integration/`): el CLI ejecutado como programa real con archivos de prueba (`tests/fixtures/`), comparando la salida **exacta** del enunciado, y los casos de error (sin argumentos, demasiados argumentos, archivo inexistente, directorio en lugar de archivo).

## Reglas y supuestos

El enunciado no define algunos casos; estas son las decisiones tomadas:

| Tema                 | Decisión                                                                                                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ¿Qué es una palabra? | Un fragmento separado por espacios en blanco que contiene al menos una letra o un número. Un `-` o `...` solos no son palabras.                                                                 |
| Puntuación           | Se descarta al inicio y al final (`¿Hola?` → `hola`) y se conserva dentro de la palabra (`bien-estar`).                                                                                         |
| Mayúsculas           | No se distinguen (`Sol`, `sol` y `SOL` son la misma palabra).                                                                                                                                   |
| Caracteres           | Incluyen espacios y excluyen los saltos de línea (`\r` y `\n`). Se cuentan caracteres Unicode, no unidades internas: `ñ` y `😀` cuentan como 1, aunque la `ñ` venga descompuesta (`n` + tilde). |
| Orden                | Frecuencia descendente. En empate, alfabético según el español (`áspero` antes que `ave`; `ñ` después de `n`).                                                                                  |
| Salida               | Exactamente el formato del enunciado (`words`, `characters` y `palabra: frecuencia`). Sin palabras, solo imprime los totales.                                                                   |

## Complejidad computacional

Sea **n** la cantidad de caracteres del texto y **k** la cantidad de palabras distintas:

- **Tiempo: O(n + k log k).** Se recorre el texto una sola vez para separar y normalizar las palabras y contarlas en un `Map` (inserción y búsqueda O(1) promedio). Luego se ordenan las k palabras distintas: O(k log k). Como k ≤ n, en el peor caso el total es O(n log n).
- **Espacio: O(n + k).** El archivo se lee completo en memoria (O(n)) y se guarda un contador por palabra distinta (O(k)).

## Estructura

```
src/wordFrequency.js     algoritmo: analyze(text) -> palabras, caracteres y frecuencias ordenadas
src/format.js            formato de salida del enunciado
src/cli.js               línea de comandos (run() es testeable; no toca el proceso)
tests/unit/              pruebas unitarias del algoritmo y del formato
tests/integration/       pruebas del CLI ejecutado como programa
tests/fixtures/          archivos de texto de prueba
.github/workflows/       integración continua (lint, formato y pruebas en Node 20 y 22)
```

## Calidad de código

ESLint, Prettier y EditorConfig configurados. Cada push y pull request a `main` ejecuta en GitHub Actions: lint, verificación de formato y pruebas en Node 20 y 22.
