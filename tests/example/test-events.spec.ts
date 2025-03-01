
import { test as base } from '@playwright/test';
import * as logUtil from '../../src/utils/logUtil'

export const test = base.extend({
    async beforeAllSetup({ }) {
        logUtil.saveLog(`============ Start running tests ============`);
        console.log(`============ Start running tests ============`);
    },

    async beforeEachSetup({}){
        logUtil.saveLog(`============ Test is about running ============`);
    },

    async afterEachSetup({}){
        logUtil.saveLog(`============ Test complete ============`);
    },

    async afterAllSetup({}){
        logUtil.saveLog(`============ All tests finished ============`);
    }
})

export { expect } from '@playwright/test';

// import { test } from '@playwright/test';
// import * as logUtil from '../src/utils/logUtil';


// test.beforeAll(async () => {
//     logUtil.saveLog(`============ Start running tests ============`);
//     console.log(`============ Start running tests ============`);
// })

// test.beforeEach(async () => {
//     logUtil.saveLog(`============ Test is about running ============`);
// })

// test.afterEach(async () => {
//     logUtil.saveLog(`============ Test complete ============`);
// })

// test.afterAll(async () => {
//     logUtil.saveLog(`============ All tests finished ============`);
// })

// // test.on('testEnd', (test, result) => {
// //     if( result.status === 'failed'){
// //         logUtil.saveLog(`TEST FAILED: "${test.title}"`)
// //     }
// //     if( result.status === 'passed'){
// //         logUtil.saveLog(`TEST PASSED: "${test.title}"`)
// //     }
    
// // })