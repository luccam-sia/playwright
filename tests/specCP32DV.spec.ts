import { test } from '@playwright/test';
import { loginSession } from '../auth/login';
import { LocacionPage } from '../pages/locacionPage';
import { MainPage, InferencePage } from '../pages';

test.describe('Gestión de Locaciones - Creación', () => {
    // Ejecución ANTES de cada test
    test.beforeEach(async ({ page }) => {
        await loginSession(page);
        // Luego de login, ir a la página principal
        await page.goto('/');
    });

    test('CP32DV: Debe iniciar la creación de una locación y validar la dirección en el mapa', async ({ page }) => {
        const locacionPage = new LocacionPage(page);

        // 1- Ingresar a sección locacion
        await locacionPage.clickBtnLocaciones();

        // 2- Hacer clic en el boton "+"
        await locacionPage.clickBtnMas();

        // 3- Agregar codigo dinamico, nombre "ARAOZ - OFICINA SIA", descripcion: "Locacion automatizada"
        await locacionPage.datosDinamicosLocacion();
        await locacionPage.inputNombre.fill('ARAOZ - OFICINA SIA');
        await locacionPage.inputDescripcion.fill('Locacion automatizada');

        // 4- Asignar direccion: "Aráoz 496" - Asignar localidad: "Buenos Aires" - Pais: "Argentina"
        await locacionPage.completarGeografia('Aráoz 496', 'Buenos Aires', 'Argentina');

        // 5- Hacer clic en validar direccion
        await locacionPage.clickValidarDireccion();

        // 6- Verificar que aparezca la direccion en el mapa
        await locacionPage.verificarMapaVisible();
        /*
                // 7- Configurar horarios de atención: L, M, M, J, V de 09:00 a 18:00
                await locacionPage.configurarHorarios(['L', 'M', 'J', 'V'], '09:00', '18:00');
                // *** CODIGO COMENTADO POR ISSUE ***
        */
        // 8- Completar Información de Contacto
        await locacionPage.completarInformacionContacto(
            'SIA INTERACTIVE',
            'siainteractive@siainteractive.com',
            '0800-111',
            '0800-111'
        );

        // 9- Hacer clic en Confirmar y validar éxito
        await locacionPage.confirmar();
        await locacionPage.validacionExitosaCreacion();
    });
});

test.describe('Cambiar locación de un grupo', () => {

    test.beforeEach(async ({ page }) => {
        // Redirige a la URL base de la aplicación (asume login previo)
        await page.goto('/');
    });

    test('Verificar el registro de inferencias sin contexto', async ({ page }) => {
        const mainPage = new MainPage(page);
        const inferencePage = new InferencePage(page);

        // Espera de seguridad para asegurar la carga completa de la UI
        await page.waitForLoadState('networkidle');

        // Navegar a la sección de Inferences
        await mainPage.clickInferences();

    });
});
