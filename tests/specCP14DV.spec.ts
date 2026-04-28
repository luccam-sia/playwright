import { test } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { DevicesPage } from '../pages/DevicesPage';

/**
 * CP14DV: Reiniciar dispositivo por botonera.
 * Escenario: Se selecciona un dispositivo de la lista y se envía el comando de reinicio.
 */
test.describe('Comandos de Dispositivo - Reinicio', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Debe permitir enviar comando de reinicio a un dispositivo', async ({ page }) => {
        const mainPage = new MainPage(page);
        const devicesPage = new DevicesPage(page);

        // 1. Navegar a Dispositivos
        await mainPage.clickDevices();

        // 2. Localizar dispositivo y abrir botonera
        await devicesPage.commandsDevice('APC358825210050');

        // 3. Ejecutar comando de reinicio
        await devicesPage.rebootDevice();

        // 4. Verificar confirmación de éxito
        await devicesPage.checkSuccessfulReboot();
    });
});
