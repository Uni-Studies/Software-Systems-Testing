import type { Locator, Page } from '@playwright/test';
import { HelperBase } from '../Helper/helperBase.ts';

export class SoftwarePage extends HelperBase {
    
    readonly windows11DownloadLink: Locator;

    constructor(page: Page) {
        super(page);
        
        this.windows11DownloadLink = page.locator('#informationContainer > div > div > div > div > div:nth-child(1) > div > div:nth-child(3) > p:nth-child(2) > a');
    }   
}