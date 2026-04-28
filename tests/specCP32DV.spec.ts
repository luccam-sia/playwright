import { test } from '@playwright/test';
import { MainPage, InferencePage } from '../pages';

test.describe('Cambiar locación de un grupo', () => {

    test.beforeEach(async ({ page }) => {
        // Redirige a la URL base de la aplicación (asume login previo)
        await page.goto('/');
    });

    test('Verificar el registro de inferencias sin contexto', async ({ page }) => {
        const mainPage = new MainPage(page);
        const inferencePage = new InferencePage(page);

        // Espera de seguridad para asegurar la carga completa de la UI
        await page.waitForLoadState('networkidle');

        // Navegar a la sección de Inferences
        await mainPage.clickInferences();

    });
});
