import {test, expect} from '@playwright/test';
import { LogInPage } from '../pageObjects/loginPage.ts';
import { SoftwarePage } from '../pageObjects/softwarePage.ts';
import { ProfileSettingsPage } from '../pageObjects/profileSettingsPage.ts';
import { DashboardPage } from '../pageObjects/dashboardPage.ts';
import { GmailPage } from '../pageObjects/gmailPage.ts';
import { NewsPage } from '../pageObjects/newsPage.ts';
import { NotificationPanelPage } from '../pageObjects/notificationPanelPage.ts';

let loginPage: LogInPage; // глобална променлива; ще бъде нужна за всички тестове

test.beforeEach(async ({page}) => {
    await page.goto('/');
    loginPage = new LogInPage(page);
});


// TEST 1 

/*
За да изпълните този тест, трябва в terminal-а да зададете environment променливи 
с валидните за Вас username и password за вход във ФМИ системата.
Препоръчвам да пуснете теста през UI инструмента на Playwright, защото там се запазват променливите.
    $env:FMI_USERNAME = "your_username"; $env:FMI_PASSWORD = "your_pass"; npx playwright test --ui
*/

test('successfull login with valid credentials', async ({page}) => {
    if (!process.env.FMI_USERNAME || !process.env.FMI_PASSWORD) {
        throw new Error('Missing FMI_USERNAME or FMI_PASSWORD environment variables');
    }   

    const username = process.env.FMI_USERNAME;
    const password = process.env.FMI_PASSWORD;

    await loginPage.usernameTextbox.fill(username);
    await loginPage.passwordTextbox.fill(password);
    await loginPage.loginButton.click();

    await page.waitForURL(/dashboard/);
    await expect(page).toHaveURL(/dashboard/);
});

// TEST 2

test('unsuccessfull login with invalid credentials', async ({page}) => {
    await loginPage.usernameTextbox.fill('invalid_user');
    await loginPage.passwordTextbox.fill('invalid_pass');
    await loginPage.loginButton.click();

    await expect(page.locator('text=Грешно потребителско име или парола')).toBeVisible();
});



/* НЕОБХОДИМО ЗА ТЕСТ 3 и за изпълнението на останалите тестове след това!
Трябва да се компилира файлът saveStorageState.ts.
    За тази цел аз изпълних следния код: npx tsx saveStorageState.ts в терминала, 
    за да създам файла googleStorageState.json, в който се запазва сесията за логване в Google.

    Когато изпълните командата, ще се отвори Chromium и 
    ще се наложи да се логнете ръчно в Google с uni-plovdiv.bg имейла.
    Също така би трябвало да се появи и Playwright Inspector-a. 
    Когато се логнете, може да затворите тези два прозореца или 
    да цъкнете Resume в Playwright Inspector-а.


! Ако на някой тест видите timeout error, може да направите timeout-а по-голям в playwright.config.ts, 
  защото ръчното логване изисква повече време.
  Аз съм го задала на 600 000 ms, което значи, че всеки тест има 10 минути да се изпълни.  
*/

// Групирам тестове, които изискват Google storage state
test.describe('with Google storage state', () => {
    test.use({ storageState: 'googleStorageState.json' });
    
    //TEST 3

    test('login with university email via Google', async ({ page }) => {
        await loginPage.googleLoginButton.click();
    
        await page.waitForURL('**/dashboard');
        await expect(page).toHaveURL(/dashboard/);
    });

    // TEST 4

    /* След като изтеглянето на Windows започне, може да го анулирате. 
    Не е нужно да се изтегля целият .iso файл. 

    ! Бележка: Ако пуснете теста през UI средата на Playwright, .iso файлът няма да започне изтеглянето - 
    предполагам заради настройките на тестовия браузър там. 
    Но ще работи, ако го пуснете по стандартния начин - тук във VS Code. 
    */

    test('download windows 11 from software page', async ({ page }) => {
        await loginPage.googleLoginButton.click();
        
        await page.waitForURL('**/dashboard');
        await page.goto('https://e-portal.uni-plovdiv.bg/profile/software');

        const softwarePage = new SoftwarePage(page);
        await softwarePage.windows11DownloadLink.click();
        
        const downloadPromise =  await page.waitForEvent('download');

        expect(downloadPromise.suggestedFilename().toLowerCase()).toMatch(/\.iso/);
    });

    // TEST 5
    test('upload a profile picture without selecting an image', async ({ page }) => {
        await loginPage.googleLoginButton.click();

        await page.waitForURL('**/dashboard');

        const profileSettingsPage = new ProfileSettingsPage(page);
        
        await page.goto('https://e-portal.uni-plovdiv.bg/profile/userSettings');

        // настройвам dialog listener да слуша за alert-и
        // преди да бъде кликнат бутонът за качване на изображение, за да се избегне race condition

        page.once('dialog', dialog => {
            expect(dialog.message()).toContain('Please Select Image');
            dialog.accept();
        });

        await profileSettingsPage.uploadImageButton.click();

    });

    // TEST 6
    test('open chat bot', async ({ page }) => {
        await loginPage.googleLoginButton.click();
        await page.waitForURL('**/dashboard');

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.chatbotBtn.click();
        
        await page.waitForSelector('iframe#lhc_iframe');
        // създавам frame locator за iframe, защото чат панелът се намира в iframe
        const chatFrame = page.frameLocator('iframe#lhc_iframe'); 

        await expect(chatFrame.locator('#widget-layout')).toBeVisible();
    });

    // TEST 7
    test('open gmail', async ({ page, context }) => {

        await loginPage.googleLoginButton.click();
        await page.waitForURL('**/dashboard');

        await page.goto('https://e-portal.uni-plovdiv.bg/profile/mail');
        const gmailPage = new GmailPage(page);

        // Трябва да изчакаме да се отвори нов прозорец след кликването на бутона, защото Gmail се отваря в нов таб
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            gmailPage.toGmailBtn.click()
        ]);

        await newPage.waitForURL(/mail\.google\.com/);
        await expect(newPage).toHaveURL(/mail\.google\.com/);
    });

    // TEST 8
    test('open news portal', async ({ page }) => {
        await loginPage.googleLoginButton.click();
        await page.waitForURL('**/dashboard');

        await page.goto('https://e-portal.uni-plovdiv.bg/profile/news');
        const newsPage = new NewsPage(page);

        expect(newsPage.newsContainer).toBeVisible();
    });

    // TEST 9
    test('open notifications panel', async ({ page }) => {
        await loginPage.googleLoginButton.click();
        await page.waitForURL('**/dashboard');

        const notificationPanelPage = new NotificationPanelPage(page);
            
        await page.waitForSelector('li.nav-item a i', { state: 'visible' });
        await page.locator('li.nav-item a i').first().click();
        
        await expect(notificationPanelPage.notificationPanelContainer).toBeVisible();
    });


    // TEST 10
    test('exit dashboard', async ({ page }) => {
        await loginPage.googleLoginButton.click();
        await page.waitForURL('**/dashboard');

        const dashboardPage = new DashboardPage(page);

        const profileToggle = page.locator('a.nav-link:has(img.userProfileImg), a.nav-link:has(.admin-name)').first();
        await expect(profileToggle).toBeVisible({ timeout: 5000 });
        await profileToggle.click();

        await dashboardPage.exitBtn.click();
        await expect(page).toHaveURL('https://e-portal.uni-plovdiv.bg/account/login/');
    });
});


