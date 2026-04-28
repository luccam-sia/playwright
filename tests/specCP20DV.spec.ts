import { test } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { DevicesPage } from '../pages/DevicesPage';

test.describe('Gestión de Dispositivos - Versiones', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('CP20DV: Debe permitir realizar el upgrade de versión de un dispositivo', async ({ page }) => {
        // Aumentamos el timeout del test para permitir esperas de actualización lentas (1 minuto o más)
        test.setTimeout(90000);

        const mainPage = new MainPage(page);
        const devicesPage = new DevicesPage(page);

        const TARGET_VERSION = '1.10.1';

        await mainPage.clickDevices();

        // Entramos a los asignados y verificamos pre-condición
        await devicesPage.clickAssignTab();
        await devicesPage.typeSearchInput('APC358825210050');
        await devicesPage.verifyCurrentVersion(TARGET_VERSION);

        // Entramos al detalle y actualizamos
        await devicesPage.clickSelectDevice('APC358825210050');
        await devicesPage.updateDeviceVersion(TARGET_VERSION);

        // Validamos con polling (evita el hard wait de 60s que causaba el timeout)
        await devicesPage.verifyVersionUpdateWithPolling('APC358825210050', TARGET_VERSION);
    });
});
