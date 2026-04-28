import { test } from '@playwright/test';
import { loginSession } from '../auth/login';
import { CamaraPage } from '../pages/camaraPage.page';

test.describe('Deshabilitar cámara', () => {
    // Ejecución ANTES de cada test
    test.beforeEach(async ({ page }) => {
        await loginSession(page);
        // Luego de login, ir a la página principal
        await page.goto('/');
    });

    test('passes', async ({ page }) => {
        const camaraPage = new CamaraPage(page);

        // Acceder a sección Cámaras
        await camaraPage.clickBtnCamaras();

        // Acceder a un registro asegurando el tenant correcto "QA"
        await camaraPage.asegurarTenantCorrecto('QA');

        // Buscar la cámara dinámica en el listado para asegurar que sea visible
        await camaraPage.buscarCamara('Nombre_Cam_');

        // Acceder a una cámara dinámica que empiece con "Nombre_Cam_"
        await camaraPage.ingresarCamaraDinamica();

        // Desactivar la cámara
        await camaraPage.desactivarCamara();

        // Validar mensaje de éxito: "Cámara deshabilitada con éxito."
        await camaraPage.validacionExitosaDesactivacion();
    });
});
