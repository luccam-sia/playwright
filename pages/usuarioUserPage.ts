import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object para la gestión de usuarios User.
 * Migrado desde Cypress: pages/usuarioUser.js
 */
export class UsuarioUserPage {
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
  readonly searchInput: Locator;

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
    this.searchInput = page.locator('input[placeholder="Buscar..."]');
  }

  // Acciones

  async clickUsuariosUser(): Promise<void> {
    await this.usuariosBtn.click();
  }

  async clickBtnMasUser(): Promise<void> {
    await this.btnMas.click();
  }

  async typeNombreUser(nombre: string): Promise<void> {
    await this.inputNombre.fill(nombre);
  }

  async typeApellidoUser(apellido: string): Promise<void> {
    await this.inputApellido.fill(apellido);
  }

  async typeEmail(emailUnico: string): Promise<void> {
    await this.inputEmail.clear();
    await this.inputEmail.fill(emailUnico);
  }

  async seleccionarTenant(nombre: string): Promise<void> {
    // Click para dar foco
    await this.inputTenant.scrollIntoViewIfNeeded();
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

  /**
   * Seleccionar un rol dinámico previamente creado.
   * En Playwright no usamos aliases de Cypress; el nombre se pasa como parámetro.
   */
  async seleccionarRolDinamico(nombreRol: string): Promise<void> {
    console.log('Asignando rol dinámico: ' + nombreRol);
    await this.seleccionarRol(nombreRol);
  }

  async limpiarBusqueda(): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.clear();
    // Breve espera para que la lista se actualice
    await this.page.waitForTimeout(3000);
  }

  async confirmarUser(): Promise<void> {
    await this.btnConfirmar.click();
    // Validamos mensaje
    await expect(this.page.getByText('Usuario creado con éxito.')).toBeVisible();
  }
}
