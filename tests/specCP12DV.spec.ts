import { test } from '@playwright/test';
import { loginSession } from '../auth/login';
import { RolPage } from '../pages/rolPage';

test.describe('Modificar rol', () => {
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

        // Acceder a un rol dinámico para modificarlo
        // (Debe ser un rol que comience con Rol_ y no contenga "editado")
        await rolPage.ingresarRolDinamicoSinEditar();

        // 1-Modificar nombre agregando "editado"
        const nombreActual = await rolPage.inputNombreRol.inputValue();
        await rolPage.typeNombreRol(`${nombreActual} editado`);

        // 2-Modificar descripcion agregando "editado"
        const descripcionActual = await rolPage.inputDescripcionRol.inputValue();
        await rolPage.typeDescripcionRol(`${descripcionActual} editado`);

        // 3-Agregar un nuevo tenant: "TNT AUTOM"
        // Nota: El método seleccionarTenant de RolPage ya incluye el clic por fuera
        // (en tituloRol) para contraer el desplegable, solucionando el issue mencionado.
        await rolPage.seleccionarTenant('TNT AUTOM');

        // Guardar los cambios
        await rolPage.guardado();

        // Validar mensaje de éxito
        await rolPage.validacionExitosaModificacion();
    });
});
