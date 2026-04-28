import { test } from '@playwright/test';
import { loginSession } from '../auth/login';
import { CamaraPage } from '../pages/camaraPage';

test.describe('Reasignar locación de cámara', () => {
    // Ejecución ANTES de cada test
    test.beforeEach(async ({ page }) => {
        await loginSession(page);
        // Luego de login, ir a la página principal
        await page.goto('/');
    });

    test('Debe reasignar la locación de una cámara a LOC QA 2', async ({ page }) => {
        const camaraPage = new CamaraPage(page);

        // Acceder a sección Cámaras
        await camaraPage.clickBtnCamaras();

        // Asegurar tenant QA (Siguiendo patrón del spec anterior)
        await camaraPage.asegurarTenantCorrecto('QA');

        // Buscar cámara dinámica
        await camaraPage.buscarCamara('Nombre_Cam_');

        // Ingresar a la cámara
        await camaraPage.ingresarCamaraDinamica();

        // Reasignar locación a "LOC QA 2"
        await camaraPage.seleccionarLocacion('LOC QA 2');

        // Guardar cambios
        await camaraPage.guardar();

        // Validar mensaje de éxito: "Cámara actualizada con éxito."
        await camaraPage.validacionExitosaModificacion();
    });
});
