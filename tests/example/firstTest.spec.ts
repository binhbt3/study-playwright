import { test } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('https://www.google.com.vn/');
// });

test.beforeAll(() => {

})

test('example test', async ({ page }) => {
  // Các hành động kiểm thử của bạn ở đây
  //   (await page.waitForSelector("//textarea[@title='Rechercher']")).inputValue(); // Kiểm tra xem thanh tìm kiếm đã xuất hiện chưa
});

test.describe("suite 1", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.google.co.uk/');
  });

  test('example test', async ({ page }) => {
    // Các hành động kiểm thử của bạn ở đây
    //   (await page.waitForSelector("//textarea[@title='Rechercher']")).inputValue(); // Kiểm tra xem thanh tìm kiếm đã xuất hiện chưa
  });

})

test('Locator syntax rules', async ({ page }) => {
  // by tag name
  page.locator('tagname')
  await page.locator('tagname').first().click()


  //by id 
  page.locator('#id')

  //by class value
  page.locator('.classvalue')

  // by attribute
  page.locator("[placeholder='Email']")

  // by class value
  page.locator("[class='class_value']")

  //by combine different selectors
  page.locator("input[placeholder='Email'][second_attribute]")

  //by xpath(NOT RECOMMENDED)
  page.locator("//*[@id='inputEmail']")

  //by partial text match
  page.locator(":text('Using')")

  //by exact text
  page.locator(":text-is('Using exact text')")

})

test('locating child elements', async ({ page }) => {
  await page.goto('https://mui.com/material-ui/react-radio-button/')
  await page.locator("(//div[@role='radiogroup'])[1]//span[text()='Male']").click()
  // await page.locator('div').getByRole('radiogroup').nth(0).locator('label').locator('span').locator(":text-is('Male')").click()
})


test('locating parent elements', async ({ page }) => {
  // await page.goto('https://mui.com/material-ui/react-radio-button/')
  await page.locator("tagname", { hasText: "Text" })
  await page.locator("tagname", { has: page.locator('#id') })

  await page.locator("tagname").filter({ hasText: "Text" })
  await page.locator("tagname").filter({ has: page.locator('#id') })
  await page.locator("tagname").filter({ has: page.locator('tagname') }).filter({ hasText: "Text" })
})

test('locating elements', async ({ page }) => {
  await page.goto("https://demo.growcrm.io/login")
  // await page.getByRole("button", {name: "Continue"}).click()
  await page.locator("button", { hasText: "Continue" }).click()
})