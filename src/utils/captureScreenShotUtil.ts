import { Page, TestInfo } from '@playwright/test';
import * as FramworkConstants from '../constants/framework-constants'

/**
 * Captures a screenshot of the current page and attaches it to the test report.
 * @param page - The Playwright Page instance.
 * @param stepName - A descriptive name for this screenshot.
 * @param testInfo - The TestInfo object provided by Playwright.
 */
export async function captureScreenshot(page: Page, stepName: string, testInfo: TestInfo | null): Promise<void> {
    // console.log('SCREENSHOT_ALL_STEPS: ' , FramworkConstants.SCREENSHOT_ALL_STEPS);
    if (FramworkConstants.SCREENSHOT_ALL_STEPS === 'yes' && testInfo !== null) {
        const screenshotBuffer = await page.screenshot({ fullPage: true });
        console.log('screenshotBuffer: ' , screenshotBuffer);
        await testInfo.attach(stepName, { body: screenshotBuffer, contentType: 'image/png' });
        console.log(`📸 Screenshot for step "${stepName}" captured and attached.`);
    }
}
