import { test } from '../src/fixture/index.fixture';
import { expect, TestInfo } from '@playwright/test';
import userRegisterData from './testdata/userRegisterData.json'

test.describe.parallel('User Register @group1', () => {
    for (const data of userRegisterData) {
        test(`User Register with ${data.username}`, async ({dashBoardPage, userRegister }, testInfo: TestInfo) => {

            await test.step('Click button User Registration', async () => {
                await dashBoardPage.clickOnUserRegistration(testInfo);
            })

            await test.step('Fill information on User Registration Page', async () => {
                await userRegister.fillInformation(data, testInfo);
            })

            await test.step('Click Register button', async () => {
                await userRegister.clickOnRegisterButton(testInfo);
            })
        });
    }
  
})
