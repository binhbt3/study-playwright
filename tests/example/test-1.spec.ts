import { test, expect } from '@playwright/test';
import * as WebUI from '../../src/keyword/WebUI'

test('test', async ({ page }) => {
  // await page.goto('https://material.playwrightvn.com/');
  // await page.getByRole('link', { name: 'Bài học 2: Product page' }).click();
  // await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  // await page.getByRole('button', { name: 'Add to Cart' }).nth(1).click();
  // await page.getByRole('button', { name: 'Add to Cart' }).nth(2).click();
  // await page.getByRole('row', { name: 'Product 2 $20.00 1 $20.00' }).getByRole('button').click();
  WebUI.verifyEquals("2","2");
  WebUI.verifyTrue(true);
  WebUI.verifyTrue(false);
  WebUI.verifyTrue(0);
  WebUI.verifyTrue(123);
  

})


test('Count open windows or tabs', async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage(); // Open first tab
  const page2 = await context.newPage(); // Open second tab

  const numberOfWindows = WebUI.verifyNumberOfTabs(context, 2);
  console.log(`Number of open windows: ${numberOfWindows}`);

})