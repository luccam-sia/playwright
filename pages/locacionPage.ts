import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object para la gestión de Locaciones.
 */
export class LocacionPage {
    readonly page: Page;

    // Elementos Sidebar
    readonly btnLocaciones: Locator;
    readonly btnMas: Locator;

    // Información Básica
    readonly inputCodigo: Locator;
    readonly inputNombre: Locator;
    readonly inputDescripcion: Locator;

    // Geografía / Dirección
    readonly inputDireccion: Locator;
    readonly inputLocalidad: Locator;
    readonly inputPais: Locator;
    readonly btnValidarDireccion: Locator;
    readonly btnAbrirHorarios: Locator;
    readonly inputHoraDesde: Locator;
    readonly inputHoraHasta: Locator;
    readonly btnAgregarHorarioModal: Locator;

    // Información de Contacto
    readonly inputNombreContacto: Locator;
    readonly inputEmailContacto: Locator;
    readonly inputTelefonoContacto: Locator;
    readonly inputTelefonoSucursal: Locator;

    // Botones Finales
    readonly btnConfirmar: Locator;

    // Mapa e Indicadores
    readonly mapa: Locator;

    // Variables para datos dinámicos
    public codigoLocacionCreada: string = '';

    constructor(page: Page) {
        this.page = page;

        // Navegación (Basado en patrones de cámaras/roles)
        this.btnLocaciones = page.locator('.locations');
        this.btnMas = page.locator('app-button-create button');

        // Formulario
        this.inputCodigo = page.locator('#code');
        this.inputNombre = page.locator('#name');
        this.inputDescripcion = page.locator('#description');

        // Dirección (Uso de labels para mayor robustez inicial)
        this.inputDireccion = page.locator('#address');
        this.inputLocalidad = page.locator('#locality');
        this.inputPais = page.locator('input[name="region"]');
        this.btnValidarDireccion = page.locator('button').filter({ hasText: /Validar dirección/i });

        // Horarios
        this.btnAbrirHorarios = page.locator('button').filter({ hasText: /Agregar horarios de atención/i });
        this.inputHoraDesde = page.locator('#from');
        this.inputHoraHasta = page.locator('#to');
        this.btnAgregarHorarioModal = page.getByRole('button', { name: 'Agregar', exact: true });

        // Información de Contacto
        this.inputNombreContacto = page.locator('#contactName');
        this.inputEmailContacto = page.locator('#contactEmail');
        this.inputTelefonoContacto = page.locator('#contactPhone');
        this.inputTelefonoSucursal = page.locator('#phone');

        // Botón Confirmar (Guardar)
        this.btnConfirmar = page.locator('button').filter({ hasText: /Confirmar/i });

        // Mapa (Selector genérico para ser ajustado)
        this.mapa = page.locator('.map-container, #map, mat-card-content iframe');
    }

    // Acciones

    async clickBtnLocaciones(): Promise<void> {
        await this.btnLocaciones.click();
    }

    async clickBtnMas(): Promise<void> {
        await this.btnMas.click();
    }

    async completarInformacionBasica(codigo: string, nombre: string, descripcion: string): Promise<void> {
        await this.inputCodigo.fill(codigo);
        await this.inputNombre.fill(nombre);
        await this.inputDescripcion.fill(descripcion);
    }

    async datosDinamicosLocacion(): Promise<string> {
        const timestamp = Date.now();
        const codigo = `Codigo_Locacion_${timestamp}`;

        await this.inputCodigo.fill(codigo);
        this.codigoLocacionCreada = codigo;

        console.log('Locación dinámica creada: ' + codigo);
        return codigo;
    }

    async completarGeografia(direccion: string, localidad: string, pais: string): Promise<void> {
        await this.inputDireccion.fill(direccion);
        await this.inputLocalidad.fill(localidad);

        // Manejo de País como Autocomplete
        await this.inputPais.fill(pais);
        const opcion = this.page.getByRole('option', { name: new RegExp(`^${pais}$`, 'i') });
        await opcion.waitFor({ state: 'visible' });
        await opcion.click();
    }

    async clickValidarDireccion(): Promise<void> {
        await this.btnValidarDireccion.click();
    }

    async verificarMapaVisible(): Promise<void> {
        // Se espera que el mapa o su contenedor sea visible
        await expect(this.mapa.first()).toBeVisible();
    }

    async configurarHorarios(dias: string[], desde: string, hasta: string): Promise<void> {
        await this.btnAbrirHorarios.click();

        // Seleccionar días
        for (const dia of dias) {
            const btnDia = this.page.locator('button.day-btn').filter({ hasText: dia });
            const count = await btnDia.count();
            for (let i = 0; i < count; i++) {
                await btnDia.nth(i).click();
            }
        }

        // Completar horas
        await this.inputHoraDesde.fill(desde);
        await this.inputHoraHasta.fill(hasta);

        // Click en Agregar (dentro del modal)
        await this.btnAgregarHorarioModal.click();
    }

    async completarInformacionContacto(nombre: string, email: string, telContacto: string, telSucursal: string): Promise<void> {
        await this.inputNombreContacto.fill(nombre);
        await this.inputEmailContacto.fill(email);
        await this.inputTelefonoContacto.fill(telContacto);
        await this.inputTelefonoSucursal.fill(telSucursal);
    }

    async confirmar(): Promise<void> {
        await this.btnConfirmar.click();
    }

    async validacionExitosaCreacion(): Promise<void> {
        await expect(this.page.getByText('Locación creada con éxito.')).toBeVisible();
    }
}
