import type { Locator, Page } from '@playwright/test';
import { HelperBase } from '../Helper/helperBase.ts';

export class LogInPage extends HelperBase {
    
    readonly usernameTextbox: Locator;
    readonly passwordTextbox: Locator;  
    readonly loginButton: Locator; 
    readonly googleLoginButton: Locator;

    constructor(page: Page) {
        super(page);
        
        this.usernameTextbox = page.locator('id=email');
        this.passwordTextbox = page.locator('id=password');
        this.loginButton = page.locator('input:has-text("Вход")');
        this.googleLoginButton = page.locator('#loginForm > a.btn.btn-success.btn-block.googleLogin')
    }   
}