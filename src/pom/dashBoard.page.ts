import { Page, TestInfo } from "@playwright/test";
import * as WebUI from '../keyword/WebUI';

export class DashBoardPage {
    page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async clickOnUserRegistration(testInfo: TestInfo){
        await WebUI.clickElement(this.page, "//a[@href='01-xpath-register-page.html']", testInfo)
    }
}