import { test as base} from '@playwright/test'
import { DashBoardPage } from '../pom/dashBoard.page'
import { UserRegister } from '../pom/userRegister.page'
import { LoginPage } from '../pom/login.page'
import * as WebUI from '../keyword/WebUI'
import * as FrameworkConstants from '../constants/framework-constants'

const test = base.extend<{userRegister: UserRegister}>({
    userRegister: async({page}, use) => {

        // Go to website
        // await WebUI.openUrl(page,FrameworkConstants.BASE_URL);
        // Login
        // await loginPage.login()
        const userRegister = new UserRegister(page)

        await use(userRegister)

        // logout

    }
})

export { test }