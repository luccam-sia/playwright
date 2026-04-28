import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Carga variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Configuración de Playwright para DexVision QA.
 * Ver: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Ejecutar tests en serie (no en paralelo), dado que comparten sesión y estado */
  fullyParallel: false,

  /* Fallar el build en CI si se dejó un test.only accidentalmente */
  forbidOnly: !!process.env.CI,

  /* Reintentos: 2 en CI, 0 en local */
  retries: process.env.CI ? 2 : 0,

  /* Un solo worker para evitar conflictos de sesión */
  workers: 1,

  /* Reporter HTML para visualización de resultados */
  reporter: 'html',

  /* Configuración global compartida entre todos los proyectos */
  use: {
    /* URL base de la aplicación DexVision QA */
    baseURL: 'https://visionqa.dexmanager.com',

    /* Reutilizar estado de autenticación guardado por global-setup */
    storageState: path.resolve(__dirname, '.auth/storageState.json'),

    /* Recopilar trazas siempre (necesario para ver detalles en UI mode) */
    trace: 'on',

    /* Timeout de acciones individuales (clicks, fills, etc.) */
    actionTimeout: 15_000,

    /* Timeout de navegación */
    navigationTimeout: 30_000,
  },

  /* Timeout global por test */
  timeout: 60_000,

  /* Setup global: realiza el login una sola vez y guarda la sesión */
  globalSetup: './global-setup.ts',

  /* Proyectos de navegador */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});

