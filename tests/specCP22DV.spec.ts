import { test } from '@playwright/test';
import { loginSession } from '../auth/login';
import { CamaraPage } from '../pages/camaraPage.page';

test.describe('Crear camara', () => {
    // Ejecución ANTES de cada test
    test.beforeEach(async ({ page }) => {
        await loginSession(page);
        // Luego de login, ir a la página principal
        await page.goto('/');
    });

    test('passes', async ({ page }) => {
        const camaraPage = new CamaraPage(page);

        // Acceder a sección Camara
        await camaraPage.clickBtnCamaras();

        // Hacer clic en btn "+"
        await camaraPage.clickBtnMas();

        // Datos dinámicos
        const { codigo, nombre } = await camaraPage.datosDinamicosCamara();

        // 3-Asignar nombre de camara, descripcion, host (192.168.2.000)
        await camaraPage.completarInformacionCamara(codigo, nombre, 'Descripción de prueba para automatización');
        await camaraPage.completarConexion('192.168.2.000');

        // nombre de usuario y contraseña (mismas credenciales que inicio de sesion)
        const usuario = process.env.USER_DEXVISION!;
        const password = process.env.PASS_DEXVISION!;
        await camaraPage.completarDatosUsuario(usuario, password);

        // seleccionar locacion (oficina SIA)
        await camaraPage.seleccionarLocacion('oficina SIA');

        // seleccionar grupo (GRUPO PANTALLAS LAB)
        await camaraPage.seleccionarGrupo('GRUPO PANTALLAS LAB');

        // Guardar para validar
        await camaraPage.guardar();
        await camaraPage.validacionExitosa();
    });
});