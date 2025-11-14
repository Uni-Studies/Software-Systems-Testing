import type { Page } from '@playwright/test';

export class HelperBase {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForNumberOfSeconds(seconds: number): Promise<void> {
        return this.page.waitForTimeout(seconds * 1000);
    }
}