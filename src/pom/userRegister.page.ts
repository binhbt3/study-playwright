import { Page, TestInfo } from "@playwright/test";
import * as WebUI from '../keyword/WebUI'
import test from "node:test";

const inputUserName = "//input[@id='username']";
const inputEmail = "#email";
const optionCountry = "#country";
const inputDateOfBirth = "#dob";
const inputRating = "#rating";
const inputFavoriteColor = "#favcolor";
const inputNewsLetter = "#newsletter";
const inputProfilePicture = "#profile";
const inputBiography = "#bio";
const spanTooltip = ".tooltip";
const spanEnableFeature = "//span[@class='slider round']";

export class UserRegister {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickOnRegisterButton(testInfo: TestInfo) {
        await WebUI.clickElement(this.page, "//button[@type='submit']", testInfo);
    }

    async fillInformation(data: {
        username: string, email: string, gender: string, hobbies: string, interests: string[],
        country: string, dateOfBirth: string, profilePicture: string, biography: string, rateUs: string, favoriteColor: string, newsLetter: boolean, enableFeature: boolean
    }, testInfo: TestInfo) {
        await WebUI.fillText(this.page, inputUserName, data.username, testInfo);
        await WebUI.fillText(this.page, inputEmail, data.email, testInfo);

        await WebUI.checkElement(this.page, "input[id='" + data.gender + "']", testInfo);
        await WebUI.verifyElementChecked(this.page, "input[id='" + data.gender + "']", testInfo);

        await WebUI.checkElement(this.page, "//label[text()='" + data.hobbies + "']", testInfo);
        await WebUI.verifyElementChecked(this.page, "//label[text()='" + data.hobbies + "']", testInfo);

        await WebUI.selectMultipleOptionsByText(this.page, optionCountry, data.country.split(" "), testInfo);
        await WebUI.verifySelectByText(this.page, optionCountry, data.country.split(" "), testInfo);

        await WebUI.selectMultipleOptionsByText(this.page, "#interests", data.interests, testInfo);
        await WebUI.verifySelectByText(this.page, "#interests", data.interests, testInfo);


        await WebUI.verifyOptionTotal(this.page, optionCountry, testInfo);


        await WebUI.fillText(this.page, inputDateOfBirth, data.dateOfBirth, testInfo);
        await WebUI.fillText(this.page, inputRating, data.rateUs, testInfo);
        await WebUI.fillText(this.page, inputFavoriteColor, data.favoriteColor, testInfo);

        if (data.newsLetter) {
            await WebUI.checkElement(this.page, inputNewsLetter, testInfo);
        }

        await WebUI.uploadFile(this.page, inputProfilePicture, data.profilePicture, testInfo);

        await WebUI.fillText(this.page, inputBiography, data.biography, testInfo);

        await WebUI.hoverOnElement(this.page, spanTooltip, testInfo);

        if (data.enableFeature) {
            await WebUI.clickElement(this.page, spanEnableFeature, testInfo);
        }

    }

}