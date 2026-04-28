import { test } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { DevicesPage } from '../pages/DevicesPage';

/**
 * CP15DV: Pedir logs del dispositivo.
 * Escenario: Se captura la cantidad de logs actual, se solicita el envío de logs
 * y se verifica que el contador aumente tras la sincronización.
 */
test.describe('Comandos de Dispositivo - Enviar Logs', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Debe solicitar logs y verificar que el contador incremente', async ({ page }) => {
        const mainPage = new MainPage(page);
        const devicesPage = new DevicesPage(page);

        // 1. Navegar a Dispositivos
        await mainPage.clickDevices();

        // 2. Obtener conteo inicial de logs (entra al detalle y vuelve)
        await devicesPage.getLogsCount('APC358825210050');

        // 3. Solicitar envío de logs por botonera
        await devicesPage.commandsDevice('APC358825210050');
        await devicesPage.sendLogsDevice();

        // 4. Verificar éxito y que el contador aumentó (maneja espera interna de backend)
        await devicesPage.checkSuccessfulSendLogs();
    });
});
