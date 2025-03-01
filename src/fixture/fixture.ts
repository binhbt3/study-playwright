import { test as base } from '@playwright/test';
import * as logUtil from '../utils/logUtil';

export const test = base.extend({

    // Runs before each test
    beforeEachSetup: async ({ }, use) => {
        logUtil.saveLog(`============ Test is about running ============`);
        // console.log(`Before each test setup`);
        await use(undefined); // Pass page to the test
        logUtil.saveLog(`============ Test completed ============`);
    },

    // Runs before each test
    afterEachSetup: async ({ }, use) => {
        await use(undefined); // Pass page to the test
        logUtil.saveLog(`============ Test completed ============`);
    }

});

 