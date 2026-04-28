import { test, expect } from '@playwright/test';
import { loginSession } from '../auth/login';
import { CreacionUsuarioPage } from '../pages/creacionUsuarioPage';

test.describe('Crear usuario super Admin', () => {
  // Ejecución ANTES de cada test
  test.beforeEach(async ({ page }) => {
    await loginSession(page);
    // Luego de login, ir a la página principal
    await page.goto('/');
  });

  test('passes', async ({ page }) => {
    const creacionUsuario = new CreacionUsuarioPage(page);

    // Navegación y creación de usuario Super Admin
    await creacionUsuario.clickUsuarios();
    await creacionUsuario.clickBtnMas();
    await creacionUsuario.typeNombre('GT Automatizacion');
    await creacionUsuario.typeApellido('GT QA ');

    // Se llama a la función que genera datos dinámicos de email
    await creacionUsuario.datosDinamicosEmail();

    await creacionUsuario.seleccionarSuperAdmin();
    await creacionUsuario.confirmar();

    // Validamos mensaje de éxito
    await expect(page.getByText('Usuario creado con éxito.')).toBeVisible();
  });
});
