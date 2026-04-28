import { Page } from '@playwright/test';

/**
 * Realiza el login en DexVision QA usando credenciales de variables de entorno.
 * Equivalente a cy.loginSession() de Cypress.
 */
export async function loginSession(page: Page): Promise<void> {
  await page.goto('/');

  // Selectores de login
  await page.locator('#username').waitFor({ state: 'visible' });
  await page.locator('#username').fill(process.env.USER_DEXVISION!);
  await page.locator('#password').fill(process.env.PASS_DEXVISION!);
  await page.locator('.pf-c-button').filter({ hasText: 'Sign In' }).click();

  // Validar que el login terminó (URL no incluye "login")
  await page.waitForURL(/^(?!.*login).*$/);
}
