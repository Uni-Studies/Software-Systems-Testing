// saveStorageState.ts
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://accounts.google.com');
  
  await page.pause(); // трябва да се направи ръчно логване 

  await context.storageState({ path: 'googleStorageState.json' });
  await browser.close();
})();
