/// <reference lib="webworker" />
/** Ejecuta el código en un Worker cancelable. No ofrece aislamiento de seguridad para código hostil. */
self.onmessage = (event: MessageEvent<string>) => {
  const CASES = [
    { input: 2, expected: true },
    { input: 17, expected: true },
    { input: 1, expected: false },
    { input: 9, expected: false },
    { input: -3, expected: false },
  ];
  try {
    const execute = new Function(
      `${event.data}\nreturn typeof esPrimo === 'function' ? esPrimo : null;`,
    );
    const esPrimo = execute();
    if (!esPrimo) throw new Error('Define una función llamada esPrimo(n).');
    const results = CASES.map((test) => {
      try {
        const actual = esPrimo(test.input);
        return { ...test, actual: String(actual), passed: actual === test.expected };
      } catch (error) {
        return { ...test, actual: String(error), passed: false };
      }
    });
    self.postMessage({ results });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Error de ejecución' });
  }
};
export {};
