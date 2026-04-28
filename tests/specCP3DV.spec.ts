import { test, expect } from '@playwright/test';
import { loginSession } from '../auth/login';
import { UsuarioOwnerPage } from '../pages/usuarioOwnerPage';
import { CreacionUsuarioPage } from '../pages/creacionUsuarioPage';

test.describe('Crear usuario Owner', () => {
  // Ejecución ANTES de cada test
  test.beforeEach(async ({ page }) => {
    await loginSession(page);
    // Luego de login, ir a la página principal
    await page.goto('/');
  });

  test('passes', async ({ page }) => {
    const usuarioOwner = new UsuarioOwnerPage(page);
    const creacionUsuario = new CreacionUsuarioPage(page);

    // Navegación y creación de usuario Owner
    await usuarioOwner.clickUsuariosOwner();
    await usuarioOwner.clickBtnMasOwner();
    await usuarioOwner.typeNombreOwner('GT Automatizacion');
    await usuarioOwner.typeApellidoOwner('GT QA');

    // Se llama a la función que genera datos dinámicos de email
    await creacionUsuario.datosDinamicosEmail();

    await usuarioOwner.seleccionarTenant('QA');
    await usuarioOwner.seleccionarRol('Rol Owner');
    await usuarioOwner.confirmarOwner();

    // Validamos mensaje de éxito
    await expect(page.getByText('Usuario creado con éxito.')).toBeVisible();
  });
});
