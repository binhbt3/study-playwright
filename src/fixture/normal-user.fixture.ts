import { test as base, Page, expect } from '@playwright/test';


type myFixture = {
  normalUser: Page
}

const test = base.extend<myFixture>({
    normalUser: async({page}, use) => {
    console.log("Before run in fixture")
    await use(page)
    console.log("After run test")
  }
})

export { test }

