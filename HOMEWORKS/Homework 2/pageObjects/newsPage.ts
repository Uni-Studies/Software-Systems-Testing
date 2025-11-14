import type { Locator, Page } from '@playwright/test';
import { HelperBase } from '../Helper/helperBase.ts';

export class NewsPage extends HelperBase {
    
    readonly newsContainer: Locator;

    constructor(page: Page) {
        super(page);
        
        this.newsContainer = page.locator('body > div.all-content-wrapper.mainContent > ul');
    }   
}