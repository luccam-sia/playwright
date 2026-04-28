import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object para la gestión de Roles.
 * Migrado desde Cypress: pages/rolPage.js
 */
export class RolPage {
  readonly page: Page;

  // Elementos
  readonly btnRoles: Locator;
  readonly btnMas: Locator;
  readonly inputNombreRol: Locator;
  readonly inputDescripcionRol: Locator;
  readonly inputTenant: Locator;
  readonly tituloRol: Locator;
  readonly checkboxSeleccionarTodo: Locator;
  readonly btnGuardar: Locator;
  readonly tenantHeaderDisplay: Locator;
  readonly tenantHeaderTrigger: Locator;
  readonly filasRolesDinamicos: Locator;
  readonly toggleHabilitado: Locator;
  readonly btnConfirmarDesactivacion: Locator;

  // Variable para almacenar el nombre del rol creado dinámicamente
  // (reemplaza el cy.wrap().as('nombreRolCreado') de Cypress)
  public nombreRolCreado: string = '';

  constructor(page: Page) {
    this.page = page;
    this.btnRoles = page.locator('.roles');
    this.btnMas = page.locator('.mdc-button--unelevated');
    this.inputNombreRol = page.locator('#name');
    this.inputDescripcionRol = page.locator('#description');
    this.inputTenant = page.locator('input[name="tenants"]');
    // Se agrega para cerrar el desplegable de tenants (issue conocido)
    this.tituloRol = page.locator('h3').filter({ hasText: 'ROL' });
    this.checkboxSeleccionarTodo = page
      .locator('mat-checkbox')
      .filter({ hasText: 'Seleccionar todas las opciones' })
      .locator('input[type="checkbox"]');
    this.btnGuardar = page.locator('button.mdc-button.mat-primary');
    this.tenantHeaderDisplay = page.locator('#tenant-selector');
    this.tenantHeaderTrigger = page.locator('#tenant-selector');
    // Busca filas de roles que empiecen con "Rol_"
    this.filasRolesDinamicos = page.locator('tr[role="row"]').filter({ hasText: /^Rol_.*/ });
    this.toggleHabilitado = page.locator('mat-slide-toggle button[role="switch"]');
    this.btnConfirmarDesactivacion = page.locator('button.confirm-button');
  }

  // Acciones

  async clickBtnRoles(): Promise<void> {
    await this.btnRoles.click();
  }

  async clickBtnMas(): Promise<void> {
    await this.btnMas.click();
  }

  async typeNombreRol(nombre: string): Promise<void> {
    await this.inputNombreRol.fill(nombre);
  }

  async typeDescripcionRol(descripcion: string): Promise<void> {
    await this.inputDescripcionRol.fill(descripcion);
  }

  async seleccionarTenant(tenant: string): Promise<void> {
    // Click para dar foco en input
    await this.inputTenant.waitFor({ state: 'visible' });
    await this.inputTenant.click();
    // Escribir nombre del tenant
    await this.inputTenant.fill(tenant);
    // Click en la opción que coincida
    await this.page.locator('mat-option').filter({ hasText: tenant }).click();
    // Click en título para cerrar el desplegable (issue conocido)
    await this.tituloRol.click();
  }

  async seleccionarTodosLosPermisos(): Promise<void> {
    await this.checkboxSeleccionarTodo.check();
  }

  async guardado(): Promise<void> {
    await this.btnGuardar.click();
  }

  async validacionExitosa(): Promise<void> {
    await expect(this.page.getByText('Rol creado con éxito.')).toBeVisible();
  }
  async validacionExitosaDesactivacion(): Promise<void> {
    await expect(this.page.getByText('Role deshabilitado con éxito.')).toBeVisible();
  }
  async validacionExitosaModificacion(): Promise<void> {
    await expect(this.page.getByText('Rol actualizado con éxito.')).toBeVisible();
  }


  /**
   * Genera un nombre de rol único con timestamp y lo almacena en this.nombreRolCreado.
   * Reemplaza el patrón cy.wrap().as('nombreRolCreado') de Cypress.
   */
  async datosDinamicosRol(): Promise<string> {
    const timestamp = Date.now();
    const rolUnico = `Rol_${timestamp}`;

    await this.inputNombreRol.clear();
    await this.inputNombreRol.fill(rolUnico);

    // Guardamos el valor en la instancia (reemplaza el alias de Cypress)
    this.nombreRolCreado = rolUnico;

    console.log('Rol dinámico creado: ' + rolUnico);
    return rolUnico;
  }

  /**
   * Verifica el tenant actual en el header y lo cambia si es necesario.
   */
  async asegurarTenantCorrecto(nombreTenant: string): Promise<void> {
    const tenantActual = (await this.tenantHeaderDisplay.textContent())?.trim() || '';

    if (tenantActual !== nombreTenant) {
      console.log(`Cambiando de ${tenantActual} a ${nombreTenant}...`);

      // Abrir el selector del header
      await this.tenantHeaderTrigger.click();

      // Seleccionar la opción correcta
      const opcion = this.page.locator('mat-option').filter({ hasText: nombreTenant });
      await opcion.scrollIntoViewIfNeeded();
      await opcion.waitFor({ state: 'visible' });
      await opcion.click();

      // Espera de seguridad para que la tabla se refresque
      await this.page.waitForTimeout(1000);
    } else {
      console.log(`Ya te encuentras en el tenant: ${nombreTenant}`);
    }
  }

  /**
   * Hace click en el primer rol dinámico (que empiece con "Rol_") visible en la tabla.
   */
  async ingresarCualquierRolDinamico(): Promise<void> {
    const fila = this.filasRolesDinamicos.first();
    await fila.scrollIntoViewIfNeeded();
    await fila.waitFor({ state: 'visible' });

    // En Angular, la clase 'redirect' está en el <tr>. Si Playwright hace clic
    // en un punto vacío, el evento no se activa. Hacer clic en una celda específica
    // (<tr> > <td>) asegura dar en el blanco y que el evento burbujee al <tr>.
    await fila.locator('td').first().click({ force: true });
  }

  /**
   * Hace click en el primer rol dinámico (que empiece con "Rol_") que NO contenga "editado".
   * Específico para el specCP12DV.
   */
  async ingresarRolDinamicoSinEditar(): Promise<void> {
    const fila = this.filasRolesDinamicos.filter({ hasNotText: 'editado' }).first();
    await fila.scrollIntoViewIfNeeded();
    await fila.waitFor({ state: 'visible' });

    // En Angular, la clase 'redirect' está en el <tr>. Si Playwright hace clic
    // en un punto vacío, el evento no se activa. Hacer clic en una celda específica
    // (<tr> > <td>) asegura dar en el blanco y que el evento burbujee al <tr>.
    await fila.locator('td').first().click({ force: true });
  }

  /**
   * Desactiva el rol mediante el switch y acepta el pop up de confirmación.
   */
  async desactivarRol(): Promise<void> {
    await this.toggleHabilitado.waitFor({ state: 'visible' });
    await this.toggleHabilitado.click();

    await this.btnConfirmarDesactivacion.waitFor({ state: 'visible' });
    await this.btnConfirmarDesactivacion.click();
  }
}
