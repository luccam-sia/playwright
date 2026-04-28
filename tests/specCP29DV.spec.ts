import { test } from '@playwright/test';
import { MainPage, GroupsPage } from '../pages';

test.describe('Deshabilitar un grupo', () => {

    test.beforeEach(async ({ page }) => {
        // Redirige a la URL base de la aplicación (asume login previo)
        await page.goto('/');
    });

    test('Deshabilitar grupo exitosamente', async ({ page }) => {
        const mainPage = new MainPage(page);
        const groupsPage = new GroupsPage(page);

        // Espera de seguridad para asegurar la carga completa de la UI
        await page.waitForLoadState('networkidle');

        // Navegar a la sección de Grupos
        await mainPage.clickGroups();

        // Seleccionar un grupo (por ejemplo, uno que empiece con "Grupo autom")
        const groupName = await groupsPage.selectGroup('Grupo autom');

        // Deshabilitar el grupo seleccionado
        await groupsPage.disableGroup();

        // Confirmar que el grupo se deshabilitó correctamente
        await groupsPage.confirmSuccessfulDisablement(groupName);
    });
});
