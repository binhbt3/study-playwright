import { test,expect } from '@playwright/test'
import * as WebUI from '../../src/keyword/WebUI'



test('Count open windows or tabs', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage(); // Open first tab
    const page2 = await context.newPage(); // Open second tab

    const numberOfWindows = WebUI.verifyNumberOfWindows(browser, 2);
    console.log(`Number of open windows: ${numberOfWindows}`);

    expect(numberOfWindows).toBe(2); // Verify the count
})

test('test 1', async ({ page }) => {
    await test.step("Navigate to Material paywright page", async () => {
        await page.goto("https://material.playwrightvn.com/", { timeout: 6000 })
    })
    await test.step("Click on User Registration", async () => {
        await page.locator("//a[@href='01-xpath-register-page.html']").click()
    })


    await test.step("Fill information", async () => {

        await page.locator("//input[@id='username']").fill("binh")

        await page.locator("#email").pressSequentially("bui.binh.k56@gmail.com", { delay: 10 })

        await page.locator("input[id='female']").check();

        await page.locator("#traveling").check()

        await page.locator("#country").selectOption("Australia")

        await page.locator("#interests").selectOption(["Art", "Music"])
        await WebUI.selectMultipleOptionsByText(page, "#country", ["Australia"]);
        await WebUI.verifySelectByText(page, "#country", ["Australia"]);
        await WebUI.selectOptionByValue(page, "#country", "canada");
        await WebUI.verifySelectByValue(page, "#country", "canada");

        await WebUI.verifyOptionTotal(page, "#country");
        await WebUI.selectOptionByIndex(page, "#country", 1);
        await WebUI.verifySelectByIndex(page, "#country", 1);
        
    

        await page.locator("#dob").fill("2024-01-05")

        await page.locator("#rating").fill("9");

        await page.locator("#favcolor").fill("#d9c9c9")

        await page.locator("#newsletter").check()

        await page.locator("#profile").setInputFiles("readme.md")

        await page.locator("#bio").fill("My name is Binh. I am 32 years old")

        await page.locator(".tooltip").hover();

        await page.locator("//span[@class='slider round']").click()

    })

    // await test.step('Click on button Register', async() => {
    //     await page.locator("//button[@type='submit']").click()
    // })


    // await page.locator("//tbody/tr").isVisible();
})


test('test2', async() => {

})
