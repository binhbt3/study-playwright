import { test as base, Page, expect } from '@playwright/test';


type myFixture = {
  adminUser: Page
}

const test = base.extend<myFixture>({
    adminUser: async({page}, use) => {
    console.log("Before run in fixture 1")
    await use(page)
    console.log("After run test 1")
  }
})

export { test }

