import type { Locator, Page } from '@playwright/test';
import { HelperBase } from '../Helper/helperBase.ts';

export class ProfileSettingsPage extends HelperBase {
    
    readonly uploadImageButton: Locator;
    
    constructor(page: Page) {
        super(page);

        this.uploadImageButton = page.locator('#insert[value="Добави профилна снимка"]');
    }   
}