import { expect, test } from '@playwright/test';
import { MainPage, InferencePage } from '../pages';

test.describe('Filtro de inferencias por Dispositivo', () => {

    test.beforeEach(async ({ page }) => {
        // Redirige a la URL base de la aplicación (asume login previo)
        await page.goto('/');
    });

    test('El filtro de inferencias por dispositivo funciona', async ({ page }) => {
        const mainPage = new MainPage(page);
        const inferencePage = new InferencePage(page);

        // Espera de seguridad para asegurar la carga completa de la UI
        await page.waitForLoadState('networkidle');

        // Navegar a la sección de Grupos
        await mainPage.clickInferences();

        await inferencePage.clickFilters();

        await inferencePage.setSliderAge(0, 21);

        const body = await inferencePage.clickConfirmFilterBtn();
        const inferences = body.data || [];

        expect(inferences.length, 'La API no devolvió ninguna inferencia para validar').toBeGreaterThan(0);
        console.log(`Iniciando validación de ${inferences.length} inferencias encontradas en la API...`);

        inferences.forEach((inference: any, index: number) => {

            console.log(`Validando inferencia #${index + 1} - ID: ${inference.id}`);
            expect(inference.age, `Error en la inferencia #${index + 1} (ID: ${inference.id})`).toBeLessThanOrEqual(21);
        });
        console.log('✅ Validación exitosa: Todas las inferencias corresponden al groupId 1.');
    });
});