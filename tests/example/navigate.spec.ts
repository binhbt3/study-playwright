import { expect, test } from '@playwright/test'
import { TIMEOUT } from 'dns'
import path from 'path'


test('Basic action', async ({ page }) => {
    await page.goto("https://material.playwrightvn.com/018-mouse.html")

    // singe click
    await page.locator("#clickArea").click()
    // await page.goto("https://google.com.vn")

    // double click
    await page.locator("#clickArea").dblclick()

    // right click
    // await page.locator("#clickArea").click({
    //     button: 'right'
    // })

    //Ket hop phim khac
    await page.locator("#clickArea").click({ modifiers: ["Shift"] })
})


test("Multiple page", async ({ page }) => {
    await page.goto("https://material.playwrightvn.com/018-mouse.html")

    // singe click
    await page.locator("#clickArea").click()


    const page2 = await page.context().newPage();
    page2.goto("https://material.playwrightvn.com/018-mouse.html")
    await page2.locator("#clickArea").click({ modifiers: ["Shift"] })

})

test('Basic fill text', async ({ page }) => {
    await page.goto("https://material.playwrightvn.com/01-xpath-register-page.html");

    // fill text
    await page.locator("//input[@id='username']").fill("binh")

    await page.locator("#email").pressSequentially("bui.binh.k56@gmail.com", { delay: 10 })

    // const isFemale =  await page.locator("#female").isChecked()
    //  console.log(isFemale)

    await page.locator("input[id='female']").check();

    await page.locator("#traveling").check()
    let isTraveling = await page.locator("#traveling").isChecked();
    console.log(isTraveling);
    await page.locator("#cooking").check()
    await page.locator("#traveling").uncheck()
    isTraveling = await page.locator("#traveling").isChecked();
    console.log(isTraveling);
})

test('Select', async ({ page }) => {
    await page.goto("https://material.playwrightvn.com/01-xpath-register-page.html");

    await page.locator("#country").selectOption("Australia")

    await page.locator("#interests").selectOption(["Art", "Music"])
})

test('Date picker, slider, color picker', async ({ page }) => {
    await page.goto("https://material.playwrightvn.com/01-xpath-register-page.html");
    await page.locator("#dob").fill("2024-01-05")

    await page.locator("#rating").fill("9");

    await page.locator("#favcolor").fill("#d9c9c9")
})

test('Handle file, hover', async ({ page }) => {
    try {
        await page.goto("https://material.playwrightvn.com/01-xpath-register-page.html", { timeout: 4000, waitUntil: 'load' });
        console.log("Page loaded successfully");
    } catch (error) {
        console.log("Failed to load the page: ", error.message);
    }

    await page.locator("#profile").setInputFiles("readme.md")
    await page.locator(".tooltip").hover();


})

test('Handle new tab when click', async ({ page }) => {
    await page.goto("https://material.playwrightvn.com/06-new-tab.html")

    const [newPage] = await Promise.all([page.waitForEvent("popup"), page.click("//a[@href='https://www.example.com']")])
    // await page.locator("//a[@href='https://www.example.com']").click()

    await newPage.click("//a")
})
test('Interact with random dialog', async ({ page }) => {
    await test.step('Navigate to material', async () => {
        await page.goto("https://material.playwrightvn.com/025-page-with-random-dialog.html");
    });

    await test.step("Accept dialog", async () => {
        // Set up the dialog handler
        page.on('dialog', async (dialog) => {
            console.log(`Dialog message: ${dialog.message()}`); // Log the dialog message for debugging
            await dialog.accept();
        });

        // Wait for the element indicating success (e.g., #welcome) to be visible
        const welcomeLocator = page.locator("//p[@id='welcome']");
        await expect(welcomeLocator).toBeVisible({ timeout: 30000 });
    });
});

test('Handle multiple ta showed randomly', async({page}) => {
    await page.goto("https://material.playwrightvn.com/021-page-random-open-new-page.html")

    const newPage = await page.waitForEvent("popup")

})

test('Download file with event', async({page}) => {
    await page.goto("https://material.playwrightvn.com/021-import-export.html")

    const downloadPromise = page.waitForEvent("download")
    await page.getByText("Export CSV").click()

    const download = await downloadPromise

    await download.saveAs("D:/SPECTOS/playwright/pwpracticeapp/demotest2/tests/abc.csv")

}
)

test('Download file without event', async({page}) => {
    await page.goto("https://material.playwrightvn.com/021-import-export.html")

    page.on("download", download => {
        download.saveAs(download.suggestedFilename())
    })

    await page.getByText("Random Export").click()
    await page.waitForTimeout(10000)
})

test('Import File', async({page}) => {

    await page.goto("https://material.playwrightvn.com/021-import-export.html")

    const filePath = path.resolve("student_data.csv")

    await page.locator("//input[@id='importInput']").setInputFiles(filePath)

})


test('Import File Error', async({page}) => {

    await page.goto("https://material.playwrightvn.com/021-import-export.html")
    page.on("dialog", async dialog => {
        console.log(`Dialog message: ${dialog.message()}`)
        await dialog.accept()
    })

    const filePath = path.resolve("readme.md")

    await page.locator("//input[@id='importInput']").setInputFiles(filePath)

    await page.waitForTimeout(10_000)

})

