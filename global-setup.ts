import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Global Setup: Realiza el login una sola vez antes de todos los tests
 * y guarda el estado de autenticación (cookies, localStorage) en un archivo JSON.
 *
 * Equivalente a `cy.loginSession()` en Cypress.
 */
async function globalSetup(config: FullConfig): Promise<void> {
    const authDir = path.resolve(__dirname, '.auth');
    const storageStatePath = path.resolve(authDir, 'storageState.json');

    // Crear directorio .auth si no existe
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    const email = process.env.USER_DEXVISION ?? '';
    const password = process.env.PASS_DEXVISION ?? '';

    if (!email || !password) {
        throw new Error(
            'Las variables de entorno USER_DEXVISION y PASS_DEXVISION son requeridas.\n' +
            'Crea un archivo .env en la raíz del proyecto con:\n' +
            '  USER_DEXVISION=tu_email\n' +
            '  PASS_DEXVISION=tu_contraseña'
        );
    }

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navegar a la aplicación (Keycloak redirige al login automáticamente)
    await page.goto('https://visionqa.dexmanager.com/');

    // Completar formulario de login (Keycloak)
    await page.locator('#username').waitFor({ state: 'visible' });
    await page.locator('#username').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('.pf-c-button', { hasText: 'Sign In' }).click();

    // Esperar a que el login se complete (URL no contiene 'login')
    await page.waitForURL((url) => !url.href.includes('login'), { timeout: 30_000 });

    // Guardar estado de autenticación
    await context.storageState({ path: storageStatePath });

    await browser.close();
}

export default globalSetup;
