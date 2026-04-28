import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object para la creación y gestión de usuarios.
 * Migrado desde Cypress: pages/creacionUsuario.js
 */
export class CreacionUsuarioPage {
  readonly page: Page;

  // Elementos
  readonly usuariosBtn: Locator;
  readonly btnMas: Locator;
  readonly inputNombre: Locator;
  readonly inputApellido: Locator;
  readonly inputEmail: Locator;
  readonly checkSuperAdmin: Locator;
  readonly checkSuperAdminSelected: Locator;
  readonly btnConfirmar: Locator;
  readonly toggleComponent: Locator;
  readonly toggleButton: Locator;
  readonly btnConfirmarModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usuariosBtn = page.locator('.users');
    this.btnMas = page.locator('.mdc-button--unelevated');
    this.inputNombre = page.locator('#firstName');
    this.inputApellido = page.locator('#lastName');
    this.inputEmail = page.locator('#email');
    this.checkSuperAdmin = page.locator('mat-checkbox').filter({ hasText: 'Super Admin' });
    this.checkSuperAdminSelected = page.locator('.mdc-checkbox--selected');
    this.btnConfirmar = page.locator('button.mdc-button.mat-primary');
    // Seleccion de usuario (contiene qa-automation en email y esta activo)
    this.toggleComponent = page.locator('mat-slide-toggle');
    this.toggleButton = page.locator('mat-slide-toggle button[role="switch"]');
    this.btnConfirmarModal = page.locator('button.confirm-button');
  }

  // =====================
  // Acciones CREAR USUARIO
  // =====================

  async clickUsuarios(): Promise<void> {
    await this.usuariosBtn.click();
  }

  async clickBtnMas(): Promise<void> {
    await this.btnMas.click();
  }

  async typeNombre(nombre: string): Promise<void> {
    await this.inputNombre.fill(nombre);
  }

  async typeApellido(apellido: string): Promise<void> {
    await this.inputApellido.fill(apellido);
  }

  async typeEmail(emailUnico: string): Promise<void> {
    await this.inputEmail.clear();
    await this.inputEmail.fill(emailUnico);
  }

  async seleccionarSuperAdmin(): Promise<void> {
    await this.checkSuperAdmin.filter({ hasText: 'Super Admin' }).click();
  }

  async confirmar(): Promise<void> {
    await this.btnConfirmar.click();
  }

  // ============================
  // Acciones DESHABILITAR USUARIO
  // ============================

  /**
   * Selecciona el primer usuario de la lista que contenga "qa_automation" y esté "Activo".
   * Equivalente a: cy.get('tr[role="row"]').filter(':contains("Activo")').filter(':contains("qa_automation")')
   */
  async clickUsuarioLista(): Promise<void> {
    const fila = this.page
      .locator('tr[role="row"]')
      .filter({ hasText: 'Activo' })
      .filter({ hasText: 'qa_automation' })
      .first();

    await fila.scrollIntoViewIfNeeded();
    await expect(fila).toBeVisible();
    await fila.click({ force: true });
  }

  // =====================
  // Datos Dinámicos
  // =====================

  /**
   * Genera nombre y apellido editados con timestamp único.
   */
  async datosDinamicosNombreApellido(): Promise<void> {
    const timestamp = Date.now();
    const nombreEditado = `Nombre EDITADO ${timestamp}`;
    const apellidoEditado = `Apellido EDITADO ${timestamp}`;

    await this.inputNombre.clear();
    await this.inputNombre.fill(nombreEditado);
    await this.inputApellido.clear();
    await this.inputApellido.fill(apellidoEditado);
  }

  /**
   * Genera un email único con timestamp.
   */
  async datosDinamicosEmail(): Promise<void> {
    const timestamp = Date.now();
    const emailUnico = `qa_automation_${timestamp}@sia.com`;

    await this.inputEmail.clear();
    await this.inputEmail.fill(emailUnico);
  }

  // =====================
  // Gestión Super Admin
  // =====================

  /**
   * Si Super Admin está marcado, lo desmarca para habilitar la asignación de tenant/roles.
   */
  async gestionarSuperAdminYAsignarRoles(): Promise<void> {
    const input = this.checkSuperAdmin.locator('input');
    const isChecked = await input.isChecked();

    if (isChecked) {
      console.log('DEBUG: El input está CHECKED. Desmarcando...');
      await input.click({ force: true });
      // Verificar que el campo tenant se habilita
      await expect(this.page.locator('input[name="tenant"]')).not.toBeDisabled();
    } else {
      console.log('DEBUG: El input NO está marcado. Saltando...');
    }
  }

  // ============================
  // Deshabilitar Usuario
  // ============================

  /**
   * Si el toggle está activo (checked), lo desactiva y confirma el modal.
   */
  async deshabilitarUsuario(): Promise<void> {
    const ariaChecked = await this.toggleButton.getAttribute('aria-checked');
    const isChecked = ariaChecked === 'true';

    if (isChecked) {
      // Si está activo, hacer clic para apagarlo
      await this.toggleButton.click({ force: true });
      // Clic en el btn OK del modal
      await this.btnConfirmarModal.waitFor({ state: 'visible' });
      await this.btnConfirmarModal.click();
      console.log('Cambiando estado a: Inactivo');
    } else {
      console.log('El usuario ya se encuentra inactivo');
    }
  }
}
