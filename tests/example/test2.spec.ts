import { test } from '@playwright/test';
// import { clickVisibleElement, getPathDownloadDirectory, countFilesInDownloadDirectory, verifyFileContainsInDownloadDirectory } from '../utils/keyword'

import * as WebUI from '../../src/keyword/WebUI'

test('User1 Registration Flow', async ({ page }) => {
  console.log("==============")
  console.log("Test1")
  // console.log(WebUI.getPathDownloadDirectory());
  // WebUI.countFilesInDownloadDirectory();
  // WebUI.verifyFileContainsInDownloadDirectory("keyma")
  // WebUI.verifyFileEqualsInDownloadDirectory("keymap.txt")
  // WebUI.verifyDownloadFileContainsNameCompletedWaitTimeout("key", 3000)
  // WebUI.verifyDownloadFileEqualsNameCompletedWaitTimeout("keymap.txt", 1000)
  // WebUI.deleteAllFilesInDownloadDirectory();

  await test.step('Navigate to Material Playwright page', async () => {
    await page.goto('https://material.playwrightvn.com/', { timeout: 6000 });
  });

  await WebUI.setWindowSize(page, 1024, 768);
  const viewPort = WebUI.getWindowSize(page);

  console.log("24: ", viewPort?.width)
  console.log("25: ", viewPort?.height)
  
  await test.step('Click on Product page', async () => {
    // await page.locator("//a[@href='02-xpath-product-page.html']").click();
    await WebUI.clickElement(page, "//a[@href='02-xpath-product-page.html']")
  });

  await test.step('Add 2 products 1', async () => {
    for (let i = 0; i < 2; i++) {
      await page.locator("//button[@data-product-id='1']").click();
    }
  });

  await test.step('Add 3 products 2', async () => {
    await page.locator("//button[@data-product-id='2']").click({ clickCount: 3 });
  });

  await test.step('Add 1 products 3', async () => {
    await page.locator("//button[@data-product-id='3']").click();
  });
});
