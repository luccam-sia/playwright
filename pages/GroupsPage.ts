import { type Page, type Locator, expect } from '@playwright/test';

export class GroupsPage {
    readonly page: Page;
    readonly createBtn: Locator;
    readonly groupNameInput: Locator;
    readonly locationInput: Locator;
    readonly locationOption: Locator;
    readonly confirmBtn: Locator;
    readonly okBtn: Locator;
    readonly firstRow: Locator;
    readonly rowsGroups: Locator;
    readonly successCreateTooltip: Locator;
    readonly successDisableTooltip: Locator;
    readonly searchInput: Locator;
    readonly toggleDisable: Locator;
    readonly saveBtn: Locator;
    readonly groupCodeInput: Locator;
    readonly groupDescriptionInput: Locator;
    readonly groupEditNameInput: Locator;
    readonly locationEditInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createBtn = page.locator('app-button-create button');
        this.groupNameInput = page.locator('app-field-input[name="name"] input');
        this.locationInput = page.locator('app-field-autocomplete-single-selection[name="location"] input');
        this.locationOption = page.locator('mat-option').first();
        this.confirmBtn = page.locator('button:has-text("Confirmar")');
        this.okBtn = page.locator('button:has-text("Ok")');
        this.firstRow = page.locator('tbody tr').first();
        this.rowsGroups = page.locator('.mat-mdc-row');
        this.successCreateTooltip = page.locator('text=Grupo creado con éxito');
        this.successDisableTooltip = page.locator('text=Grupo actualizado con éxito');
        this.searchInput = page.locator('input[placeholder="Buscar..."]');
        this.toggleDisable = page.locator('app-slide-toggle-status mat-slide-toggle');
        this.saveBtn = page.locator('button:has-text("Guardar")');
        this.groupCodeInput = page.locator('app-field-input[name="code"] input');
        this.groupDescriptionInput = page.locator('app-field-textarea[name="description"] textarea').first();
        this.groupEditNameInput = page.locator('app-groups-form app-field-input[name="name"] input');
        this.locationEditInput = page.locator('app-field-autocomplete-single-selection[name="location"] input');
    }

    async clickCreateBtn() {
        await this.createBtn.click();
    }

    async typeGroupName(name: string) {
        await this.groupNameInput.fill(name);
    }

    async typeSearchInput(name: string) {
        await this.searchInput.fill(name);
        // Wait for search to filter
        await this.page.waitForTimeout(1000);
    }

    async clickLocation() {
        await this.locationInput.click();
        await this.locationOption.click();
    }

    async clickConfirmBtn() {
        await this.confirmBtn.click();
    }

    async clickFirstRow() {
        await this.firstRow.click();
    }

    async clickToggleDisable() {
        await this.toggleDisable.click();
    }

    async clickOkBtn() {
        await this.okBtn.click();
    }

    async clickSaveBtn() {
        // Esperar a que el indicador de carga desaparezca si está bloqueando la pantalla
        const loading = this.page.locator('app-loading-indicator .spinner-container');
        await loading.waitFor({ state: 'hidden' }).catch(() => { });

        await this.saveBtn.waitFor({ state: 'visible' });
        await this.saveBtn.click();

        // Wait for success tooltip
        await expect(this.successDisableTooltip).toBeVisible();
    }

    async typeGroupCode(code: string) {
        await this.groupCodeInput.fill(code);
        return code;
    }

    async typeGroupDescription(description: string) {
        await this.groupDescriptionInput.fill(description);
        return description;
    }

    async typeGroupEditName(name?: string) {
        const dynamicName = name || `Grupo editado - ${Date.now()}`;
        await this.groupEditNameInput.fill(dynamicName);
        return dynamicName;
    }

    async selectGroup(name: string) {
        await this.typeSearchInput(name);
        const nameInTable = await this.firstRow.locator('td').nth(1).innerText();
        await this.clickFirstRow();
        return nameInTable.trim();
    }

    async clickLocationEdit() {
        await this.locationEditInput.click();
    }

    async selectDifferentLocation() {
        const currentLocation = await this.locationEditInput.inputValue();
        await this.locationEditInput.click();

        // Wait for options to appear
        const options = this.page.locator('mat-option');
        await options.first().waitFor({ state: 'visible' });

        const count = await options.count();
        let selectedLocation = '';

        for (let i = 0; i < count; i++) {
            const optionText = await options.nth(i).innerText();
            if (optionText.trim() !== currentLocation.trim()) {
                await options.nth(i).click();
                await this.page.waitForTimeout(500);
                selectedLocation = await this.locationEditInput.inputValue();
                break;
            }
        }

        if (!selectedLocation) {
            throw new Error('No alternative location found in the list');
        }

        console.log(`Selected new location: "${selectedLocation}"`);
        return selectedLocation;
    }

    async createGroup() {
        const dynamicName = `Grupo autom ${Date.now()}`;
        await this.clickCreateBtn();
        await this.typeGroupName(dynamicName);
        await this.clickLocation();
        await this.confirmBtn.waitFor({ state: 'visible' });
        await this.clickConfirmBtn();
        return dynamicName;
    }

    async disableGroup() {
        await this.clickToggleDisable();

        // Esperar a que el botón OK del diálogo de confirmación aparezca y sea clickeable
        await this.okBtn.waitFor({ state: 'visible' });
        await this.clickOkBtn();

        // Esperar a que el diálogo se cierre completamente. 
        // La deshabilitación es automática según feedback del usuario.
        await this.okBtn.waitFor({ state: 'hidden' });
    }

    async confirmSuccessfulCreation(name: string) {
        await expect(this.successCreateTooltip).toBeVisible();
        await this.selectGroup(name);
    }

    async confirmSuccessfulDisablement(name: string) {
        // Según feedback: no hay toast, el grupo simplemente desaparece de la tabla.
        await this.typeSearchInput(name);

        // Esperamos a que la fila desaparezca (Playwright reintentará esta aserción hasta el timeout)
        await expect(this.rowsGroups).toHaveCount(0);
    }

    async confirmSuccessfulEdit(name: string, code: string, description: string) {
        await this.typeSearchInput(name);
        await expect(this.rowsGroups).toHaveCount(1);
        await this.clickFirstRow();
        await expect(this.groupCodeInput).toHaveValue(code);
        await expect(this.groupDescriptionInput).toHaveValue(description);
    }

    async confirmSuccessfulEditLocation(name: string, expectedLocation: string) {
        await this.typeSearchInput(name);
        await this.clickFirstRow();
        await expect(this.locationEditInput).toHaveValue(expectedLocation);
    }
}
