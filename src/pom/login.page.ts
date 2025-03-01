import { Page } from "@playwright/test";

export class LoginPage {
    page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async fillInformation(username: string, password: string){
        //fill user name
        await this.page.locator("#user_login").fill(username)
        //fill password
        await this.page.fill("#user_pass", password)

    }

    async login(){
        //click button logi
        await this.page.click("#wp-submit")
    }
}