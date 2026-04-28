import { test, expect } from '@playwright/test';
import { loginSession } from '../auth/login';
import { UsuarioUserPage } from '../pages/usuarioUserPage';
import { CreacionUsuarioPage } from '../pages/creacionUsuarioPage';

test.describe('Crear usuario User', () => {
  // Ejecución ANTES de cada test
  test.beforeEach(async ({ page }) => {
    await loginSession(page);
    // Luego de login, ir a la página principal
    await page.goto('/');
  });

  test('passes', async ({ page }) => {
    const usuarioUser = new UsuarioUserPage(page);
    const creacionUsuario = new CreacionUsuarioPage(page);

    // Navegación y creación de usuario User
    await usuarioUser.clickUsuariosUser();
    await usuarioUser.clickBtnMasUser();
    await usuarioUser.typeNombreUser('GT Automatizacion');
    await usuarioUser.typeApellidoUser('GT QA');

    // Se llama a la función que genera datos dinámicos de email
    await creacionUsuario.datosDinamicosEmail();

    await usuarioUser.seleccionarTenant('QA');
    await usuarioUser.seleccionarRol('Rol User');
    await usuarioUser.confirmarUser();

    // Validamos mensaje de éxito
    await expect(page.getByText('Usuario creado con éxito.')).toBeVisible();
  });
});
