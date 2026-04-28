import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object para la página principal (dashboard/sidebar) de DexVision.
 * Contiene las acciones de navegación del menú lateral.
 */
export class MainPage {
    readonly page: Page;

    // ── Locators ──────────────────────────────────────────────
    readonly profileBtn: Locator;
    readonly logoutBtn: Locator;
    readonly tenantMenuItem: Locator;
    readonly devicesMenuItem: Locator;
    readonly groupsMenuItem: Locator;
    readonly inferencesMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;

        // Icono/botón de perfil del usuario
        this.profileBtn = page.locator('.profile-container button');

        // Opción de logout en el menú desplegable
        this.logoutBtn = page.locator('.mat-mdc-menu-item', { hasText: 'Cerrar sesión' });

        // Acceso al módulo de Tenants en el menú lateral
        this.tenantMenuItem = page.locator('mat-list-item', { hasText: 'Tenants' });

        // Acceso al módulo de Dispositivos en el menú lateral
        this.devicesMenuItem = page.locator('mat-list-item', { hasText: 'Dispositivos' });

        // Acceso al módulo de Grupos en el menú lateral
        this.groupsMenuItem = page.locator('mat-list-item', { hasText: 'Grupos' });

        // Acceso al módulo de Inferences en el menú lateral
        this.inferencesMenuItem = page.locator('mat-list-item', { hasText: 'Inferencias' });
    }

    // ── ACCIONES INDIVIDUALES ────────────────────────────────

    /** Abre el menú de perfil */
    async clickProfile(): Promise<void> {
        await this.profileBtn.click();
    }

    /** Presiona el botón de Cerrar sesión */
    async clickLogout(): Promise<void> {
        await this.logoutBtn.click();
    }

    /** Entra a la sección de Tenants */
    async clickTenant(): Promise<void> {
        await this.tenantMenuItem.click();
    }

    /** Entra a la sección de Dispositivos */
    async clickDevices(): Promise<void> {
        await this.devicesMenuItem.click();
    }

    /** Entra a la sección de Grupos */
    async clickGroups(): Promise<void> {
        await this.groupsMenuItem.click();
    }

    /** Entra a la sección de Inferences */
    async clickInferences(): Promise<void> {
        await this.inferencesMenuItem.click();
    }

    // ── SECUENCIAS DE ACCIONES ───────────────────────────────

    /** Proceso completo de cierre de sesión */
    async logout(): Promise<void> {
        await this.clickProfile();
        await this.clickLogout();
    }
}
