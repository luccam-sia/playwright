import { type Page, type Locator } from '@playwright/test';

export class InferencePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}