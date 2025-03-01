import { test as base, Page, expect } from '@playwright/test';
import * as dotenv from 'dotenv'
import * as WebUI from '../../src/keyword/WebUI'
import * as FrameworkConstants from '../../src/constants/framework-constants'
// const test = base.extend<{pageWithLog: Page}>({
//   pageWithLog: async({page}, use) => {
//     console.log("Before run in fixture")
//     await use(page)
//     console.log("After run test")
//   }
// })

// export { test }


type myFixture = {
  pageWithLog: Page
}

const test = base.extend<myFixture>({
  pageWithLog: async({page}, use) => {
    dotenv.config();
    console.log("Before run in fixture")
    WebUI.openUrl(page,FrameworkConstants.BASE_URL);
    await use(page)
    console.log("After run test")
  }
})

export { test }

