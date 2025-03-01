import { test as adminTest} from './admin-user.fixture';
import { test as normalTest} from './normal-user.fixture';
import { test as dashBoardTest}  from './dashBoard.fixture';
import { test as userRegisterTest } from './userRegister.fixture';
// import { test as setupTest } from './fixture'
import { mergeTests } from '@playwright/test';

export const test = mergeTests(adminTest, normalTest, dashBoardTest, userRegisterTest)