import { test } from '@playwright/test';
import { loginSession } from '../auth/login';
import { RolPage } from '../pages/rolPage.page';

test.describe('Deshabilitar rol', () => {
  // Ejecución ANTES de cada test
  test.beforeEach(async ({ page }) => {
    await loginSession(page);
    // Luego de login, ir a la página principal
    await page.goto('/');
  });

  test('passes', async ({ page }) => {
    const rolPage = new RolPage(page);

    // Acceder a sección Rol
    await rolPage.clickBtnRoles();

    // Acceder a un rol asegurando el tenant correcto
    await rolPage.asegurarTenantCorrecto('tenant nuevo');

    // Acceder a un rol dinámico
    await rolPage.ingresarCualquierRolDinamico();

    // Desactivar el rol
    await rolPage.desactivarRol();

    // Validar mensaje de éxito
    await rolPage.validacionExitosaDesactivacion();
  });
});
