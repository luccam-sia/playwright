import { test, expect } from '@playwright/test';
import { loginSession } from '../auth/login';
import { RolPage } from '../pages/rolPage.page';
import { CreacionUsuarioPage } from '../pages/creacionUsuario.page';
import { UsuarioUserPage } from '../pages/usuarioUser.page';

test.describe('Creacion y asignacion de rol', () => {
  // Ejecución ANTES de cada test
  test.beforeEach(async ({ page }) => {
    await loginSession(page);
    // Luego de login, ir a la página principal
    await page.goto('/');
  });

  test('passes', async ({ page }) => {
    const rolPage = new RolPage(page);
    const creacionUsuario = new CreacionUsuarioPage(page);
    const usuarioUser = new UsuarioUserPage(page);

    // Acceder a sección Rol
    await rolPage.clickBtnRoles();

    // Clic en botón "+"
    await rolPage.clickBtnMas();

    // Crear rol con datos dinámicos
    const nombreRol = await rolPage.datosDinamicosRol();
    await rolPage.typeDescripcionRol('Descripcion Automatizacion');
    await rolPage.seleccionarTenant('tenant nuevo');
    await rolPage.seleccionarTodosLosPermisos();
    await rolPage.guardado();

    // Validamos mensaje
    await rolPage.validacionExitosa();

    // Dirigirse a sección de usuarios
    await creacionUsuario.clickUsuarios();
    await usuarioUser.limpiarBusqueda();
    await creacionUsuario.clickUsuarioLista();

    // Gestionar Super Admin y asignar roles
    await creacionUsuario.gestionarSuperAdminYAsignarRoles();
    await usuarioUser.seleccionarTenant('tenant nuevo');

    // Asignar el rol dinámico creado anteriormente
    await usuarioUser.seleccionarRolDinamico(nombreRol);

    await usuarioUser.confirmarUser();
  });
});
