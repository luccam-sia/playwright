import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { TenantPage } from '../pages/TenantPage';

// Suite de pruebas para la gestión de tenants
test.describe('Crear tenant', () => {

    // Configuración que se ejecuta ANTES de cada test
    test.beforeEach(async ({ page }) => {
        // La autenticación ya fue realizada por el globalSetup
        // Redirige a la URL base de la aplicación
        await page.goto('/');
    });

    test('passes', async ({ page }) => {
        const mainPage = new MainPage(page);
        const tenantPage = new TenantPage(page);

        // Espera de seguridad para asegurar la carga completa de la UI
        await page.waitForLoadState('networkidle');

        // Ejecuta la acción de navegar hacia el menú de Tenant y entrar en dicha vista
        await mainPage.clickTenant();

        // Completa el formulario de creación con un nombre único y confirma la acción
        await tenantPage.createTenant();
    });
});
