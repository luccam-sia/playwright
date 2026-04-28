import { test, expect } from '@playwright/test';
import { loginSession } from '../auth/login';
import { CreacionUsuarioPage } from '../pages/creacionUsuario.page';
import { UsuarioOwnerPage } from '../pages/usuarioOwner.page';

test.describe('Modificacion en la config del usuario', () => {
  // Ejecución ANTES de cada test
  test.beforeEach(async ({ page }) => {
    await loginSession(page);
    // Luego de login, ir a la página principal
    await page.goto('/');
  });

  test('passes', async ({ page }) => {
    const creacionUsuario = new CreacionUsuarioPage(page);
    const usuarioOwner = new UsuarioOwnerPage(page);

    // Acceder a sección usuarios
    await creacionUsuario.clickUsuarios();

    // Selecciono un usuario de la lista
    await creacionUsuario.clickUsuarioLista();

    // Se llama a la función que contiene los datos dinámicos de nombre y apellido
    await creacionUsuario.datosDinamicosNombreApellido();

    // Modificamos el Rol
    await usuarioOwner.seleccionarTenant('TENANT PRUEBA');
    await usuarioOwner.seleccionarRol('no admin');

    // Guardamos
    await creacionUsuario.confirmar();

    // Validamos mensaje de éxito
    await expect(page.getByText('Usuario guardado con éxito.')).toBeVisible();
  });
});
