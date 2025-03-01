import { test as base} from '@playwright/test'
import { DashBoardPage } from '../pom/dashBoard.page'
import * as WebUI from '../keyword/WebUI'
import * as FrameworkConstants from '../constants/framework-constants'


const test = base.extend<{dashBoardPage: DashBoardPage}>({
    dashBoardPage: async({page}, use) => {

        // Go to website
        await WebUI.openUrl(page,FrameworkConstants.BASE_URL);

        // Login
        // await loginPage.login()
        const dashBoardPage = new DashBoardPage(page)

        await use(dashBoardPage)

        // logout

    }
})

export { test }