import { test } from '@playwright/test';
import path from 'path';
// import { clickVisibleElement, getPathDownloadDirectory, countFilesInDownloadDirectory, verifyFileContainsInDownloadDirectory } from '../utils/keyword'

import * as WebUI from '../../src/keyword/WebUI'


test('Demo WebUI function: download file', async ({ page }) => {
  console.log(WebUI.getPathDownloadDirectory());
  WebUI.countFilesInDownloadDirectory();
  WebUI.deleteAllFilesInDownloadDirectory();
  await WebUI.openUrl(page, "https://toolsfairy.com/code-test/sample-html-files#");
  await WebUI.downloadFile(page, "//a[normalize-space()='Download sample-html-files-sample-5.html']");
  WebUI.countFilesInDownloadDirectory();
  WebUI.verifyTrue(WebUI.verifyFileContainsInDownloadDirectory("sample-html-files-sample"));
  WebUI.verifyTrue(WebUI.verifyFileEqualsInDownloadDirectory("sample-html-files-sample-5.html"));
  WebUI.verifyDownloadFileContainsNameCompletedWaitTimeout("sample-html-files-sample", 3);
  WebUI.verifyDownloadFileEqualsNameCompletedWaitTimeout("sample-html-files-sample-5.html", 1);
  WebUI.deleteAllFilesInDirectory(WebUI.getPathDownloadDirectory());
})


test('Demo set/get window size', async ({ page }) => {
  await WebUI.setWindowSize(page, 1024, 760);
  const viewPort = WebUI.getWindowSize(page);

  console.log("Width: ", viewPort?.width);
  console.log("Height: ", viewPort?.height);

  await WebUI.openUrl(page, 'https://material.playwrightvn.com/');
  await WebUI.rightClickElement(page, "//a[.='Bài học 1: Mở trang ở tab mới']");
  await WebUI.getCurrentUrl(page);
  await WebUI.getPageTitle(page);
  await WebUI.verifyPageContainsText(page, 'Game 02: Pikachu');
  await WebUI.closeCurrentWindow(page);

})

test('Demo import/export file', async( {page} ) => {
  await WebUI.openUrl(page, 'https://material.playwrightvn.com/');
  await WebUI.clickElement(page, "//a[contains(.,'Bài học 10: Xử lý import, export')]");
  const currentDir = WebUI.getCurrentDir();
  const fileImportPath = path.join(currentDir, "tests\\testdata\\fileImport.csv");
  await WebUI.uploadFile(page, "//input[@id='importInput']", fileImportPath);

  WebUI.deleteAllFilesInDownloadDirectory();
  await WebUI.downloadFile(page, "//button[@id='exportButton']");
  WebUI.deleteAllFilesInDownloadDirectory();

  await WebUI.downloadFile(page, "//button[@id='randomExportButton']");
  WebUI.deleteAllFilesInDownloadDirectory();
  
})

test('Demo count open tabs', async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await WebUI.openNewTab(context); // Open first tab
  const page2 = await WebUI.openNewTab(context); // Open second tab

  const numberOfWindows = WebUI.verifyNumberOfTabs(context, 2);
  console.log(`Number of open windows: ${numberOfWindows}`);
  await WebUI.closeCurrentWindow(page1);
  await WebUI.closeCurrentWindow(page2);

})

test('Demo count open windows', async ({ browser }) => {
    const page1 = await WebUI.openNewWindow(browser); // Open first tab
    const page2 = await WebUI.openNewWindow(browser); // Open second tab

    const numberOfWindows = WebUI.verifyNumberOfWindows(browser, 2);
    await WebUI.closeCurrentWindow(page1);
    await WebUI.closeCurrentWindow(page2);
})

test('Demo handle alert', async( {page} ) => {
  await WebUI.openUrl(page, 'https://material.playwrightvn.com/020-alert-confirm-prompt.html');
  await WebUI.clickElement(page, "//button[@id='confirmButton']");
  await WebUI.alertAccept(page);
  // await WebUI.clickElement(page, "//button[@id='confirmButton']");

})

test('User1 Registration Flow', async ({ page }) => {

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
