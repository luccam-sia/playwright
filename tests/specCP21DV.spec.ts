import { test } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { DevicesPage } from '../pages/DevicesPage';

test.describe('Gestión de Dispositivos - Versiones', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('CP21DV: Debe permitir realizar el downgrade de versión de un dispositivo', async ({ page }) => {
        // Aumentamos el timeout del test para permitir esperas de actualización lentas
        test.setTimeout(90000);

        const mainPage = new MainPage(page);
        const devicesPage = new DevicesPage(page);

        const TARGET_VERSION = '1.10.0';

        await mainPage.clickDevices();
        
        await devicesPage.clickAssignTab();
        await devicesPage.typeSearchInput('APC358825210050');
        await devicesPage.verifyCurrentVersion(TARGET_VERSION);
        
        await devicesPage.clickSelectDevice('APC358825210050');
        await devicesPage.downgradeDeviceVersion(TARGET_VERSION);

        // Validamos con polling (asegura recargas constantes y evita timeouts)
        await devicesPage.verifyVersionUpdateWithPolling('APC358825210050', TARGET_VERSION);
    });
});
