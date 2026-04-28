import { test } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { DevicesPage } from '../pages/DevicesPage';

test.describe('Gestión de Dispositivos - Estado', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('CP19DV: Debe permitir alternar el estado (Habilitado/Deshabilitado) del dispositivo', async ({ page }) => {
        const mainPage = new MainPage(page);
        const devicesPage = new DevicesPage(page);

        await mainPage.clickDevices();
        await devicesPage.executeToggleCycle('APC358825210050');
    });
});
