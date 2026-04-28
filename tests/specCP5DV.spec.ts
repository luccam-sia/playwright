import { test, expect } from '@playwright/test';
import { loginSession } from '../auth/login';
import { CreacionUsuarioPage } from '../pages/creacionUsuarioPage';

test.describe('Deshabilitar usuario', () => {
  // Ejecución ANTES de cada test
  test.beforeEach(async ({ page }) => {
    await loginSession(page);
    // Luego de login, ir a la página principal
    await page.goto('/');
  });

  test('passes', async ({ page }) => {
    const creacionUsuario = new CreacionUsuarioPage(page);

    // Acceder a sección usuarios
    await creacionUsuario.clickUsuarios();

    // Selecciono un usuario de la lista
    await creacionUsuario.clickUsuarioLista();

    // Se realiza clic sobre el toggle
    await creacionUsuario.deshabilitarUsuario();

    // Validamos mensaje de éxito
    await expect(page.getByText('Usuario desactivado con éxito.')).toBeVisible();
  });
});
