import { type Page, type Locator } from '@playwright/test';

export class InferencePage {
    readonly page: Page;

    // ── Locators ──────────────────────────────────────────────
    readonly filtersBtn: Locator;
    readonly dateSelector: Locator;
    readonly dateBtn: Locator;
    readonly confirmFilterBtn: Locator;
    readonly resetFilterBtn: Locator;
    readonly deviceSelector: Locator;
    readonly deviceSelectorOption: Locator;
    readonly locationSelector: Locator;
    readonly locationSelectorOption: Locator;
    readonly groupSelector: Locator;
    readonly groupSelectorOption: Locator;
    readonly sliderMin: Locator;
    readonly sliderMax: Locator;
    readonly dateInput: Locator;

    constructor(page: Page) {
        this.page = page;

        this.dateSelector = page.locator('mat-datepicker-toggle button');
        this.dateBtn = page.locator('.mat-calendar-body-today');
        this.dateInput = page.locator('mat-date-range-input input');
        this.filtersBtn = page.locator('app-inferences-filters button');
        this.confirmFilterBtn = page.locator('button').filter({ hasText: 'Filtrar' });
        this.resetFilterBtn = page.locator('button').filter({ hasText: 'Resetear todos' });
        this.deviceSelector = page.locator('app-field-autocomplete-single-selection[name="box"] input');
        this.deviceSelectorOption = page.locator('mat-option');
        this.locationSelector = page.locator('app-field-autocomplete-single-selection[name="location"] input');
        this.locationSelectorOption = page.locator('mat-option');
        this.groupSelector = page.locator('app-field-autocomplete-single-selection[name="group"] input');
        this.groupSelectorOption = page.locator('mat-option');
        this.sliderMin = page.locator('mat-slider input').first();
        this.sliderMax = page.locator('mat-slider input').last();


    }

    async clickFilters(): Promise<void> {
        await this.filtersBtn.click();
    }

    async clickDateSelector(): Promise<void> {
        await this.dateSelector.click();
    }

    async clickDateBtn(): Promise<void> {
        await this.dateBtn.click({ clickCount: 2 });
        // Cerrar el calendario con Escape para que no bloquee el botón Filtrar
        await this.page.keyboard.press('Escape');
    }

    async getDateInput(): Promise<string> {
        const dateInput = await this.dateInput.last().inputValue();
        console.log(dateInput);
        return dateInput;
    }

    async clickConfirmFilterBtn(): Promise<any> {

        const responsePromise = this.page.waitForResponse(resp =>
            resp.url().includes(':3000/inference') && resp.status() === 200);

        await this.confirmFilterBtn.click();
        const response = await responsePromise;
        return await response.json();
    }

    async clicResetFilterBtn(): Promise<void> {
        await this.resetFilterBtn.click();
    }

    async selectDevice(deviceName: string): Promise<void> {
        await this.deviceSelector.fill(deviceName);
        await this.deviceSelectorOption.filter({ hasText: deviceName }).click();
    }

    async selectLocation(locationName: string): Promise<void> {
        await this.locationSelector.fill(locationName);
        await this.locationSelectorOption.filter({ hasText: locationName }).click();
    }

    async selectGroup(groupName: string): Promise<void> {
        await this.groupSelector.fill(groupName);
        await this.groupSelectorOption.filter({ hasText: groupName }).click();
    }

    async setSliderAge(min: number, max: number): Promise<void> {
        await this.sliderMin.fill(min.toString());
        await this.sliderMax.fill(max.toString());
    }

    async selectDate(): Promise<void> {
        await this.clickDateSelector();
        await this.clickDateBtn();
    }

    async combineFilters(deviceName: string, locationName: string, groupName: string, minAge: number, maxAge: number): Promise<void> {
        await this.selectDate();
        await this.selectLocation(locationName);
        await this.selectGroup(groupName);
        await this.selectDevice(deviceName);
        await this.setSliderAge(minAge, maxAge);
    }

}