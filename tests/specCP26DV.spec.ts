import { test } from '@playwright/test';
import { loginSession } from '../auth/login';
import { CamaraPage } from '../pages/camaraPage';

test.describe('Asignar cámara a un Grupo', () => {
    // Ejecución ANTES de cada test
    test.beforeEach(async ({ page }) => {
        await loginSession(page);
        // Luego de login, ir a la página principal
        await page.goto('/');
    });

    test('Debe asignar una cámara existente al grupo GRUPO PANTALLAS LAB', async ({ page }) => {
        const camaraPage = new CamaraPage(page);

        // Acceder a sección Cámaras
        await camaraPage.clickBtnCamaras();

        // Asegurar tenant QA
        await camaraPage.asegurarTenantCorrecto('QA');

        // Buscar cámara dinámica
        await camaraPage.buscarCamara('Nombre_Cam_');

        // Ingresar a la cámara
        await camaraPage.ingresarCamaraDinamica();

        // Asignar al grupo "GRUPO PANTALLAS LAB"
        await camaraPage.seleccionarGrupo('GRUPO PANTALLAS LAB');

        // Guardar cambios
        await camaraPage.guardar();

        // Validar mensaje de éxito: "Cámara guardada con éxito."
        await camaraPage.validacionExitosaModificacion();
    });
});
