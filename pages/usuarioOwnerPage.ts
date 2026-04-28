import { Page, Locator } from '@playwright/test';

/**
 * Page Object para la gestión de usuarios Owner.
 * Migrado desde Cypress: pages/usuarioOwner.js
 */
export class UsuarioOwnerPage {
  readonly page: Page;

  // Elementos
  readonly usuariosBtn: Locator;
  readonly btnMas: Locator;
  readonly inputNombre: Locator;
  readonly inputApellido: Locator;
  readonly inputEmail: Locator;
  readonly inputTenant: Locator;
  readonly inputRol: Locator;
  readonly btnConfirmar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usuariosBtn = page.locator('.users');
    this.btnMas = page.locator('.mdc-button--unelevated');
    this.inputNombre = page.locator('#firstName');
    this.inputApellido = page.locator('#lastName');
    this.inputEmail = page.locator('#email');
    this.inputTenant = page.locator('input[name="tenant"]');
    this.inputRol = page.locator('mat-select[data-name="role"]');
    this.btnConfirmar = page.locator('button.mdc-button.mat-primary');
  }

  // Acciones

  async clickUsuariosOwner(): Promise<void> {
    await this.usuariosBtn.click();
  }

  async clickBtnMasOwner(): Promise<void> {
    await this.btnMas.click();
  }

  async typeNombreOwner(nombre: string): Promise<void> {
    await this.inputNombre.fill(nombre);
  }

  async typeApellidoOwner(apellido: string): Promise<void> {
    await this.inputApellido.fill(apellido);
  }

  async typeEmailOwner(emailUnico: string): Promise<void> {
    await this.inputEmail.clear();
    await this.inputEmail.fill(emailUnico);
  }

  async seleccionarTenant(nombre: string): Promise<void> {
    // Click para dar foco
    await this.inputTenant.waitFor({ state: 'visible' });
    await this.inputTenant.click();
    // Escribir nombre del tenant
    await this.inputTenant.fill(nombre);
    // Click en la opción que coincida con el nombre
    await this.page.locator('mat-option').filter({ hasText: nombre }).click();
  }

  async seleccionarRol(nombreRol: string): Promise<void> {
    // Abrir el desplegable
    await this.inputRol.click();
    // Seleccionar la opción de la lista que aparece
    await this.page.locator('mat-option').filter({ hasText: nombreRol }).click();
  }

  async confirmarOwner(): Promise<void> {
    await this.btnConfirmar.click();
  }
}
