import type { Locator, Page } from '@playwright/test';
import { HelperBase } from '../Helper/helperBase.ts';

export class GmailPage extends HelperBase {
    
    readonly toGmailBtn: Locator;

    constructor(page: Page) {
        super(page);
        
        this.toGmailBtn = page.locator('body > div.all-content-wrapper.mainContent > div.single-pro-review-area.mt-t-30.mg-b-15.mg-t-30 > div > div > div.col-lg-4.col-md-4.col-sm-4.col-xs-12 > div > div.profile-details-hr > div > div > div.mg-t-15.btnGS > a.btn.btn-custon-rounded-four.btn-default.loginBtnGS');
    }   
}