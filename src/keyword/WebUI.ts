import { Browser, BrowserContext, expect, Locator, Page, selectors, ViewportSize, TestInfo } from '@playwright/test';
import path, { resolve } from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as FramworkConstants from '../constants/framework-constants'
import * as LogUtil from '../utils/logUtil'
import * as CaptrureScreenShotUtil from '../utils/captureScreenShotUtil'


export function generateRandomText(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    // Loop 'length' times and append a random character from 'characters'
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export async function addScreenShootToReport(page: Page) {

    const screenshotPath = 'screenshots/' + generateRandomText() + '.png';
    console.log("33: ", screenshotPath);
    await page.screenshot({ path: screenshotPath, fullPage: true });
}

/**
 * Returns the current stack trace as a string.
 *
 * @returns The stack trace.
 */
export function getStackTrace(): string {
    const error = new Error();
    return error.stack || '';
}

/**
 * Clicks on the specified element and captures a screenshot afterward.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element to click.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots to the test report.
 * @param timeOut - (Optional) Timeout (in ms) to wait for the element to become visible and clickable.
 * @returns A promise that resolves when the click action and screenshot capture are completed.
 */
export async function clickElement(
    page: Page,
    target: string | Locator,
    testInfo: TestInfo | null = null,
    timeOut: number = FramworkConstants.DEFAULT_TIMEOUT
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Debug log: output the timeout value.
    console.log("43: ", timeOut);

    // Determine if the target is a string (selector) or already a Locator.
    if (typeof target === 'string') {
        // Convert the string selector to a Locator.
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Wait for the element to become visible within the given timeout.
        await locator.waitFor({ state: 'visible', timeout: timeOut });
        // Perform a click action on the element with the same timeout.
        await locator.click({ timeout: timeOut });
        // Log a success message if the click action is successful.
        LogUtil.saveLog(`✅ Successfully click on "${identifier}"`);
    } catch (error) {
        // Log the error to the console.
        console.error(`❌ Failed to click on "${identifier}". Error: "${error}"`);
        // Throw an error with a detailed message.
        throw new Error(`❌ Failed to click on "${identifier}". Error: "${error}"`);
    }
    // Capture a screenshot after clicking and attach it to the test report if testInfo is provided.
    await CaptrureScreenShotUtil.captureScreenshot(
        page,
        getStackTrace().split('\n')[3].trim().split(" ")[1],
        testInfo
    );
}

/**
 * Performs a right-click on the specified element and captures a screenshot afterward.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element to right-click.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots.
 * @param timeOut - (Optional) Timeout (in ms) to wait for the element to become visible.
 * @returns A promise that resolves when the right-click action and screenshot capture are completed.
 */
export async function rightClickElement(
    page: Page,
    target: string | Locator,
    testInfo: TestInfo | null = null,
    timeOut: number = FramworkConstants.DEFAULT_TIMEOUT
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine if target is provided as a string or a Locator.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Wait until the element is visible.
        await locator.waitFor({ state: 'visible', timeout: timeOut });
        // Perform a right-click action on the element.
        await locator.click({ button: 'right', timeout: timeOut });
        // Log the successful right-click action.
        LogUtil.saveLog(`✅ Successfully perform right click on "${identifier}"`);
    } catch (error) {
        console.error(`❌ Failed to perform right click on "${identifier}". Error: "${error}"`);
        throw new Error(`❌ Failed to perform right click on "${identifier}". Error: "${error}"`);
    }
    // Capture a screenshot after the right-click action.
    await CaptrureScreenShotUtil.captureScreenshot(
        page,
        getStackTrace().split('\n')[3].trim().split(" ")[1],
        testInfo
    );
}

/**
 * Sets the window (viewport) size for the given page.
 *
 * @param page - The Playwright Page instance.
 * @param width - The desired width of the viewport.
 * @param height - The desired height of the viewport.
 * @returns A promise that resolves once the viewport size is set.
 */
export async function setWindowSize(page: Page, width: number, height: number): Promise<void> {
    // Set the viewport size using the provided width and height.
    await page.setViewportSize({ width, height });
}

/**
 * Retrieves the current viewport size of the page.
 *
 * @param page - The Playwright Page instance.
 * @returns The viewport size as an object containing width and height, or null if not set.
 */
export function getWindowSize(page: Page): ViewportSize | null {
    // Get the current viewport size of the page.
    const viewport = page.viewportSize();
    return viewport;
}

/**
 * Returns a Locator for the specified selector.
 *
 * @param page - The Playwright Page instance.
 * @param selector - The CSS selector string to locate the element.
 * @returns The Locator corresponding to the selector.
 */
export function getWebLocator(page: Page, selector: string): Locator {
    return page.locator(selector);
}


/**
 * 
 * @param page - The playwright page instance
 * @param selector - The selector for the file input element
 * @returns 
 */
export async function getWebLocators(page: Page, selector: string): Promise<Locator[]> {
    const locators: Locator[] = [];
    const elements = page.locator(selector);
    const count = await elements.count();
    if (count > 0) {
        for (let i = 0; i < count; i++) {
            locators.push(elements.nth(i));
        }
    }
    return locators;
}

/**
 * Returns the current working directory of the Node.js process.
 *
 * @returns A string representing the current working directory.
 */
export function getCurrentDir(): string {
    return process.cwd();
}


/**
 * 
 * @param page - The Playwright Page instance
 * @param selector - The selector for the file input element
 * @param filePath - the path to the file that needs to be uploaded
 * @throws will throw an error if the file path does not exist or is not valid file
 */
export async function uploadFile(page: Page, target: string | Locator, filePath: string, testInfo: TestInfo | null = null): Promise<void> {
    let locator: Locator;
    let identifier;

    // Determine the type of target (string selector or Locator).
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`File Path : "${filePath}" is not existed!`);
    }
    if (!fs.statSync(filePath).isFile()) {
        throw new Error(`File Path: "${filePath}" is not a file!`);
    }
    try {
        await locator.setInputFiles(filePath);
        LogUtil.saveLog(`✅ Successfully upload file: "${filePath}" on "${identifier}"`);
    } catch (error) {
        LogUtil.saveLog(`❌ Failed to upload file: "${filePath}" on "${identifier}". Error: "${error}"`);
        throw new Error(`❌ Failed to upload file: "${filePath}" on "${identifier}". Error: "${error}"`);
    }
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);

}

/**
 * 
 * @param page - The Playwright Page instance
 * @returns Promise<string> return the current url
 */
export async function getCurrentUrl(page: Page): Promise<string> {
    LogUtil.saveLog(`Current url: "${page.url()}"`)
    return page.url();
}

/**
 * 
 * @param page - The Playwright Page instance
 * @returns Promise<string> return title of the page
 */
export async function getPageTitle(page: Page): Promise<string> {
    const title = await page.title();
    LogUtil.saveLog(`Get page title: "${title}"`)
    return title;
}

/**
 * Verify whether page content include text
 * @param page - The Playwright Page instance
 * @param text - The text string to search for within page content
 * @returns A Promise<boolean> indicating whether page content cotain specific text
 */
export async function verifyPageContainsText(page: Page, text: string): Promise<boolean> {
    try {
        // Retrieve the full HTML content of the page.
        const content = await page.content();

        // Check if the specified text is present in the page content.
        const containsText = content.includes(text);

        // Log the result.
        if (containsText) {
            LogUtil.saveLog(`✅ The page contains the text: "${text}"`);
        } else {
            console.warn(`❌ The page does not contain the text: "${text}"`);
            throw new Error(`❌ The page does not contain the text: "${text}"`);
        }

        return containsText;
    } catch (error) {
        // Log and re-throw any errors encountered during execution.
        console.error(`❌ Error occurred while verifying text on page. Error: "${error}"`);
        throw new Error(`❌ Failed to verify whether the page contains the text: "${text}". Error: "${error}"`);
    }
}

/**
 * Verifies whether the specified element is checked (e.g., checkbox or radio button).
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the target element.
 * @param timeOut - Optional timeout (in milliseconds) for waiting until the element is visible (default is 5000ms).
 * @returns A Promise<boolean> indicating whether the element is checked.
 * @throws An error if the element is not visible or not checked.
 */
export async function verifyElementChecked(page: Page, target: string | Locator, testInfo: TestInfo | null = null, timeOut: number = FramworkConstants.DEFAULT_TIMEOUT): Promise<boolean> {
    let locator: Locator;
    let identifier;

    // Determine the type of target (string selector or Locator).
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Wait for the element to become visible within the specified timeout.
        await locator.waitFor({ state: 'visible', timeout: timeOut });
        // Check if the element is in a "checked" state
        if (!(await locator.isChecked())) {
            throw new Error(`Verify failed element with "${identifier}" is not checked`)
        }
        LogUtil.saveLog((`✅ Verify element with "${identifier}" is checked`));
        return true;
    } catch (error) {
        console.error(`❌ Verify failed for "${identifier}". Error: "${error}"`);
        throw new Error(`❌ Verify failed for "${identifier}". Error: "${error}"`);
    }
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Checks an element (checkbox or similar) and ensures it is "checked".
 * If the element is not already checked, it performs a check action.
 * Logs the result of the operation.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots to the report.
 * @param timeOut - Timeout in milliseconds to wait for the element to be visible.
 * @returns A promise that resolves to true if the element is successfully checked.
 */
export async function checkElement(
    page: Page,
    target: string | Locator,
    testInfo: TestInfo | null = null,
    timeOut: number = FramworkConstants.DEFAULT_TIMEOUT
): Promise<boolean> {
    let locator: Locator;
    let identifier: string;

    // Determine if the target is a string selector or a Locator.
    if (typeof target === 'string') {
        // Convert the string selector to a Locator using a helper.
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Wait for the element to become visible within the provided timeout.
        await locator.waitFor({ state: 'visible', timeout: timeOut });

        // If the element is not already checked, then perform the check action.
        if (!await locator.isChecked()) {
            await locator.check();
            LogUtil.saveLog(`✅ Element with "${identifier}" is checked`);
        }
        return true;
    } catch (error) {
        // Log the error and rethrow it if the element could not be checked.
        console.error(`❌ Failed to check "${identifier}". Error: "${error}"`);
        throw new Error(`❌ Failed to check "${identifier}". Error: "${error}"`);
    }
    // NOTE: The following screenshot capture call is unreachable because of the return or throw above.
    await CaptrureScreenShotUtil.captureScreenshot(
        page,
        getStackTrace().split('\n')[3].trim().split(" ")[1],
        testInfo
    );
}

/**
 * Placeholder for a function to select an option dynamically.
 * TODO: Implement dynamic option selection logic.
 *
 * @param page - The Playwright Page instance.
 * @param text - The text to select.
 * @param testInfo - (Optional) TestInfo object.
 */
export async function selectOptionDynamic(page: Page, text: string, testInfo: TestInfo | null = null): Promise<void> {
    // TODO: Implement dynamic option selection logic.
}

/**
 * Placeholder for a function to verify that a dynamic option exists.
 * TODO: Implement verification logic for dynamic option existence.
 *
 * @param page - The Playwright Page instance.
 * @param text - The text of the dynamic option.
 * @param testInfo - (Optional) TestInfo object.
 */
export async function verifyOptionDynamicExist(page: Page, text: string, testInfo: TestInfo | null = null): Promise<void> {
    // TODO: Implement dynamic option existence verification.
}

/**
 * Placeholder for a function to get the total count of dynamic options.
 * TODO: Implement logic to count dynamic options.
 *
 * @param page - The Playwright Page instance.
 * @param text - The text to match (if needed).
 * @param testInfo - (Optional) TestInfo object.
 * @returns A promise that resolves to the total count of dynamic options.
 */
export async function getOptionDynamicTotal(page: Page, text: string, testInfo: TestInfo | null = null): Promise<number> {
    // TODO: Implement dynamic option total count logic.
    return 10;
}

/**
 * Selects multiple options in a dropdown based on an array of option texts.
 * It waits for the dropdown to be visible, selects the options, logs the outcome,
 * and captures a screenshot after the action.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the dropdown element.
 * @param options - An array of option texts to be selected.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots.
 * @param timeOut - Timeout in milliseconds for waiting for the dropdown to be visible.
 */
export async function selectMultipleOptionsByText(
    page: Page,
    target: string | Locator,
    options: string[],
    testInfo: TestInfo | null = null,
    timeOut: number = FramworkConstants.DEFAULT_TIMEOUT
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Convert the target to a Locator if it is a string.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Wait for the dropdown element to become visible.
        await locator.waitFor({ state: 'visible', timeout: timeOut });
        // Select the multiple options provided in the array.
        await locator.selectOption(options);
        LogUtil.saveLog(`✅ Successfully selected option by text: "${options}" in dropdown: "${identifier}"`);
    } catch (error) {
        console.error(`❌ Failed to select option by text: "${options}" in dropdown: "${identifier}". Error: "${error}"`);
        throw new Error(`❌ Failed to select option by text: "${options}" in dropdown: "${identifier}". Error: "${error}"`);
    }
    // Capture a screenshot after the selection operation.
    await CaptrureScreenShotUtil.captureScreenshot(
        page,
        getStackTrace().split('\n')[3].trim().split(" ")[1],
        testInfo
    );
}


/**
 * Selects an option in a dropdown based on the option's value attribute.
 * 
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the dropdown element.
 * @param text - The value attribute of the option to select.
 * @param testInfo - (Optional) TestInfo object to attach screenshots to the test report.
 * @param timeOut - (Optional) Timeout to wait for the dropdown to be visible.
 * @returns A promise that resolves once the option is selected and a screenshot is captured.
 */
export async function selectOptionByValue(
    page: Page,
    target: string | Locator,
    text: string,
    testInfo: TestInfo | null = null,
    timeOut: number = FramworkConstants.DEFAULT_TIMEOUT
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine if target is a string or a Locator.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Wait until the dropdown element becomes visible.
        await locator.waitFor({ state: 'visible', timeout: timeOut });
        // Select the option by matching the value attribute.
        await locator.selectOption({ value: text });
        LogUtil.saveLog(`✅ Successfully selected option by value: "${text}" in dropdown: "${identifier}"`);
    } catch (error) {
        throw new Error(`❌ Failed to select option by value: "${text}" in dropdown: "${identifier}" due to error: "${error}"`);
    }
    // Capture a screenshot after the operation.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Selects an option in a dropdown based on the option's index.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the dropdown element.
 * @param number - The index of the option to select.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots.
 * @param timeOut - (Optional) Timeout to wait for the dropdown to be visible.
 * @returns A promise that resolves once the option is selected and a screenshot is captured.
 */
export async function selectOptionByIndex(
    page: Page,
    target: string | Locator,
    number: number,
    testInfo: TestInfo | null = null,
    timeOut: number = FramworkConstants.DEFAULT_TIMEOUT
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Convert target to a Locator if it's a string.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    try {
        // Wait until the dropdown becomes visible.
        await locator.waitFor({ state: 'visible', timeout: timeOut });
        // Select the option using the provided index.
        await locator.selectOption({ index: number });
        LogUtil.saveLog(`✅ Successfully selected option by index: "${number}" in dropdown: "${identifier}"`);
    } catch (error) {
        throw new Error(`❌ Failed to select option by index: "${number}" in dropdown: "${identifier}" due to error: "${error}"`);
    }
    // Capture a screenshot after selection.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Retrieves and returns the total number of options in a dropdown element.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the dropdown.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots.
 * @returns A promise that resolves to the total number of options.
 */
export async function verifyOptionTotal(
    page: Page,
    target: string | Locator,
    testInfo: TestInfo | null = null
): Promise<number> {
    let locator: Locator;
    let identifier: string;

    // Convert target to a Locator if necessary.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    // Locate all the <option> elements inside the dropdown.
    const options = locator.locator('option');
    const totalOption = await options.count();
    LogUtil.saveLog(`✅ Total options in dropdown (${identifier}) is "${totalOption}"`);
    // Capture a screenshot after counting options.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
    return totalOption;
}

/**
 * Verifies that specific options, identified by their text, are selected in a dropdown.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the dropdown.
 * @param optionsText - An array of option texts that are expected to be selected.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots.
 * @returns A promise that resolves when all specified options have been verified.
 */
export async function verifySelectByText(
    page: Page,
    target: string | Locator,
    optionsText: string[],
    testInfo: TestInfo | null = null
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine whether target is a string or a Locator.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    try {
        // Get all <option> elements inside the dropdown.
        const options = await locator.locator('option');
        // For each expected option text, verify that the option is selected.
        for (const option of optionsText) {
            // Evaluate whether the option with the given text is selected.
            const isSelected = await options.getByText(option).evaluate(ele => (ele as HTMLOptionElement).selected);
            if (isSelected) {
                LogUtil.saveLog(`✅ Verified that option with text "${option}" is selected in dropdown: "${identifier}"`);
            } else {
                throw new Error(`❌ Option with text "${option}" is not selected in dropdown: "${identifier}"`);
            }
        }
    } catch (error) {
        throw new Error(`❌ Error verifying selected options by text: "${optionsText}" in dropdown "${identifier}" due to error: "${error}"`);
    }
    // Capture a screenshot after verification.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Verifies that an option with a specified value is selected in a dropdown.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the dropdown.
 * @param value - The value attribute that should be selected.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots.
 * @returns A promise that resolves when the verification is complete.
 */
export async function verifySelectByValue(
    page: Page,
    target: string | Locator,
    value: string,
    testInfo: TestInfo | null = null
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Convert target to Locator if it is a string.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    try {
        // Get all <option> elements.
        const options = await locator.locator('option');
        // Filter for the option that has the specific value and check if it's selected.
        const isSelected = await options.filter({ has: page.locator(`[value="${value}"]`) }).evaluate(ele => (ele as HTMLOptionElement).selected);
        if (isSelected) {
            LogUtil.saveLog(`✅ Option with value "${value}" is correctly selected in dropdown: "${identifier}"`);
        } else {
            throw new Error(`❌ Option with value "${value}" is not selected in dropdown: "${identifier}"`);
        }
    } catch (error) {
        throw new Error(`❌ Error verifying select option by value: "${value}" in dropdown "${identifier}" due to error: "${error}"`);
    }
    // Capture a screenshot after verification.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Verifies that the option at the specified index in a dropdown is selected.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the dropdown.
 * @param index - The index of the option to verify.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots.
 * @returns A promise that resolves to true if the option is selected, otherwise false.
 */
export async function verifySelectByIndex(
    page: Page,
    target: string | Locator,
    index: number,
    testInfo: TestInfo | null = null
): Promise<boolean> {
    let locator: Locator;
    let identifier: string;

    // Convert target to a Locator if necessary.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    // Get all <option> elements.
    const options = locator.locator('option');
    const count = await options.count();

    // Validate the provided index.
    if (index < 0 || index >= count) {
        throw new Error(`Index ${index} is out of bounds. Dropdown has ${count} options.`);
    }
    // Check if the option at the given index is selected.
    const isSelected = await options.nth(index).evaluate((el) => (el as HTMLOptionElement).selected);
    if (isSelected) {
        LogUtil.saveLog(`✅ Option at index ${index} in dropdown "${identifier}" is selected.`);
    } else {
        LogUtil.saveLog(`❌ Option at index ${index} in dropdown "${identifier}" is NOT selected.`);
    }
    // Capture a screenshot after verifying the selection.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
    return isSelected;
}


/**
 * Closes the current browser page (window) and logs the action.
 *
 * @param page - The Playwright Page instance representing the current window.
 * @returns A promise that resolves once the page is closed.
 */
export async function closeCurrentWindow(page: Page): Promise<void> {
    // Close the current page.
    await page.close();
    // Log that the current window has been closed.
    LogUtil.saveLog("Close current window");
}

/**
 * Verifies that the number of open tabs (pages) in the given browser context matches the expected number.
 *
 * @param context - The BrowserContext containing all the open pages (tabs).
 * @param expectNumberOfTabs - The expected number of tabs.
 * @returns Nothing; it asserts that the number of tabs equals the expected number.
 */
export function verifyNumberOfTabs(context: BrowserContext, expectNumberOfTabs: number) {
    // Get all open pages (tabs) in the current browser context.
    const pages = context.pages();
    // Log the current number of tabs and the expected number.
    LogUtil.saveLog(`Asserting number of window/tab: Current = "${pages.length}", Expected = "${expectNumberOfTabs}"`);
    // Assert that the current number of tabs matches the expected number.
    expect(pages.length).toBe(expectNumberOfTabs);
    // Log the successful assertion.
    LogUtil.saveLog(`✅ Assertion passed: ${expectNumberOfTabs} windows/tabs are open.`);
}

/**
 * Verifies that the number of open browser contexts (windows) in the given browser instance
 * matches the expected number.
 *
 * @param browser - The Browser instance containing all the contexts.
 * @param expectNumberOfWindow - The expected number of windows (contexts).
 * @returns Nothing; it asserts that the number of contexts equals the expected number.
 */
export function verifyNumberOfWindows(browser: Browser, expectNumberOfWindow: number) {
    // Get all browser contexts (each context can be thought of as an isolated window).
    const contexts = browser.contexts();
    // Log the current number of contexts and the expected number.
    LogUtil.saveLog(`Asserting number of window/tab: Current = "${contexts.length}", Expected = "${expectNumberOfWindow}"`);
    // Assert that the current number of contexts matches the expected number.
    expect(contexts.length).toBe(expectNumberOfWindow);
    // Log the successful assertion.
    LogUtil.saveLog(`✅ Assertion passed: ${expectNumberOfWindow} windows/tabs are open.`);
}

/**
 * Opens a new tab (page) within the same browser context and logs the action.
 *
 * @param context - The BrowserContext instance where the new page will be opened.
 * @returns A promise that resolves to the new Page (tab) instance.
 */
export async function openNewTab(context: BrowserContext): Promise<Page> {
    // Create a new page (tab) in the current browser context.
    const newTab = await context.newPage();
    // Log the successful opening of a new page.
    LogUtil.saveLog("Open new page successfully");
    return newTab;
}

/**
 * Opens a new window by creating a new browser context and a new page within it.
 *
 * @param browser - The Browser instance used to create a new context.
 * @returns A promise that resolves to the new Page (window) instance.
 */
export async function openNewWindow(browser: Browser): Promise<Page> {
    // Create a new browser context (isolated window).
    const context = await browser.newContext();
    // Create a new page in the newly created context.
    const newPage = await context.newPage();
    // Log that a new window (page) has been opened.
    LogUtil.saveLog("Open new page successfully");
    return newPage;
}

/**
 * Listens for an alert (dialog) event on the page and dismisses the alert.
 * Logs the dialog type and message, captures a screenshot after dismissing, and resolves the promise.
 *
 * @param page - The Playwright Page instance.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots to the test report.
 * @returns A promise that resolves when the alert has been successfully dismissed.
 */
export async function alertAccept(page: Page, testInfo: TestInfo | null = null): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Listen for a single dialog event.
        page.once("dialog", async dialog => {
            // Log the dialog type and message.
            LogUtil.saveLog(`Dialog type: "${dialog.type()}. Dialog message: "${dialog.message()}"`);
            try {
                // Accept the dialog.
                await dialog.accept();
                LogUtil.saveLog("✅ Dialog accepted");
                // Capture a screenshot after dismissing the dialog.
                await CaptrureScreenShotUtil.captureScreenshot(
                    page,
                    getStackTrace().split('\n')[3].trim().split(" ")[1],
                    testInfo
                );
                // Resolve the promise once the dialog is handled.
                resolve();
            } catch (error) {
                // Log error and reject the promise if dialog acceptance fails.
                LogUtil.saveLog('❌ Failed to accept dialog', error);
                reject(error);
            }
        });
    });
}



/**
 * Dismisses an alert dialog when it appears on the page.
 * It waits for a dialog event, logs its type and message, then attempts to dismiss it.
 * A screenshot is captured after dismissing the dialog for reporting purposes.
 *
 * @param page - The Playwright Page instance.
 * @param testInfo - Optional TestInfo object for attaching screenshots to the test report.
 * @returns A promise that resolves when the dialog is successfully dismissed.
 */
export async function alertDismiss(page: Page, testInfo: TestInfo | null = null): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Listen for a single 'dialog' event from the page.
        page.once("dialog", async dialog => {
            // Log the type and message of the dialog.
            LogUtil.saveLog(`Dialog type: "${dialog.type()}. Dialog message: "${dialog.message()}"`);
            try {
                // Attempt to dismiss the dialog.
                await dialog.dismiss();
                LogUtil.saveLog(`✅ Dialog dismissed`);
                // Capture a screenshot after dismissing the dialog.
                await CaptrureScreenShotUtil.captureScreenshot(
                    page,
                    getStackTrace().split('\n')[3].trim().split(" ")[1],
                    testInfo
                );
                // Resolve the promise indicating success.
                resolve();
            } catch (error) {
                // Log and reject if dismissing the dialog fails.
                LogUtil.saveLog(`❌ Failed to dismiss dialog: "${error}"`);
                reject(error);
            }
        });
    });
}

/**
 * Sets text on an alert dialog if it is a prompt.
 * Waits for a dialog event, logs its type and message, then accepts the dialog with the provided text if it is a prompt;
 * otherwise, dismisses it. The function resolves when the dialog has been handled.
 *
 * @param page - The Playwright Page instance.
 * @param text - The text to send to the prompt dialog.
 * @param testInfo - Optional TestInfo object for attaching screenshots to the test report.
 * @returns A promise that resolves when the dialog is successfully handled.
 */
export async function alertSetText(page: Page, text: string, testInfo: TestInfo | null = null): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Listen for the next 'dialog' event.
        page.once("dialog", async dialog => {
            // Log the dialog's type and message.
            LogUtil.saveLog(`Dialog type: "${dialog.type()}. Dialog message: "${dialog.message()}"`);
            try {
                // Check if the dialog is a prompt, which can accept text.
                if (dialog.type() === "prompt") {
                    // Accept the prompt with the provided text.
                    await dialog.accept(text);
                    LogUtil.saveLog(`✅ Dialog accepted with text: "${text}"`);
                } else {
                    // If it's not a prompt, log a warning and dismiss the dialog.
                    console.warn("⚠️ Dialog type is not prompt, cannot set text");
                    await dialog.dismiss();
                }
                // Resolve the promise indicating the dialog was handled.
                resolve();
            } catch (error) {
                // Log the error and reject the promise if something goes wrong.
                console.error(`❌ Error in handling dialog: "${error}"`);
                reject(error);
            }
        });
    });
}

/**
 * Verifies if an alert dialog is present within a specified timeout period.
 * It listens for a 'dialog' event; if a dialog appears before the timeout expires, it logs the event,
 * dismisses the dialog, and resolves with true. Otherwise, it resolves with false after the timeout.
 *
 * @param page - The Playwright Page instance.
 * @param testInfo - Optional TestInfo object for attaching screenshots to the test report.
 * @param timeout - The maximum time (in milliseconds) to wait for the dialog to appear.
 * @returns A promise that resolves to true if a dialog is detected and handled, or false if the timeout expires.
 */
export async function verifyAlertPresent(page: Page, testInfo: TestInfo | null = null, timeout: number = FramworkConstants.DEFAULT_TIMEOUT): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        // Start a timer to limit how long to wait for the dialog.
        const timer = setTimeout(() => {
            console.warn(`⚠️ No alert appeared within ${timeout}ms`);
            // If the timeout is reached, resolve with false.
            resolve(false);
        }, timeout);

        // Listen for a 'dialog' event.
        page.once('dialog', async (dialog) => {
            // Log that a dialog was detected along with its message.
            LogUtil.saveLog(`Dialog detected: "${dialog.message()}"`);
            // Clear the timer since the dialog was detected.
            clearTimeout(timer);
            // Resolve with true indicating that a dialog was present.
            resolve(true);
            // Dismiss the dialog to prevent it from blocking further actions.
            await dialog.dismiss();
        });
    });
}


/**
 * Retrieves the inner text of an element.
 * It accepts either a string selector or a Locator, waits for the element to be visible,
 * captures a screenshot after retrieving the text, logs the action, and returns the text.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the target element.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots in the report.
 * @returns The inner text of the element, or an empty string if an error occurs.
 */
export async function getTextElement(page: Page, target: string | Locator, testInfo: TestInfo | null = null): Promise<string> {
    let locator: Locator;
    let identifier: string;

    // Convert target to a Locator if it's provided as a string.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    // Wait until the element is visible, using a default timeout from constants.
    await locator.waitFor({ state: 'visible', timeout: FramworkConstants.DEFAULT_TIMEOUT });

    try {
        // Retrieve the inner text of the element.
        const text = await locator.innerText();
        // Capture a screenshot after retrieving the text.
        // The step name is derived from the stack trace.
        await CaptrureScreenShotUtil.captureScreenshot(
            page,
            getStackTrace().split('\n')[3].trim().split(" ")[1],
            testInfo
        );
        // Log the successful retrieval of text.
        LogUtil.saveLog(`✅ Successfully got text: "${text}" from: "${identifier}"`);
        // Return the text (or empty string if text is nullish).
        return text || '';
    } catch (error) {
        // Log any error encountered when trying to get the text.
        console.error(`❌ Failed to get text from "${identifier}". Error: ${error}`);
        // Return empty string on error.
        return '';
    }
}

/**
 * Retrieves the inner text for all elements matching a given selector.
 * It uses getWebLocators to obtain an array of Locators,
 * then iterates over them to retrieve text from each element.
 * A screenshot is captured after processing all elements.
 *
 * @param page - The Playwright Page instance.
 * @param selector - The selector string for the target elements.
 * @param testInfo - (Optional) TestInfo object for attaching screenshots in the report.
 * @returns An array of strings representing the text content of each matched element.
 */
export async function getListElementsText(page: Page, selector: string, testInfo: TestInfo | null = null): Promise<string[]> {
    const result: string[] = [];
    // Get an array of locators matching the selector.
    const locators = await getWebLocators(page, selector);

    // Iterate over each locator and retrieve its text.
    for (let locator of locators) {
        result.push(await getTextElement(page, locator, testInfo));
    }

    // Capture a screenshot after retrieving all texts.
    await CaptrureScreenShotUtil.captureScreenshot(
        page,
        getStackTrace().split('\n')[3].trim().split(" ")[1],
        testInfo
    );
    // Return the array of text values.
    return result;
}


/**
 * Retrieves the computed CSS value of a specified property from the target element.
 * Waits until the element is visible, then uses the browser's getComputedStyle to extract the property value.
 * Captures a screenshot and logs the action.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element.
 * @param cssName - The CSS property name to retrieve.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 * @returns The computed CSS value as a string, or null if not present.
 */
export async function getCssValueElement(page: Page, target: string | Locator, cssName: string, testInfo: TestInfo | null = null): Promise<string | null> {
    let locator: Locator;
    let identifier: string;

    // Convert the target to a Locator if needed.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Wait for the element to become visible before retrieving its CSS value.
        await locator.waitFor({ state: 'visible', timeout: FramworkConstants.DEFAULT_TIMEOUT });
        // Use evaluate to get the computed CSS property value.
        const value = await locator.evaluate((element, property) =>
            window.getComputedStyle(element).getPropertyValue(property), cssName);
        LogUtil.saveLog(`✅ Successfully got CSS property "${cssName}" for ${identifier}: "${value}"`);
        // Capture a screenshot after retrieving the CSS value.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
        return value;
    } catch (error: any) {
        LogUtil.saveLog(`❌ Failed to get CSS property for ${identifier}. Error: "${error}"`);
        throw new Error(`❌ Failed to get CSS property for ${identifier}. Error: "${error}"`);
    }
}

/**
 * Waits for the element to become visible.
 * Logs the outcome and captures a screenshot after the element is visible.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 * @param timeOut - The timeout value in milliseconds (default from FramworkConstants).
 * @returns True if the element becomes visible within the timeout; otherwise, returns false.
 */
export async function waitForElementVisible(page: Page, target: string | Locator, testInfo: TestInfo | null = null, timeOut: number = FramworkConstants.DEFAULT_TIMEOUT): Promise<boolean> {
    let locator: Locator;
    let identifier: string;

    // Convert target to a Locator if it's a string.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    try {
        // Wait until the element is visible.
        await locator.waitFor({ state: 'visible', timeout: timeOut });
        LogUtil.saveLog(`✅ Element with ${identifier} became visible within ${timeOut}ms`);
        // Capture a screenshot after the element becomes visible.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
        return true;
    } catch (error: any) {
        console.error(`⚠️ Timeout waiting for element with ${identifier} to become visible. Error: "${error}"`);
    }
    return false;
}

/**
 * Waits for the element to be clickable by verifying it is visible and enabled.
 * Logs the result, captures a screenshot, and returns true if clickable.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 * @param timeOut - The timeout value in milliseconds.
 * @returns True if the element is clickable within the timeout.
 */
export async function waitForElementClickable(page: Page, target: string | Locator, testInfo: TestInfo | null = null, timeOut: number = FramworkConstants.DEFAULT_TIMEOUT): Promise<boolean> {
    let locator: Locator;
    let identifier: string;

    // Convert target to Locator if necessary.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    try {
        // Wait until the element is visible.
        await locator.waitFor({ state: 'visible', timeout: timeOut });
        // Additionally check if the element is enabled (clickable).
        await locator.isEnabled();
        LogUtil.saveLog(`✅ Element with ${identifier} became clickable within ${timeOut}ms`);
        // Capture a screenshot after confirming clickability.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
        return true;
    } catch (error: any) {
        console.error(`⚠️ Timeout waiting for element with ${identifier} to become clickable within ${timeOut}ms. Error: "${error}"`);
    }
    return false;
}

/**
 * Waits for the element to be present in the DOM (attached state).
 * Logs the outcome and captures a screenshot once the element is present.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 * @param timeOut - The timeout value in milliseconds.
 * @returns True if the element is present within the timeout.
 */
export async function waitForElementPresent(page: Page, target: string | Locator, testInfo: TestInfo | null = null, timeOut: number = FramworkConstants.DEFAULT_TIMEOUT): Promise<boolean> {
    let locator: Locator;
    let identifier: string;

    // Convert target to a Locator if necessary.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }
    try {
        // Wait until the element is attached to the DOM.
        await locator.waitFor({ state: 'attached', timeout: timeOut });
        LogUtil.saveLog(`✅ Element with ${identifier} became present within ${timeOut}ms`);
        // Capture a screenshot after confirming the element is present.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
        return true;
    } catch (error: any) {
        console.error(`⚠️ Timeout waiting for element with ${identifier} to be present within ${timeOut}ms. Error: "${error}"`);
    }
    return false;
}

/**
 * Retrieves the value of a specified attribute from the target element.
 * Waits until the element is visible, then gets the computed attribute value.
 * Logs the result, captures a screenshot, and returns the attribute value.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element.
 * @param attribute - The name of the attribute to retrieve.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 * @returns The value of the attribute, or null if not found.
 */
export async function getAttributeElement(page: Page, target: string | Locator, attribute: string, testInfo: TestInfo | null = null): Promise<string | null> {
    let locator: Locator;
    let identifier: string;

    // Convert target to Locator if necessary.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Wait until the element is visible.
        await locator.waitFor({ state: 'visible', timeout: FramworkConstants.DEFAULT_TIMEOUT });
        // Retrieve the computed attribute value using the browser's getComputedStyle.
        const value = await locator.getAttribute(attribute);
        LogUtil.saveLog(`✅ Successfully got attribute "${identifier}" with value "${value}"`);
        if (value === null) {
            console.warn(`⚠️ Attribute "${attribute}" is not present on ${identifier}.`);
        }
        // Capture a screenshot after getting the attribute.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
        return value;
    } catch (error: any) {
        LogUtil.saveLog(`❌ Failed to get attribute for ${identifier}. Error: "${error}"`);
        throw new Error(`❌ Failed to get attribute for ${identifier}. Error: "${error}"`);
    }
}

/**
 * Verifies that the target element's attribute matches the expected value.
 * Retrieves the attribute value, logs both the expected and actual values,
 * attaches a screenshot, and returns true if they match; otherwise, it throws an error.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element.
 * @param attributeName - The name of the attribute to check.
 * @param attributeValue - The expected attribute value.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 * @param timeOut - The timeout value in milliseconds.
 * @returns True if the attribute value matches; otherwise, throws an error.
 */
export async function verifyElementAttributeValue(page: Page, target: string | Locator, attributeName: string, attributeValue: string, testInfo: TestInfo | null = null, timeOut: number = FramworkConstants.DEFAULT_TIMEOUT): Promise<boolean> {
    // Get the actual attribute value.
    const actualValue = await getAttributeElement(page, target, attributeName, testInfo);
    LogUtil.saveLog(`Verify attribute "${attributeName}": Expected = "${attributeValue}", Actual = "${actualValue}"`);
    if (attributeValue === actualValue) {
        LogUtil.saveLog(`✅ Assertion passed: "${actualValue}" equals "${attributeValue}"`);
        // Capture screenshot after verification.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
        return true;
    } else {
        console.error(`❌ Assertion failed: "${actualValue}" does not equal "${attributeValue}"`);
        throw new Error(`❌ Assertion failed: "${actualValue}" does not equal "${attributeValue}"`);
    }
}

/**
 * Verifies whether the target element has a specific attribute.
 * It uses a browser evaluation to check for attribute existence,
 * logs the result, captures a screenshot, and returns true if the attribute is present.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element.
 * @param attributeName - The attribute name to verify.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 * @returns True if the element has the attribute; otherwise, false.
 */
export async function verifyElementHasAttribute(page: Page, target: string | Locator, attributeName: string, testInfo: TestInfo | null = null): Promise<boolean> {
    let locator: Locator;
    let identifier: string;

    // Convert the target to a Locator if needed.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Evaluate if the element has the specified attribute.
        const hasAttribute = await locator.evaluate((element, attr) => element.hasAttribute(attr), attributeName);
        if (hasAttribute) {
            LogUtil.saveLog(`✅ Element with ${identifier} has attribute "${attributeName}".`);
        } else {
            LogUtil.saveLog(`⚠️ Element with ${identifier} does NOT have attribute "${attributeName}".`);
        }
        // Capture a screenshot after verification.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
        return hasAttribute;
    } catch (error: any) {
        console.error(`❌ Error while verifying attribute "${attributeName}" on ${identifier}. Error: ${error.message}`);
        throw new Error(`❌ Error while verifying attribute "${attributeName}" on ${identifier}. Error: ${error.message}`);
    }
}

/**
 * Verifies whether an element specified by the selector exists in the page.
 * It checks the count of elements matching the selector, logs the result,
 * captures a screenshot, and returns true if at least one element is found.
 *
 * @param page - The Playwright Page instance.
 * @param selector - The selector string for the target element.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 * @returns True if the element exists, otherwise false.
 */
export async function verifyElementExists(page: Page, selector: string, testInfo: TestInfo | null = null): Promise<boolean> {
    // Convert the selector to a Locator.
    const locator = getWebLocator(page, selector);
    let isExist = false;
    // Check if at least one element matching the selector exists.
    if (await locator.count() > 0) {
        LogUtil.saveLog(`✅ Element with selector: "${selector}" exists`);
        isExist = true;
    } else {
        LogUtil.saveLog(`❌ Element with selector: "${selector}" does not exist`);
        isExist = false;
    }
    // Capture a screenshot after the existence check.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
    return isExist;
}

/**
 * Asserts that two values are equal.
 * Logs the expected and actual values, performs the assertion, and logs the outcome.
 *
 * @param value1 - The first value (string or number).
 * @param value2 - The second value (string or number) to compare.
 */
export function verifyEquals(value1: string | number, value2: string | number): void {
    LogUtil.saveLog(`Verify Equal: Value1 = "${value1}", Value2 = "${value2}"`);
    expect(value1, `❌ Assertion failed: "${value1}" != "${value2}"`).toBe(value2);
    LogUtil.saveLog(`✅ Assertion passed: "${value1}" equals "${value2}"`);
}

/**
 * Asserts that the first string contains the second string.
 * Logs both values and performs the assertion.
 *
 * @param value1 - The string to search in.
 * @param value2 - The substring that is expected to be found in value1.
 */
export function verifyContains(value1: string, value2: string): void {
    LogUtil.saveLog(`Verify contains: Value1 = "${value1}", Value2 = "${value2}"`);
    expect(value1, `❌ Assertion failed: "${value1}" does not contain "${value2}"`).toContain(value2);
    LogUtil.saveLog(`✅ Assertion passed: "${value1}" contains "${value2}"`);
}

/**
 * Asserts that the given boolean value is true.
 * Logs the value and performs the assertion.
 *
 * @param value - The boolean value to verify.
 */
export function verifyTrue(value: boolean): void {
    LogUtil.saveLog(`Verify True: value = "${value}"`);
    expect(value, `❌ Assertion failed: Expected true, but got "${value}"`).toBeTruthy();
    LogUtil.saveLog(`✅ Assertion passed: value is true`);
}

/**
 * Asserts that the given boolean value is false.
 * Logs the value and performs the assertion.
 *
 * @param value - The boolean value to verify.
 */
export function verifyFalse(value: boolean): void {
    LogUtil.saveLog(`Verify False: value = "${value}"`);
    expect(value, `❌ Assertion failed: Expected false, but got "${value}"`).toBeFalsy();
    LogUtil.saveLog(`✅ Assertion passed: value is false`);
}

/**
 * Verifies that the text content of an element equals the expected text.
 * Retrieves the element's text, performs the equality assertion, logs the result, and captures a screenshot.
 *
 * @param page - The Playwright Page instance.
 * @param selector - The selector string for the target element.
 * @param expectedText - The expected text content.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 */
export async function verifyElementTextEqual(page: Page, selector: string, expectedText: string, testInfo: TestInfo | null = null): Promise<void> {
    const text = await getTextElement(page, selector, testInfo);
    verifyEquals(text.trim(), expectedText.trim());
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Verifies that the text content of an element contains the expected substring.
 * Retrieves the element's text, performs the containment assertion, logs the result, and captures a screenshot.
 *
 * @param page - The Playwright Page instance.
 * @param selector - The selector string for the target element.
 * @param expectedText - The expected substring.
 * @param testInfo - (Optional) TestInfo object for attaching the screenshot.
 */
export async function verifyElementTextContain(page: Page, selector: string, expectedText: string, testInfo: TestInfo | null = null): Promise<void> {
    const text = await getTextElement(page, selector, testInfo);
    verifyContains(text.trim(), expectedText.trim());
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Verifies that the specified Locator is visible on the page.
 * Throws an error if the element is not visible.
 *
 * @param locator - The Locator for the element.
 */
export async function verifyElementVisible(locator: Locator): Promise<void> {
    if (!await locator.isVisible()) {
        throw new Error(`❌ Element with locator "${locator.toString()}" is not visible!`);
    }
    LogUtil.saveLog(`✅ Element with locator "${locator.toString()}" is visible!`);
}

/**
 * Verifies that the specified Locator is not visible on the page.
 * Throws an error if the element is visible.
 *
 * @param locator - The Locator for the element.
 */
export async function verifyElementInVisible(locator: Locator): Promise<void> {
    if (await locator.isVisible()) {
        throw new Error(`❌ Element with locator "${locator.toString()}" is visible!`);
    }
    LogUtil.saveLog(`✅ Element with locator "${locator.toString()}" is not visible!`);
}

/**
 * Verifies that the element specified by the selector is clickable.
 * It checks that the element is visible and enabled.
 * Throws an error if it is not clickable.
 *
 * @param page - The Playwright Page instance.
 * @param selector - The selector string for the target element.
 */
export async function verifyElementClickable(page: Page, selector: string): Promise<void> {
    const locator = getWebLocator(page, selector);

    // Ensure the element is visible.
    await verifyElementVisible(locator);
    // Check if the element is enabled.
    if (!await locator.isEnabled()) {
        throw new Error(`❌ Element with locator "${locator.toString()}" is not enabled!`);
    }
    LogUtil.saveLog(`✅ Element with locator "${locator.toString()}" is enabled!`);
    // Optionally, capture a screenshot here if needed.
}

/**
 * Scrolls the element (identified by target) into view at the top of the viewport.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element to scroll to the top.
 */
export async function scrollToElementToTop(page: Page, target: string | Locator): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // If target is a string, convert it to a Locator; otherwise, use it directly.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    // Verify that the element exists (has at least one instance) in the DOM.
    if (await locator.count() === 0) {
        throw new Error(`❌ Element with "${identifier}" does not exist!`);
    }

    // Use evaluate to scroll the element into view at the top with a smooth behavior.
    await locator.evaluate((element) => {
        element.scrollIntoView({
            behavior: 'smooth',  // Smooth scrolling effect.
            block: 'start',      // Align the element to the top of the viewport.
            inline: 'nearest'    // For horizontal scrolling, align to the nearest edge.
        });
    });

    // Log a success message.
    LogUtil.saveLog(`✅ Scrolled element with "${identifier}" to the top of the viewport!`);
}

/**
 * Scrolls the element (identified by target) into view at the bottom of the viewport.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the element to scroll to the bottom.
 */
export async function scrollToElementToBottom(page: Page, target: string | Locator): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine whether target is a string or a Locator.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}";`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    // Verify that the element exists.
    if (await locator.count() === 0) {
        throw new Error(`❌ Element with "${identifier}" does not exist!`);
    }

    // Use evaluate to scroll the element into view at the bottom of the viewport.
    await locator.evaluate((element) => {
        element.scrollIntoView({
            behavior: 'smooth',  // Smooth scrolling effect.
            block: 'end',        // Align the element to the bottom of the viewport.
            inline: 'nearest'    // Align horizontally to the nearest edge.
        });
    });

    // Log a success message.
    LogUtil.saveLog(`✅ Successfully scrolled element with "${identifier}" to the end of the viewport!`);
}

/**
 * Scrolls to the end of the page by incrementally scrolling down.
 *
 * @param page - The Playwright Page instance.
 */
export async function scrollToEndOfPage(page: Page): Promise<void> {
    await page.evaluate(async () => {
        // Get the total scrollable height of the page.
        const scrollHeight = document.body.scrollHeight;
        // Distance to scroll in each step.
        const distance = 100;
        // Delay between each scroll step in milliseconds.
        const delay = 50;

        // Incrementally scroll down the page.
        for (let position = 0; position < scrollHeight; position += delay) {
            window.scrollTo(0, position);
            // Wait a short period to simulate smooth scrolling.
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        // Ensure the page is fully scrolled to the bottom.
        window.scrollTo(0, scrollHeight);
    });

    // Log a success message.
    LogUtil.saveLog(`✅ Successfully scrolled to the end of the page`);
}

/**
 * Scrolls to a specified position (x, y) on the page.
 *
 * @param page - The Playwright Page instance.
 * @param x - The horizontal scroll position.
 * @param y - The vertical scroll position.
 * @param smooth - Optional flag to enable smooth scrolling; defaults to false.
 */
export async function scrollToPosition(page: Page, x: number, y: number, smooth: boolean = false): Promise<void> {
    // Retrieve the total scrollable dimensions of the document.
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);

    // Validate the scroll position: ensure x and y are within the scrollable dimensions.
    if (x < 0 || y < 0 || x > scrollWidth || y > scrollHeight) {
        throw new Error(`Invalid scroll position: x = "${x}", y = "${y}"`);
    }

    try {
        // Use evaluate to perform the scrolling action with the specified behavior.
        await page.evaluate(({ x, y, smooth }) => {
            window.scrollTo({
                left: x,
                top: y,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }, { x, y, smooth });

        // Log success.
        LogUtil.saveLog(`✅ Successfully scrolled to x: "${x}", y: "${y}" of page`);
    } catch (error: any) {
        // Log error in case of failure.
        console.error(`❌ Failed to scroll to x: "${x}", y: "${y}" of page`);
        throw new Error(`❌ Failed to scroll to x: "${x}", y: "${y}" of page due to error: "${error}"`);
    }
}

/**
 * Hovers over the specified element.
 * Captures a screenshot after hovering for reporting purposes.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the target element.
 * @param testInfo - Optional TestInfo object to attach a screenshot.
 */
export async function hoverOnElement(page: Page, target: string | Locator, testInfo: TestInfo | null = null): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine if target is a selector string or a Locator.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Perform the hover action on the target element.
        await locator.hover();
        LogUtil.saveLog(`✅ Successfully hovered over element: "${identifier}"`);

        // Capture a screenshot after hovering.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
    } catch (error: any) {
        LogUtil.saveLog(`❌ Failed to hover on element: "${identifier}". Error: "${error}"`);
    }
}

/**
 * Moves the mouse cursor to the center of the specified element.
 * Captures a screenshot after moving the cursor.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the target element.
 * @param testInfo - Optional TestInfo object to attach a screenshot.
 */
export async function moveToELement(page: Page, target: string | Locator, testInfo: TestInfo | null = null): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine if target is a string or a Locator.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    try {
        // Get the bounding box of the element.
        const box = await locator.boundingBox();
        if (!box) {
            throw new Error(`Element does not have a bounding box.`);
        }
        const { x, y, width, height } = box;
        // Move the mouse to the center of the element.
        await page.mouse.move(x + width / 2, y + height / 2);
        LogUtil.saveLog(`✅ Successfully moved over the element: "${identifier}"`);

        // Capture a screenshot after moving the mouse.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
    } catch (error: any) {
        LogUtil.saveLog(`❌ Failed to move over the element: "${identifier}". Error: "${error}"`);
        throw new Error(`❌ Failed to move over the element: "${identifier}". Error: "${error}"`);
    }
}

/**
 * Drags an element from a source selector to a target selector.
 * Ensures both elements are visible before performing the drag-and-drop action.
 * Captures a screenshot after the action.
 *
 * @param page - The Playwright Page instance.
 * @param fromSelector - The selector for the element to drag.
 * @param toSelector - The selector for the target element where the dragged element is dropped.
 * @param testInfo - Optional TestInfo object for attaching a screenshot.
 */
export async function dragAndDrop(page: Page, fromSelector: string, toSelector: string, testInfo: TestInfo | null = null): Promise<void> {
    // Obtain Locator instances for both source and target elements.
    const fromLocator = getWebLocator(page, fromSelector);
    const toLocator = getWebLocator(page, toSelector);

    // Ensure both the source and target elements are visible.
    await expect(fromLocator).toBeVisible();
    await expect(toLocator).toBeVisible();

    try {
        // Perform the drag and drop action.
        await fromLocator.dragTo(toLocator);
        LogUtil.saveLog(`✅ Successfully dragged from "${fromSelector}" to "${toSelector}"`);

        // Capture a screenshot after the drag-and-drop action.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
    } catch (error: any) {
        LogUtil.saveLog(`❌ Failed to drag from "${fromSelector}" to "${toSelector}" due to error: "${error}"`);
        throw new Error(`❌ Failed to drag from "${fromSelector}" to "${toSelector}" due to error: "${error}"`);
    }
}

/**
 * Navigates to a specified URL.
 * Waits for the page to fully load before proceeding.
 * Captures a screenshot after navigation.
 *
 * @param page - The Playwright Page instance.
 * @param url - The URL to navigate to.
 * @param testInfo - Optional TestInfo object for attaching a screenshot.
 */
export async function openUrl(page: Page, url: string, testInfo: TestInfo | null = null): Promise<void> {
    try {
        // Navigate to the URL and wait until the page load event is fired.
        await page.goto(url, { waitUntil: 'load' });
        LogUtil.saveLog(`✅ Successfully opened url: "${url}"`);

        // Capture a screenshot after navigating to the URL.
        await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
    } catch (error: any) {
        console.error(`❌ Failed to open url: "${url}" due to error: "${error}"`);
        throw new Error(`❌ Unable to navigate to URL: "${url}"`);
    }
}


/**
 * Retrieves the current URL of the page.
 * Logs the URL using LogUtil.
 *
 * @param page - The Playwright Page instance.
 * @param testInfo - Optional TestInfo object (not used in this function but included for consistency).
 * @returns The current URL as a string.
 */
export function getUrl(page: Page, testInfo: TestInfo | null = null): string {
    // Get the current URL from the page object.
    const currentUrl = page.url();
    // Log the current URL.
    LogUtil.saveLog(`Current url is "${currentUrl}"`);
    return currentUrl;
}

/**
 * Fills the specified input element with the given text.
 * First, converts a string selector to a Locator (if needed) and verifies that the element is visible.
 * Then attempts to fill in the text. After filling, it captures a screenshot using a stack trace
 * to determine the calling step name.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the target element.
 * @param text - The text to fill in.
 * @param testInfo - Optional TestInfo object for attaching screenshots.
 */
export async function fillText(
    page: Page,
    target: string | Locator,
    text: string,
    testInfo: TestInfo | null = null
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine if 'target' is a string selector or already a Locator.
    if (typeof target === 'string') {
        // Convert the selector string into a Locator.
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        // If it's already a Locator, use it directly.
        locator = target;
        identifier = `locator`;
    }

    // Verify that the target element is visible on the page.
    await verifyElementVisible(locator);

    try {
        // Fill the element with the provided text.
        await locator.fill(text);
        LogUtil.saveLog(`✅ Successfully filled text: "${text}" into ${identifier}`);
    } catch (error: any) {
        // Log the error and rethrow it if filling fails.
        LogUtil.saveLog(`❌ Failed to fill text: "${text}" into ${identifier} due to "${error}"`);
        throw new Error(`❌ Failed to fill text: "${text}" into ${identifier} due to "${error}"`);
    }
    // Capture a screenshot after the step. 
    // The screenshot name is derived from the stack trace: 
    // split the stack trace, get the 4th line, trim it, then take the second token.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Fills the specified input element with text, and then presses a key if provided.
 * It first verifies that the target element is visible, then fills in the text,
 * logs the action, and if a key is provided, sends the key press.
 * Finally, it captures a screenshot after the step.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the target element.
 * @param text - The text to fill in.
 * @param key - (Optional) The key to press after filling the text (e.g., "Enter", "Tab").
 * @param testInfo - Optional TestInfo object for attaching screenshots.
 */
export async function fillTextAndPressKey(
    page: Page,
    target: string | Locator,
    text: string,
    key: string | null = null,
    testInfo: TestInfo | null = null
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine whether the target is a selector string or a Locator.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    // Verify that the element is visible.
    await verifyElementVisible(locator);

    try {
        // Fill the element with the given text.
        await locator.fill(text);
        LogUtil.saveLog(`✅ Successfully filled text: "${text}" into ${identifier}`);

        // If a key is provided, simulate pressing the key.
        if (key) {
            await locator.press(key);
            LogUtil.saveLog(`✅ Successfully pressed key: "${key}" on ${identifier}`);
        }
    } catch (error: any) {
        LogUtil.saveLog(`❌ Failed to fill text: "${text}" and press key: "${key}" on ${identifier} due to "${error}"`);
        throw new Error(`❌ Failed to fill text: "${text}" and press key: "${key}" on ${identifier} due to "${error}"`);
    }
    // Capture a screenshot after the step.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Simulates typing into an element character by character (using Playwright's type method).
 * This function first ensures the element is visible, then focuses on it, types the provided text,
 * and if a key is provided, presses it afterward.
 * Finally, it captures a screenshot after the step.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the target element.
 * @param text - The text to type.
 * @param key - (Optional) The key to press after typing (e.g., "Enter").
 * @param testInfo - Optional TestInfo object for attaching screenshots.
 */
export async function sendKeys(
    page: Page,
    target: string | Locator,
    text: string,
    key: string | null = null,
    testInfo: TestInfo | null = null
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Convert target to a Locator if it's a string.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    // Ensure the element is visible.
    await verifyElementVisible(locator);

    try {
        // Focus on the element to simulate user typing.
        await locator.focus();
        // Type the provided text character by character.
        await locator.type(text);
        LogUtil.saveLog(`✅ Successfully sent text: "${text}" to ${identifier}`);

        // If a key is provided, simulate pressing that key.
        if (key) {
            await locator.press(key);
            LogUtil.saveLog(`✅ Successfully pressed key: "${key}" on ${identifier}`);
        }
    } catch (error: any) {
        LogUtil.saveLog(`❌ Failed to send text: "${text}" and press key: "${key}" on ${identifier} due to "${error}"`);
        throw new Error(`❌ Failed to send text: "${text}" and press key: "${key}" on ${identifier} due to "${error}"`);
    }
    // Capture a screenshot after the step.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}

/**
 * Clears the text content of the specified input element.
 * Verifies that the element is visible before attempting to clear.
 * Logs success or failure, and captures a screenshot after the action.
 *
 * @param page - The Playwright Page instance.
 * @param target - A string selector or Locator for the target element.
 * @param testInfo - Optional TestInfo object for attaching screenshots.
 */
export async function clearText(
    page: Page,
    target: string | Locator,
    testInfo: TestInfo | null = null
): Promise<void> {
    let locator: Locator;
    let identifier: string;

    // Determine if the target is a string or Locator.
    if (typeof target === 'string') {
        locator = getWebLocator(page, target);
        identifier = `selector: "${target}"`;
    } else {
        locator = target;
        identifier = `locator`;
    }

    // Verify the element is visible.
    await verifyElementVisible(locator);

    try {
        // Attempt to clear the text in the element.
        await locator.clear();
        LogUtil.saveLog(`✅ Successfully cleared text in ${identifier}`);
    } catch (error: any) {
        LogUtil.saveLog(`❌ Failed to clear text in ${identifier} due to "${error}"`);
        throw new Error(`❌ Failed to clear text in ${identifier} due to "${error}"`);
    }
    // Capture a screenshot after clearing the text.
    await CaptrureScreenShotUtil.captureScreenshot(page, getStackTrace().split('\n')[3].trim().split(" ")[1], testInfo);
}


/**
 * Downloads a file triggered by clicking on an element identified by the selector.
 * The file is saved to the download directory defined by getPathDownloadDirectory().
 *
 * @param page - The Playwright Page instance.
 * @param selector - The selector for the element that triggers the download.
 * @param testInfo - Optional TestInfo object to attach artifacts in the report.
 */
export async function downloadFile(page: Page, selector: string, testInfo: TestInfo | null = null): Promise<void> {
    // Get the path of the default download directory.
    const downloadPath = getPathDownloadDirectory();

    // Verify that the download directory exists.
    if (!fs.existsSync(downloadPath)) {
        throw new Error(`❌ The folder "${downloadPath}" does not exist`);
    }

    try {
        // Wait for the download event and click the element that triggers the download concurrently.
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.click(selector)
        ]);

        // Get the suggested filename for the download.
        const fileName = download.suggestedFilename();
        // Create the full destination path for the downloaded file.
        const destinationPathFile = path.join(downloadPath, fileName);

        // Save the downloaded file to the destination path.
        await download.saveAs(destinationPathFile);
        LogUtil.saveLog(`Successfully download file to : "${destinationPathFile}"`);
    } catch (error) {
        LogUtil.saveLog(`Failed to download file.`);
        throw new Error(`Failed to download file.`);

    }
}

/**
 * Returns the path to the user's default Downloads directory.
 *
 * @returns The full path to the Downloads directory.
 */
export function getPathDownloadDirectory(): string {
    const homePath = os.homedir();
    // Combine the home path with 'Downloads' to get the default download directory.
    const downloadPath = path.join(homePath, 'Downloads');
    return downloadPath;
}

/**
 * Counts the number of files in the default download directory.
 *
 * @returns The number of files in the download directory.
 */
export function countFilesInDownloadDirectory(): number {
    let countFiles = 0;
    const downloadPath = getPathDownloadDirectory();
    if (!fs.existsSync(downloadPath)) {
        throw new Error(`❌ The folder "${downloadPath}" does not exist`);
    }

    // Read all items (files and directories) in the download directory.
    const items = fs.readdirSync(downloadPath);

    // Increment count for each file found.
    for (const item of items) {
        const itemPath = path.join(downloadPath, item);
        if (fs.statSync(itemPath).isFile()) {
            countFiles += 1;
        }
    }

    LogUtil.saveLog(`Count File in folder is: "${countFiles}"`);
    return countFiles;
}

/**
 * Verifies if a file whose name contains the provided substring exists in the download directory.
 *
 * @param fileName - A substring to search for in the file names.
 * @returns True if at least one file containing the substring is found, otherwise false.
 */
export function verifyFileContainsInDownloadDirectory(fileName: string): boolean {
    const downloadPath = getPathDownloadDirectory();
    if (!fs.existsSync(downloadPath)) {
        throw new Error(`The folder "${downloadPath}" does not exist`);
    }

    // Read all items (files and directories) in the download directory.
    const items = fs.readdirSync(downloadPath);

    // Check if any file name includes the given substring.
    for (const item of items) {
        if (item.includes(fileName)) {
            LogUtil.saveLog(`✅ Found file "${fileName}" in download directory`);
            return true;
        }
    }
    LogUtil.saveLog(`❌ Not found file "${fileName}" in download directory`);
    return false;
}

/**
 * Verifies if a file with the exact name exists in the download directory.
 *
 * @param fileName - The exact file name to search for.
 * @returns True if the file is found, otherwise false.
 */
export function verifyFileEqualsInDownloadDirectory(fileName: string): boolean {
    const downloadPath = getPathDownloadDirectory();
    if (!fs.existsSync(downloadPath)) {
        throw new Error(`❌ The folder "${downloadPath}" does not exist`);
    }

    // Read all items in the download directory.
    const items = fs.readdirSync(downloadPath);

    // Check if the file name exactly matches the provided fileName.
    if (items.includes(fileName)) {
        LogUtil.saveLog(`✅ Found file "${fileName}" in download directory`);
        return true;
    }
    LogUtil.saveLog(`❌ Not found file "${fileName}" in download directory`);
    return false;
}

/**
 * Pauses execution for the specified timeout in milliseconds.
 *
 * @param timeout - The time in milliseconds to wait.
 * @returns A promise that resolves after the specified timeout.
 */
export function sleep(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

/**
 * Waits for a file with an exact name to appear in the download directory within the given timeout period.
 *
 * @param fileName - The exact file name to search for.
 * @param timeout - The maximum wait time in seconds.
 * @returns True if the file is found within the timeout period, otherwise throws an error.
 */
export function verifyDownloadFileEqualsNameCompletedWaitTimeout(fileName: string, timeout: number): boolean {
    let i = 0;
    // Loop, checking every second if the file exists.
    while (i < timeout) {
        if (verifyFileEqualsInDownloadDirectory(fileName)) {
            LogUtil.saveLog(`✅ Found file "${fileName}" in download directory after "${i}"ms`);
            return true;
        }
        i++;
        // Pause for 1 second between checks.
        sleep(1000);
    }
    LogUtil.saveLog(`❌ Not found file "${fileName}" in download directory after "${timeout}"s`);
    throw new Error(`❌ Not found file "${fileName}" in download directory after "${timeout}"s`);
}

/**
 * Waits for a file containing the given substring in its name to appear in the download directory within the given timeout.
 *
 * @param fileName - The substring to search for in file names.
 * @param timeout - The maximum wait time in seconds.
 * @returns True if a matching file is found within the timeout period, otherwise throws an error.
 */
export function verifyDownloadFileContainsNameCompletedWaitTimeout(fileName: string, timeout: number): boolean {
    let i = 0;
    // Loop until the timeout is reached.
    while (i < timeout) {
        if (verifyFileContainsInDownloadDirectory(fileName)) {
            LogUtil.saveLog(`✅ Found file "${fileName}" in download directory after "${i}"ms`);
            return true;
        }
        i++;
        // Pause for 1 second between checks.
        sleep(1000);
    }
    LogUtil.saveLog(`❌ Not found file "${fileName}" in download directory after "${timeout}"s`);
    throw new Error(`❌ Not found file "${fileName}" in download directory after "${timeout}"s`);
}

/**
 * Deletes all files in the default download directory.
 * Iterates over each item in the download folder, and if the item is a file, it deletes it.
 */
export function deleteAllFilesInDownloadDirectory() {
    const downloadPath = getPathDownloadDirectory();
    // Read all items (files and folders) in the download directory.
    const items = fs.readdirSync(downloadPath);
    for (const item of items) {
        const itemPath = path.join(downloadPath, item);
        if (fs.statSync(itemPath).isFile()) {
            // Uncomment the following line if you want to conditionally filter files (e.g., "InstallShield.log")
            // if(item.match("InstallShield.log")){
            fs.unlinkSync(itemPath);
            LogUtil.saveLog(`Remove file: "${itemPath}"`);
            // }
        }
    }
}

/**
 * Deletes all files in a specified directory.
 *
 * @param pathDirectory - The directory path from which to delete all files.
 * @throws An error if the specified directory does not exist.
 */
export function deleteAllFilesInDirectory(pathDirectory: string) {
    if (!fs.existsSync(pathDirectory)) {
        throw new Error(`❌ The folder "${pathDirectory}" does not exist`);
    }

    // Read all items in the specified directory.
    const items = fs.readdirSync(pathDirectory);
    for (const item of items) {
        const itemPath = path.join(pathDirectory, item);
        if (fs.statSync(itemPath).isFile()) {
            fs.unlinkSync(itemPath);
            LogUtil.saveLog(`Remove file: "${itemPath}"`);
        }
    }
}
