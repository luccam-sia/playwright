import { expect, test } from '@playwright/test';
import { MainPage, InferencePage } from '../pages';

test.describe('Filtro de inferencias por Fecha', () => {

    test.beforeEach(async ({ page }) => {
        // Redirige a la URL base de la aplicación (asume login previo)
        await page.goto('/');
    });

    test('El filtro de inferencias por fecha funciona', async ({ page }) => {
        const mainPage = new MainPage(page);
        const inferencePage = new InferencePage(page);

        // Espera de seguridad para asegurar la carga completa de la UI
        await page.waitForLoadState('networkidle');

        // Navegar a la sección de Grupos
        await mainPage.clickInferences();

        await inferencePage.clickFilters();

        await inferencePage.selectDate();

        await inferencePage.getDateInput();

        await inferencePage.clickConfirmFilterBtn();

    });
});
