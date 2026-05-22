import { test } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { DevicesPage } from '../pages/DevicesPage';

/**
 * CP13DV: Baja y Alta de dispositivo.
 * Escenario: Se busca un dispositivo asignado, se elimina (pasa a sin asignar) 
 * y luego se vuelve a asignar a un tenant y locación.
 */
test.describe('Gestión de Dispositivos - Baja y Alta', () => {
    
    test.beforeEach(async ({ page }) => {
        // La sesión se recupera automáticamente desde storageState configurado en playwright.config.ts
        await page.goto('/');
    });

    test('Debe permitir dar de baja un dispositivo y volver a asignarlo', async ({ page }) => {
        const mainPage = new MainPage(page);
        const devicesPage = new DevicesPage(page);

        // 1. Navegar a Dispositivos
        await mainPage.clickDevices();

        // 2. Buscar dispositivo asignado (APC358825210055 es el del test original)
        // Nota: searchDevice captura el código del dispositivo internamente
        await devicesPage.searchDevice('APC358825210055');

        // 3. Eliminar dispositivo (queda sin asignar)
        await devicesPage.deleteDevice();

        // 4. Ir a Sin Asignar, buscarlo por código y volver a asignarlo
        await devicesPage.assignDevice('QA', 'Oficina SIA');

        // 5. Verificar que vuelve a aparecer en la lista de asignados
        await devicesPage.clickBackButton();
        await devicesPage.clickAssignTab();
        await devicesPage.typeSearchInput('APC358825210055');
        // Si clickSelectDevice pasa, es que el dispositivo está ahí
        await devicesPage.clickSelectDevice('APC358825210055');
    });
});
