import { test } from '@playwright/test';
import { MainPage, GroupsPage } from '../pages';

test.describe('Creación de un nuevo grupo', () => {

    test.beforeEach(async ({ page }) => {
        // Redirige a la URL base de la aplicación (asume login previo)
        await page.goto('/');
    });

    test('Crear grupo exitosamente', async ({ page }) => {
        const mainPage = new MainPage(page);
        const groupsPage = new GroupsPage(page);

        // Espera de seguridad para asegurar la carga completa de la UI
        await page.waitForLoadState('networkidle');

        // Navegar a la sección de Grupos
        await mainPage.clickGroups();

        // Crear un nuevo grupo con nombre dinámico
        const groupName = await groupsPage.createGroup();

        // Confirmar que el grupo se creó correctamente
        await groupsPage.confirmSuccessfulCreation(groupName);
    });
});
