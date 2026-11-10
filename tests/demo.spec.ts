import { test, expect } from '@playwright/test';
/** Abre una sesión de demostración sin depender del proveedor de identidad. */
async function openSession(page: import('@playwright/test').Page, role = 'Alumno') {
  await page.goto('./');
  await page.evaluate((role) => {
    localStorage.setItem('skilltech:session', JSON.stringify({ role, email: 'demo@example.com' }));
  }, role);
  await page.goto('./#/');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Hola, Guillermo' })).toBeVisible();
}
test('Acceso de dos pasos y navegación del alumno', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Contraseña', { exact: true }).fill('demo');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByLabel('Código de verificación').fill('123456');
  await page.getByRole('button', { name: 'Verificar y entrar' }).click();
  await expect(page.getByRole('heading', { name: 'Hola, Guillermo' })).toBeVisible();
  await page.screenshot({ path: 'test-results/screenshots/dashboard.png', fullPage: true });
  await expect(page.locator('a[href="https://github.com/guillermogarcia137/Caso2"]')).toBeVisible();
  await page.getByRole('button', { name: 'Cambiar tema' }).click();
  await expect(page.locator('.app')).toHaveClass(/light/);
  await page.getByRole('button', { name: 'Cambiar idioma' }).click();
  await expect(page.getByRole('link', { name: 'Course catalog' })).toBeVisible();
});
test('Catálogo: filtros y matrícula simulada', async ({ page }) => {
  await openSession(page);
  await page.goto('./#/catalogo');
  await page.getByRole('button', { name: 'Cloud', exact: true }).click();
  await expect(page.locator('.course-card')).toHaveCount(2);
  await page.getByRole('textbox', { name: 'Buscar cursos' }).fill('AWS');
  await expect(page.locator('.course-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Matricularme' }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Confirmar matrícula simulada' }).click();
  await page.getByRole('link', { name: 'Entrar al aula' }).click();
  await expect(page.getByRole('heading', { name: 'Cloud computing con AWS' })).toBeVisible();
  await page.getByRole('button', { name: 'Marcar como completada' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Completada', exact: true })).toBeVisible();
});
test('Código: cinco casos, error sintáctico y límite de tiempo', async ({ page }) => {
  await openSession(page);
  const setCode = async (code: string) => {
    await page.evaluate(
      (value) => localStorage.setItem('skilltech:code:java', JSON.stringify(value)),
      code,
    );
    await page.goto('./#/codigo/java');
    await page.reload();
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: 'Ejecutar pruebas' }).click();
  };
  await setCode(
    'function esPrimo(n) { if (n < 2) return false; for (let i=2;i*i<=n;i++) if(n%i===0) return false; return true; }',
  );
  await expect(page.getByText('Nota: 10 / 10')).toBeVisible();
  await setCode('function esPrimo( {');
  await expect(page.locator('.error-panel')).toBeVisible();
  await setCode('function esPrimo(n) { while(true) {} }');
  await expect(page.getByText(/Tiempo límite superado/)).toBeVisible({ timeout: 10000 });
});
test('Examen: autoguardado, corrección, certificado, PDF y modificación', async ({ page }) => {
  await openSession(page);
  await page.goto('./#/examen/java');
  await expect(page.locator('fieldset')).toHaveCount(10);
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem('skilltech:quiz:java') ?? 'null')?.ids.length,
      ),
    )
    .toBe(10);
  const bank = await page.evaluate(async () => {
    const path = '/Caso2/src/data/questions.ts';
    return (await import(/* @vite-ignore */ path)).QUESTIONS as { id: number; correct: number }[];
  });
  const ids = await page.evaluate(
    () => JSON.parse(localStorage.getItem('skilltech:quiz:java') || 'null')?.ids,
  );
  // Al desmontar el examen se conserva el intento inicial.
  if (!ids) {
    await page.goto('./#/');
    await page.goto('./#/examen/java');
  }
  const questions = await page.evaluate(
    () => JSON.parse(localStorage.getItem('skilltech:quiz:java')!).ids as number[],
  );
  for (let i = 0; i < questions.length; i++) {
    const correct = bank.find((q) => q.id === questions[i])!.correct;
    await page.locator('fieldset').nth(i).getByRole('radio').nth(correct).check();
  }
  await expect(page.getByText('Guardado', { exact: true })).toBeVisible({ timeout: 15000 });
  await page.reload();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(10);
  await page.getByRole('button', { name: 'Entregar examen' }).click();
  await page.getByRole('button', { name: 'Generar certificado' }).click();
  await expect(page.getByRole('button', { name: 'Certificado generado' })).toBeVisible();
  await page.getByRole('link', { name: 'Mis certificados', exact: true }).last().click();
  await expect(page.locator('.certificate-card')).toHaveCount(1);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar PDF' }).click();
  expect((await download).suggestedFilename()).toMatch(/\.pdf$/);
  const cert = await page.evaluate(
    () => JSON.parse(localStorage.getItem('skilltech:certificates')!)[0],
  );
  await page.goto('./#/validar');
  await page.getByLabel('ID o contenido del QR').fill(cert.id);
  await page.getByRole('button', { name: 'Comprobar certificado' }).click();
  await expect(page.getByRole('heading', { name: 'Certificado auténtico' })).toBeVisible();
  await page.getByLabel('ID o contenido del QR').fill(JSON.stringify({ ...cert, grade: 1 }));
  await page.getByRole('button', { name: 'Comprobar certificado' }).click();
  await expect(
    page.getByRole('heading', { name: 'Certificado no válido o modificado' }),
  ).toBeVisible();
});
test('Foro, chat, rutas y diseño móvil', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openSession(page);
  await page.goto('./#/foro');
  await page.getByLabel('Tu respuesta').fill('Gracias por la explicación');
  await page.getByRole('button', { name: 'Responder', exact: true }).click();
  await expect(page.getByText('Guillermo · Gracias por la explicación')).toBeVisible();
  await page.goto('./#/chat');
  await page.getByLabel('Escribe tu mensaje').fill('¿Me ayudas con Java?');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByText(/Respuesta simulada:/)).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    '/',
    '/catalogo',
    '/aula/java',
    '/certificados',
    '/foro',
    '/chat',
    '/codigo/java',
    '/examen/java',
    '/validar',
  ]) {
    await page.goto(`./#${route}`);
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.goto('./#/');
  await page.screenshot({ path: 'test-results/screenshots/mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await expect(page.getByRole('link', { name: 'Explorar cursos' })).toBeVisible();
  expect(errors).toEqual([]);
});
test('Coordinación: permisos y simulación de 30 segundos', async ({ page }) => {
  await openSession(page, 'Coordinador');
  await page.goto('./#/coordinacion');
  await page.getByRole('button', { name: 'Simular convocatoria' }).click();
  await expect(page.getByText('Simulación completada.', { exact: false })).toBeVisible({
    timeout: 35000,
  });
  await expect(page.locator('.stat-card').first()).toContainText('15.000');
  await page.screenshot({ path: 'test-results/screenshots/coordinacion.png', fullPage: true });
});

/** Evita perder la posición cuando el vídeo se carga desde la caché. */
test('Vídeo: posición recuperada, velocidad y subtítulos', async ({ page }) => {
  await openSession(page);
  await page.goto('./#/aula/java');
  await page.waitForFunction(() => (document.querySelector('video')?.readyState ?? 0) >= 2);
  await page.getByLabel('Velocidad').selectOption('1.5');
  await expect.poll(() => page.locator('video').evaluate((video) => video.playbackRate)).toBe(1.5);
  await page.getByRole('button', { name: 'CC · Subtítulos no' }).click();
  await expect
    .poll(() => page.locator('video').evaluate((video) => video.textTracks[0].mode))
    .toBe('showing');
  await page.locator('video').evaluate((video) => {
    video.currentTime = 12;
  });
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem('skilltech:video:java:0') ?? '0')),
    )
    .toBe(12);
  await page.reload();
  await expect.poll(() => page.locator('video').evaluate((video) => video.currentTime)).toBe(12);
});
