import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object para la gestión de Tenants en DexVision.
 * Migrado de Cypress a Playwright con TypeScript.
 */
export class TenantPage {
    readonly page: Page;

    // ── Locators ──────────────────────────────────────────────
    readonly createBtn: Locator;
    readonly tenantNameInput: Locator;
    readonly confirmBtn: Locator;
    readonly searchInput: Locator;
    readonly firstRow: Locator;
    readonly disableToggle: Locator;
    readonly confirmPopupBtn: Locator;
    readonly splitBtn: Locator;
    readonly okBtn: Locator;
    readonly editBtn: Locator;
    readonly maximumAgeInput: Locator;
    readonly minimumAgeInput: Locator;
    readonly saveRangeBtn: Locator;
    readonly deleteBtn: Locator;
    readonly rangeRows: Locator;
    readonly tenantRows: Locator;

    // ── Estado interno (reemplaza los aliases de Cypress) ────
    private _tenantName: string = '';
    private _realTenantName: string = '';
    private _initialRowCount: number = 0;

    constructor(page: Page) {
        this.page = page;

        // Botón para iniciar la creación de un nuevo tenant
        this.createBtn = page.locator('app-button-create button');

        // Campo de entrada para el nombre del nuevo tenant
        this.tenantNameInput = page.locator('input[id="name"]');

        // Botón para confirmar creación de tenant
        this.confirmBtn = page.locator('button', { hasText: 'Confirmar' });

        // Barra de búsqueda rápida de tabla
        this.searchInput = page.locator('input[placeholder="Buscar..."]');

        // Primera fila del listado devuelto
        this.firstRow = page.locator('.mat-mdc-row').first();

        // Interruptor de encendido/apagado (toggle) del tenant
        this.disableToggle = page.locator('#mat-mdc-slide-toggle-1-button');

        // Botón de confirmación definitiva en la ventana modal/emergente
        this.confirmPopupBtn = page.locator('button.confirm-button');

        // Botón de dividir rango en la primera fila que contiene '0'
        this.splitBtn = page.locator('tr').filter({ hasText: '0' }).first().locator('button').filter({ has: page.locator('mat-icon', { hasText: 'call_split' }) });

        // Botón de confirmación en modal
        this.okBtn = page.locator('button.confirm-button');

        // Botón de editar rango en la primera fila que contiene '0'
        this.editBtn = page.locator('tr').filter({ hasText: '0' }).first().locator('button').filter({ has: page.locator('mat-icon', { hasText: 'edit' }) });

        // Inputs de rango de edad
        this.maximumAgeInput = page.locator('input#upperBound');
        this.minimumAgeInput = page.locator('input#lowerBound');

        // Botón de guardar rango
        this.saveRangeBtn = page.locator('mat-dialog-actions').locator('button[mat-raised-button]');

        // Botón de eliminar (segunda fila, tercer botón)
        this.deleteBtn = page.locator('tbody tr').nth(1).locator('button').nth(2);

        // Filas de rangos etarios
        this.rangeRows = page.locator('tbody[role="rowgroup"] tr');

        // Filas de la tabla de tenants
        this.tenantRows = page.locator('.mat-mdc-row');
    }

    // ── GETTERS de estado ────────────────────────────────────

    get tenantName(): string {
        return this._tenantName;
    }

    get realTenantName(): string {
        return this._realTenantName;
    }

    // ── MÉTODOS DE VERIFICACIÓN ──────────────────────────────

    /** Guarda el conteo inicial de filas de rangos */
    private async saveInitialRowCount(): Promise<void> {
        // Esperamos a que la primera fila sea visible para asegurar que la tabla cargó
        await this.rangeRows.first().waitFor({ state: 'visible' });
        this._initialRowCount = await this.rangeRows.count();
        console.log(`Rangos iniciales: ${this._initialRowCount}`);
    }

    /** Verifica tooltip de éxito y que el conteo de filas cambió según lo esperado */
    async confirmSuccessfulRangeOperation(
        tooltipText: string,
        expectedChange: number
    ): Promise<void> {
        // Verificación 1: Tooltip de éxito visible
        await expect(this.page.locator(`text=${tooltipText}`)).toBeVisible();

        // Verificación 2: Conteo de filas cambió correctamente
        const expectedCount = this._initialRowCount + expectedChange;
        await expect(this.rangeRows).toHaveCount(expectedCount);

        const finalCount = await this.rangeRows.count();
        console.log(`Rangos finales: ${finalCount}`);
    }

    /** Confirma la creación exitosa del tenant */
    async confirmSuccessfulCreation(): Promise<void> {
        // Verificación 1: Tooltip de éxito
        await expect(this.page.getByText('Tenant creado con éxito')).toBeVisible();

        // Verificación 2: El tenant aparece en la lista al buscarlo
        await this.selectTenant(this._tenantName);
        console.log('Tenant creado con éxito');
    }

    /** Confirma la deshabilitación exitosa del tenant */
    async confirmSuccessfulDisablement(): Promise<void> {
        // Verificación 1: Tooltip de éxito
        await expect(this.page.getByText('Tenant deshabilitado con éxito')).toBeVisible();

        // Verificación 2: El tenant ya no aparece en la lista
        await this.typeSearchInput(this._realTenantName);
        await expect(this.tenantRows).toHaveCount(0);
    }

    // ── ACCIONES INDIVIDUALES ────────────────────────────────

    // ACCIONES DE CREACIÓN DE TENANT (CP7DV)

    /** Ejecuta el clic sobre el botón de crear */
    async clickCreateBtn(): Promise<void> {
        await this.createBtn.click();
    }

    /** Completa el campo de texto con el nombre especificado */
    async typeTenantName(name: string): Promise<void> {
        await this.tenantNameInput.fill(name);
    }

    /** Presiona el botón de confirmación final */
    async clickConfirmBtn(): Promise<void> {
        await expect(this.confirmBtn).toBeEnabled();
        await this.confirmBtn.click();
    }

    // ACCIONES DE DESHABILITACIÓN DE TENANT (CP8DV)

    /** Escribe el texto de búsqueda en el input de la tabla */
    async typeSearchInput(name: string): Promise<void> {
        await this.searchInput.clear();
        await this.searchInput.fill(name);
    }

    /** Selecciona el primer elemento que aparece en los resultados de la tabla */
    async clickFirstRow(): Promise<void> {
        await this.firstRow.click();
    }

    /** Presiona el conmutador (toggle) para cambiar el estado */
    async clickDisableToggle(): Promise<void> {
        await this.disableToggle.click();
    }

    /** Confirma el cambio del estado en el modal de confirmación */
    async clickConfirmPopup(): Promise<void> {
        await this.confirmPopupBtn.click();
    }

    // ACCIONES DE RANGOS ETARIOS (CP9DV)

    /** Presiona el botón de dividir rango */
    async clickSplitBtn(): Promise<void> {
        await this.saveInitialRowCount();
        await this.splitBtn.click();
    }

    /** Presiona el botón de editar rango */
    async clickEditBtn(): Promise<void> {
        await this.saveInitialRowCount();
        await this.editBtn.click();
    }

    /** Presiona el botón de eliminar rango */
    async clickDeleteBtn(): Promise<void> {
        await this.saveInitialRowCount();
        await this.deleteBtn.click();
    }

    /** Establece la edad mínima basándose en la máxima */
    async setMinimumAge(): Promise<void> {
        const maxAgeValue = await this.maximumAgeInput.inputValue();
        const newMinAge = Number(maxAgeValue) - 1;
        await this.minimumAgeInput.clear();
        await this.minimumAgeInput.fill(newMinAge.toString());
    }

    /** Presiona el botón de guardar rango */
    async clickSaveRangeBtn(): Promise<void> {
        await this.saveRangeBtn.click();
    }

    /** Presiona el botón OK de confirmación */
    async clickOkBtn(): Promise<void> {
        await this.okBtn.click();
    }

    // ── SECUENCIAS DE ACCIONES ───────────────────────────────

    /** Completa el flujo de creación de un tenant con un nombre dinámico */
    async createTenant(): Promise<void> {
        const dynamicName = `Tenant autom ${Date.now()}`;
        this._tenantName = dynamicName; // Guardamos el nombre para verificarlo luego

        await this.createBtn.click();
        await this.typeTenantName(dynamicName);
        await this.clickConfirmBtn();
        await this.confirmSuccessfulCreation();
    }

    /** Flujo para localizar y seleccionar un tenant específico por su nombre */
    async selectTenant(name: string): Promise<void> {
        // Buscar coincidencias
        await this.searchInput.fill(name);

        // Esperar a que la tabla se actualice con los resultados
        await expect(this.firstRow).toBeVisible();

        // Capturar el nombre real del tenant de la primera fila
        const firstCell = this.firstRow.locator('td').first();
        const textoGenuino = await firstCell.textContent();
        this._realTenantName = textoGenuino?.trim() ?? '';
        console.log(`Capturado tenant real: ${this._realTenantName}`);

        // Seleccionar primer resultado y esperar a que cargue la vista de detalle
        await this.clickFirstRow();
        await this.page.getByRole('heading', { name: 'DATOS DE TENANT' }).waitFor();
    }

    /** Flujo para desactivar/deshabilitar el tenant actualmente seleccionado */
    async disableTenant(): Promise<void> {
        await this.clickDisableToggle();   // Cambiar interruptor
        await this.clickConfirmPopup();    // Confirmar en ventana flotante
        await this.confirmSuccessfulDisablement(); // Verificar éxito
    }

    /** Flujo para dividir un rango etario del tenant */
    async splitTenantRangeAge(): Promise<void> {
        await this.clickSplitBtn();
        await this.clickOkBtn();
        await this.confirmSuccessfulRangeOperation('Rango dividido con éxito', 1);
    }

    /** Flujo para editar un rango etario del tenant */
    async editTenantRangeAge(): Promise<void> {
        await this.clickEditBtn();
        await this.setMinimumAge();
        await this.clickSaveRangeBtn();
        await this.confirmSuccessfulRangeOperation('Rango actualizado con éxito', 1);
    }

    /** Flujo para eliminar un rango etario del tenant */
    async deleteTenantRangeAge(): Promise<void> {
        await this.clickDeleteBtn();
        await this.clickOkBtn();
        await this.confirmSuccessfulRangeOperation('Rango eliminado con éxito', -1);
    }
}
