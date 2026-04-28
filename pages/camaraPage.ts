import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object para la gestión de Cámaras.
 * Limpiado y adaptado desde Cypress: pages/camaraPage.js
 */
export class CamaraPage {
    readonly page: Page;

    // Elementos
    readonly btnCamaras: Locator;
    readonly btnMas: Locator;
    readonly inputCodigo: Locator;
    readonly inputNombre: Locator;
    readonly inputDescripcion: Locator;
    readonly inputHost: Locator;
    readonly inputUsername: Locator;
    readonly inputPassword: Locator;
    readonly selectLocacion: Locator;
    readonly selectGrupo: Locator;
    readonly btnGuardar: Locator;
    readonly tenantHeaderDisplay: Locator;
    readonly tenantHeaderTrigger: Locator;
    readonly filasCamarasDinamicas: Locator;
    readonly toggleHabilitado: Locator;
    readonly btnConfirmarDesactivacion: Locator;
    readonly inputBusqueda: Locator;
    readonly inputTenantForm: Locator;

    // Variables para datos dinámicos
    public nombreCamaraCreada: string = '';
    public codigoCamaraCreado: string = '';

    constructor(page: Page) {
        this.page = page;
        this.btnCamaras = page.locator('.cameras');
        this.btnMas = page.locator('app-button-create button');

        // Información de la Cámara
        this.inputCodigo = page.locator('#code');
        this.inputNombre = page.locator('#name');
        this.inputDescripcion = page.locator('#description');

        // Conexión
        this.inputHost = page.locator('#hostAddress');

        // Datos de usuario
        this.inputUsername = page.locator('#username');
        this.inputPassword = page.locator('#password');

        // Asignada a (Uso de filtros por texto para mayor robustez)
        this.selectLocacion = page.locator('mat-form-field').filter({ hasText: /Seleccionar Locación/i });
        this.selectGrupo = page.locator('mat-form-field').filter({ hasText: /Seleccionar Grupo/i });

        // Botón Guardar (Basado en el estilo de RolPage)
        this.btnGuardar = page.locator('button.mdc-button.mat-primary');

        // Tenant y Tabla
        this.tenantHeaderDisplay = page.locator('#tenant-selector');
        this.tenantHeaderTrigger = page.locator('#tenant-selector');
        this.filasCamarasDinamicas = page.locator('tr[role="row"]').filter({ hasText: 'Nombre_Cam_' });

        // Desactivación
        this.toggleHabilitado = page.locator('mat-slide-toggle button[role="switch"]');
        this.btnConfirmarDesactivacion = page.locator('button.confirm-button');

        // Búsqueda y Formulario
        this.inputBusqueda = page.getByPlaceholder('Buscar...');
        this.inputTenantForm = page.locator('input[name="tenant"]');
    }

    // Acciones

    async clickBtnCamaras(): Promise<void> {
        await this.btnCamaras.click();
    }

    async clickBtnMas(): Promise<void> {
        await this.btnMas.click();
    }

    /**
     * Genera datos dinámicos para código y nombre.
     */
    async datosDinamicosCamara(): Promise<{ codigo: string, nombre: string }> {
        const timestamp = Date.now();
        this.codigoCamaraCreado = `Cod_Cam_${timestamp}`;
        this.nombreCamaraCreada = `Nombre_Cam_${timestamp}`;
        return { codigo: this.codigoCamaraCreado, nombre: this.nombreCamaraCreada };
    }

    async completarInformacionCamara(codigo: string, nombre: string, descripcion: string): Promise<void> {
        await this.inputCodigo.fill(codigo);
        await this.inputNombre.fill(nombre);
        await this.inputDescripcion.fill(descripcion);
    }

    async completarConexion(host: string): Promise<void> {
        await this.inputHost.fill(host);
    }

    async completarDatosUsuario(user: string, pass: string): Promise<void> {
        await this.inputUsername.fill(user);
        await this.inputPassword.fill(pass);
    }

    async seleccionarLocacion(locacion: string): Promise<void> {
        await this.selectLocacion.click();
        // Usamos regex para que sea insensible a mayúsculas pero exacto en el contenido
        await this.page.getByRole('option', { name: new RegExp(`^${locacion}$`, 'i') }).click();
    }

    async seleccionarTenantForm(tenant: string): Promise<void> {
        await this.inputTenantForm.waitFor({ state: 'visible' });
        await this.inputTenantForm.click();
        await this.inputTenantForm.fill(tenant);
        // Seleccionar la opción del autocomplete de forma exacta e insensible a mayúsculas
        const opcion = this.page.getByRole('option', { name: new RegExp(`^${tenant}$`, 'i') });
        await opcion.waitFor({ state: 'visible' });
        await opcion.click();
    }

    async seleccionarGrupo(grupo: string): Promise<void> {
        await this.selectGrupo.click();
        await this.page.getByRole('option', { name: new RegExp(`^${grupo}$`, 'i') }).click();
    }

    async guardar(): Promise<void> {
        await this.btnGuardar.click();
    }

    async validacionExitosa(): Promise<void> {
        await expect(this.page.getByText('Cámara creada con éxito.')).toBeVisible();
    }

    async validacionExitosaDesactivacion(): Promise<void> {
        await expect(this.page.getByText('Cámara deshabilitada con éxito.')).toBeVisible();
    }

    async validacionExitosaModificacion(): Promise<void> {
        // Esperamos a estar de vuelta en el listado para capturar el toast
        await this.btnMas.waitFor({ state: 'visible' });
        await expect(this.page.getByText('Cámara guardada con éxito.')).toBeVisible();
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
     * Realiza una búsqueda en la tabla de cámaras.
     */
    async buscarCamara(nombre: string): Promise<void> {
        await this.inputBusqueda.waitFor({ state: 'visible' });
        await this.inputBusqueda.clear();
        await this.inputBusqueda.fill(nombre);
        await this.page.keyboard.press('Enter');
        // Espera de seguridad para que la tabla filtre
        await this.page.waitForTimeout(1000);
    }

    /**
     * Hace click en la primera cámara dinámica (Nombre_Cam_) visible en la tabla.
     */
    async ingresarCamaraDinamica(): Promise<void> {
        const fila = this.filasCamarasDinamicas.first();
        await fila.scrollIntoViewIfNeeded();
        await fila.waitFor({ state: 'visible' });

        // Se hace clic en la primera celda para asegurar el evento
        await fila.locator('td').first().click({ force: true });
    }

    /**
     * Desactiva la cámara mediante el switch y acepta el pop up de confirmación.
     */
    async desactivarCamara(): Promise<void> {
        await this.toggleHabilitado.waitFor({ state: 'visible' });
        await this.toggleHabilitado.click();

        await this.btnConfirmarDesactivacion.waitFor({ state: 'visible' });
        await this.btnConfirmarDesactivacion.click();
    }
}