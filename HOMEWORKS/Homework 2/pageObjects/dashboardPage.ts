import type { Locator, Page } from '@playwright/test';
import { HelperBase } from '../Helper/helperBase.ts';

export class DashboardPage extends HelperBase {
    
    readonly chatbotBtn: Locator;
    readonly exitBtn: Locator;

    constructor(page: Page) {
        super(page);
        
        this.chatbotBtn = page.locator('#offline-icon');
        this.exitBtn = page.locator('body > div.all-content-wrapper.mainContent > div.header-advance-area > div.header-top-area > div > div > div > div > div > div.col-lg-11.col-md-11.col-sm-12.col-xs-12 > div > ul > li.nav-item.open > ul > li:nth-child(3) > a');
    }   
}