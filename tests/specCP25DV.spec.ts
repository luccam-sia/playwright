import { test } from '@playwright/test';
import { loginSession } from '../auth/login';
import { CamaraPage } from '../pages/camaraPage';

test.describe('Modificar Tenant y Locación de cámara', () => {
    // Ejecución ANTES de cada test
    test.beforeEach(async ({ page }) => {
        await loginSession(page);
        // Luego de login, ir a la página principal
        await page.goto('/');
    });

    test('Debe modificar el tenant y la locación de una cámara existente', async ({ page }) => {
        const camaraPage = new CamaraPage(page);

        // Acceder a sección Cámaras
        await camaraPage.clickBtnCamaras();

        // Asegurar tenant QA para buscar la cámara
        await camaraPage.asegurarTenantCorrecto('QA');

        // Buscar cámara dinámica
        await camaraPage.buscarCamara('Nombre_Cam_');

        // Ingresar a la cámara
        await camaraPage.ingresarCamaraDinamica();

        // 1- Modificar Tenant a "TENANT PRUEBA"
        await camaraPage.seleccionarTenantForm('TENANT PRUEBA');

        // 2- Modificar Locación a "Locacion Prueba"
        await camaraPage.seleccionarLocacion('Locacion Prueba');

        // Guardar cambios
        await camaraPage.guardar();

        // Validar mensaje de éxito: "Cámara guardada con éxito."
        // (Incluye la espera robusta del listado implementada anteriormente)
        await camaraPage.validacionExitosaModificacion();
    });
});
