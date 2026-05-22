import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object para la sección de Dispositivos de DexVision.
 * Maneja búsquedas, flujos de alta/baja, comandos de botonera y validación de logs.
 */
export class DevicesPage {
    readonly page: Page;

    // ── Locators ──────────────────────────────────────────────
    readonly searchInput: Locator;
    readonly firstRow: Locator;
    readonly deleteDeviceBtn: Locator;
    readonly confirmPopupBtn: Locator;
    readonly assignTab: Locator;
    readonly unassignTab: Locator;
    readonly checkboxDevice: Locator;
    readonly assignBtn: Locator;
    readonly tenantSearchInput: Locator;
    readonly locationSearchInput: Locator;
    readonly matOption: (text: string, exact?: boolean) => Locator;
    readonly okBtn: Locator;
    readonly actionsBtn: Locator;
    readonly rebootOption: Locator;
    readonly logsOption: Locator;
    readonly successActionTooltip: Locator;
    readonly settingsTab: Locator;
    readonly logsBadge: Locator;
    readonly backBtn: Locator;
    readonly statusIndicator: Locator;
    readonly toggleBtn: Locator;
    readonly versionSelect: Locator;
    readonly saveBtn: Locator;
    readonly boxVersion: Locator;
    readonly successActionTooltipModify: Locator;

    // ── Estado interno ───────────────────────────────────────
    private _deviceCode: string = '';
    private _initialLogsCount: number = 0;

    constructor(page: Page) {
        this.page = page;

        this.searchInput = page.locator('input[placeholder="Buscar por nombre o código"]');
        this.firstRow = page.locator('.mat-mdc-row').first();

        this.deleteDeviceBtn = page.locator('button', { hasText: 'Eliminar dispositivo' });
        this.confirmPopupBtn = page.locator('mat-dialog-actions button.confirm-button');

        this.assignTab = page.locator('div[role="tab"]', { hasText: 'Dispositivos Asignados' });
        this.unassignTab = page.locator('div[role="tab"]', { hasText: 'Dispositivos Sin Asignar' });

        // El checkbox de la primera fila de datos (evitando el de la cabecera)
        this.checkboxDevice = page.locator('.cdk-column-select mat-checkbox').nth(1);

        this.assignBtn = page.locator('button', { hasText: 'Asignar' });

        this.tenantSearchInput = page.locator('mat-dialog-container app-field-autocomplete-single-selection[name="tenant"] input');
        this.locationSearchInput = page.locator('mat-dialog-container app-field-autocomplete-single-selection[name="location"] input');
        this.matOption = (text: string, exact: boolean = true) => page.getByRole('option', { name: text, exact });

        this.okBtn = page.locator('mat-dialog-actions button', { hasText: 'Ok' });

        this.actionsBtn = page.locator('app-action-commands button', { hasText: 'Más acciones' });
        this.rebootOption = page.locator('.option', { hasText: 'Reiniciar' }).locator('button');
        this.logsOption = page.locator('.option', { hasText: 'Enviar Logs' }).locator('button');

        this.successActionTooltip = page.locator('text=Acción ejecutada con éxito');

        this.settingsTab = page.locator('div[role="tab"]', { hasText: 'Configuración' });
        this.logsBadge = page.locator('mat-list-item', { hasText: 'Logs' }).locator('.mat-mdc-list-item-meta span');
        this.backBtn = page.locator('app-back-button button', { hasText: 'Volver' });

        this.statusIndicator = page.locator('app-status-indicator p');
        this.toggleBtn = page.locator('app-slide-toggle-status mat-slide-toggle');
        this.versionSelect = page.locator('mat-select[data-name="build"]');
        this.saveBtn = page.getByRole('button', { name: 'Guardar', exact: true });
        this.boxVersion = page.locator('.mat-mdc-row').first().locator('.cdk-column-buildVersion');
        this.successActionTooltipModify = page.locator('text=Dispositivo actualizado con éxito');
    }

    // ── ACCIONES INDIVIDUALES ────────────────────────────────

    async clickBackButton(): Promise<void> {
        await this.backBtn.click();
    }

    /** Escribe en el filtro de búsqueda y espera a que la tabla se actualice */
    async typeSearchInput(name: string): Promise<void> {
        await this.searchInput.clear();
        await this.searchInput.fill(name);
        // Esperamos a que la fila contenga el texto buscado (o desaparezca si buscamos algo que borramos)
        // No usamos waitForTimeout sino esperas inteligentes basadas en el estado deseado en el test.
    }

    /** Selecciona un dispositivo, captura su código y entra al detalle */
    async clickSelectDevice(expectedText?: string): Promise<void> {
        if (expectedText) {
            await expect(this.firstRow).toContainText(expectedText);
        }

        // Capturamos el código del dispositivo para usarlo luego como referencia única
        const codeCell = this.firstRow.locator('td.cdk-column-code');
        this._deviceCode = (await codeCell.textContent())?.trim() ?? '';
        console.log(`Código capturado: ${this._deviceCode}`);

        // Hacemos clic para ingresar
        await this.firstRow.click();
        // Esperamos a que cargue la vista de detalle
        // await expect(this.settingsTab).toBeVisible();
    }

    /** Abre la pestaña de Configuración si no está activa */
    async clickSettingsTab(): Promise<void> {
        const isSelected = await this.settingsTab.getAttribute('aria-selected');
        if (isSelected === 'false') {
            await this.settingsTab.click();
        }
    }

    /** Abre la pestaña de Dispositivos Asignados */
    async clickAssignTab(): Promise<void> {
        await this.assignTab.click();
        // Verificamos que la pestaña esté seleccionada en lugar de buscar filas
        await expect(this.assignTab).toHaveAttribute('aria-selected', 'true');
    }

    /** Abre la pestaña de Dispositivos Sin Asignar */
    async clickUnassignTab(): Promise<void> {
        await this.unassignTab.click();
        // Verificamos que la pestaña esté seleccionada
        await expect(this.unassignTab).toHaveAttribute('aria-selected', 'true');
    }

    // ── FLUJOS COMPLEJOS (SECUENCIAS) ─────────────────────────

    /** Busca un dispositivo y entra a su detalle */
    async searchDevice(name: string): Promise<void> {
        await this.clickAssignTab();
        await this.typeSearchInput(name);
        await this.clickSelectDevice(name);
    }

    /** Borra el dispositivo actualmente seleccionado */
    async deleteDevice(): Promise<void> {
        await this.deleteDeviceBtn.click();
        await this.confirmPopupBtn.click();
        // Esperamos que el botón de borrar ya no esté (indicando que volvimos a la lista)
        await expect(this.deleteDeviceBtn).not.toBeVisible();
    }

    /** Asigna el dispositivo (usando el código capturado previamente) a un tenant y ubicación */
    async assignDevice(tenantName: string = 'QA', locationName: string = 'Oficina SIA'): Promise<void> {
        await this.clickUnassignTab();

        // Usamos el código que capturamos antes de borrarlo
        await this.typeSearchInput(this._deviceCode);
        await this.checkboxDevice.click();
        await this.assignBtn.click();

        // Completar modal de asignación
        await this.tenantSearchInput.fill(tenantName);
        await this.matOption(tenantName).click();

        await this.locationSearchInput.fill(locationName);
        await this.matOption(locationName).click();

        await this.okBtn.click();

        // Esperamos que se cierre el modal (confirmado por tooltip o desaparición de botón Ok)
        await expect(this.okBtn).not.toBeVisible({ timeout: 10000 });
    }

    /** Prepara acciones: busca en tabla, marca checkbox y abre 'Más acciones' */
    async commandsDevice(name: string): Promise<void> {
        await this.clickAssignTab();
        await this.typeSearchInput(name);
        await this.checkboxDevice.click();
        await this.actionsBtn.click();
    }

    /** Ejecuta reinicio */
    async rebootDevice(): Promise<void> {
        await this.rebootOption.click();
        await this.okBtn.click();
    }

    /** Ejecuta envío de logs */
    async sendLogsDevice(): Promise<void> {
        await this.logsOption.click();
        await this.okBtn.click();
    }

    /** Deshabilita el dispositivo (desde el detalle) */
    async disableDevice(): Promise<void> {
        await this.toggleBtn.click();

        // El modal de confirmación puede tardar un instante en aparecer
        const modalOkBtn = this.page.locator('mat-dialog-container button', { hasText: 'Ok' });
        await modalOkBtn.waitFor({ state: 'visible', timeout: 5000 });
        await modalOkBtn.click();

        await expect(this.statusIndicator).toContainText('Deshabilitado');
    }

    /** Habilita el dispositivo (desde el detalle) */
    async enableDevice(): Promise<void> {
        await this.toggleBtn.click();
        await expect(this.statusIndicator).not.toContainText('Deshabilitado');
    }

    /** Realiza un ciclo de deshabilitar/habilitar adaptándose al estado actual */
    async executeToggleCycle(name: string): Promise<void> {
        await this.typeSearchInput(name);

        // Wait for the table to filter before reading the status
        await expect(this.firstRow).toContainText(name);
        const rowStatus = this.firstRow.locator('app-status-indicator p');
        await expect(rowStatus).toBeVisible();
        const statusText = await rowStatus.textContent();

        if (statusText?.includes('Deshabilitado')) {
            console.log('Detectado: Deshabilitado. Ejecutando ciclo: Habilitar -> Deshabilitar');
            await this.clickSelectDevice(name);
            await this.enableDevice();

            // Re-ingresamos para deshabilitar (la app vuelve al listado tras habilitar/deshabilitar)
            await this.clickSelectDevice(name);
            await this.disableDevice();
        } else {
            console.log('Detectado: Habilitado. Ejecutando ciclo: Deshabilitar -> Habilitar');
            await this.clickSelectDevice(name);
            await this.disableDevice();

            // Re-ingresamos para habilitar
            await this.clickSelectDevice(name);
            await this.enableDevice();
        }
    }

    /** Flujo para actualizar la versión del dispositivo (Upgrade) */
    async updateDeviceVersion(version: string = '1.10.1'): Promise<void> {
        await this.clickSettingsTab();
        await this.versionSelect.click();
        await this.matOption(version, false).click();
        await this.saveBtn.click();
        await expect(this.successActionTooltipModify).toBeVisible();
    }

    /** Flujo para bajar la versión del dispositivo (Downgrade) */
    async downgradeDeviceVersion(version: string = '1.10.0'): Promise<void> {
        await this.clickSettingsTab();
        await this.versionSelect.click();
        await this.matOption(version, false).click();
        await this.saveBtn.click();
        await expect(this.successActionTooltipModify).toBeVisible();
    }

    /** Verifica que la versión instalada en la tabla coincida con la esperada */
    async checkBoxVersion(targetVersion: string): Promise<void> {
        const versionText = await this.boxVersion.textContent();
        expect(versionText?.trim()).toBe(targetVersion);
    }

    /** 
     * Polling para verificar la actualización de versión. 
     * Recarga la página y busca el dispositivo hasta que la versión coincida.
     */
    async verifyVersionUpdateWithPolling(name: string, targetVersion: string): Promise<void> {
        const startTime = Date.now();
        const timeout = 60000;
        const interval = 10000;

        while (Date.now() - startTime < timeout) {
            console.log(`--- Reintentando verificación de versión (Tiempo: ${Math.round((Date.now() - startTime) / 1000)}s) ---`);

            await this.page.reload();
            await this.page.waitForLoadState('load');

            await this.clickAssignTab();
            await this.typeSearchInput(name);

            const currentVersion = await this.boxVersion.textContent();
            const cleanVersion = currentVersion?.trim();
            console.log(`Versión encontrada: ${cleanVersion} | Requerida: ${targetVersion}`);

            if (cleanVersion === targetVersion) {
                console.log("¡Versización actualizada!");
                return;
            }

            await this.page.waitForTimeout(interval);
        }

        throw new Error(`Timeout: La versión de ${name} no cambió a ${targetVersion} tras 1 minuto.`);
    }

    /** Pre-check para evitar instalar la misma versión */
    async verifyCurrentVersion(targetVersion: string): Promise<void> {
        await expect(this.boxVersion).toBeVisible();
        const versionText = await this.boxVersion.textContent();
        expect(versionText?.trim()).not.toBe(targetVersion);
    }

    /** Captura la cantidad de logs actual y luego vuelve atrás */
    async getLogsCount(name: string): Promise<void> {
        await this.searchDevice(name);
        await this.clickSettingsTab();

        const countText = await this.logsBadge.textContent();
        this._initialLogsCount = parseInt(countText?.trim() ?? '0', 10);
        console.log(`Logs iniciales: ${this._initialLogsCount}`);

        await this.backBtn.click();
    }

    /** Verifica éxito del comando de reinicio */
    async checkSuccessfulReboot(): Promise<void> {
        await expect(this.successActionTooltip).toBeVisible();
    }

    /** Verifica envío de logs y que el contador aumentó (con reintentos) */
    async checkSuccessfulSendLogs(): Promise<void> {
        await expect(this.successActionTooltip).toBeVisible();

        // Re-ingresamos al detalle para empezar el ciclo de monitoreo
        await this.clickAssignTab();
        await this.typeSearchInput(this._deviceCode || 'APC');
        await this.clickSelectDevice();

        // Ciclo de: Recargar -> Esperar -> Validar -> Reintentar
        await expect(async () => {
            console.log("--- Iniciando intento de validación de logs (refrescando página) ---");

            await this.page.reload();
            await this.page.waitForLoadState('load'); // Esperamos carga completa

            await this.clickSettingsTab();

            const currentBadge = this.logsBadge;
            const currentText = await currentBadge.textContent();
            const currentCount = parseInt(currentText?.trim() ?? '0', 10);

            console.log(`Logs - Actual: ${currentCount} | Inicial: ${this._initialLogsCount}`);

            // Si esto falla, toPass volverá a ejecutar desde el console.log inicial
            expect(currentCount).toBeGreaterThan(this._initialLogsCount);
        }).toPass({
            intervals: [10000],
            timeout: 90000
        });
    }
}
