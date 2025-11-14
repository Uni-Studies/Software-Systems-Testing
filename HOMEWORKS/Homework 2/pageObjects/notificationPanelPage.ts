import type { Locator, Page } from '@playwright/test';
import { HelperBase } from '../Helper/helperBase.ts';

export class NotificationPanelPage extends HelperBase {
    
    readonly notificationPanelContainer: Locator;

    constructor(page: Page) {
        super(page);

        this.notificationPanelContainer = page.locator('body > div.all-content-wrapper.mainContent > div.header-advance-area > div.header-top-area > div > div > div > div > div > div.col-lg-11.col-md-11.col-sm-12.col-xs-12 > div > ul > li.nav-item.open > div');
    }   
}