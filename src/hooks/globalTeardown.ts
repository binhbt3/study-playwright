import { FullConfig } from "@playwright/test";
import * as LogUtil from '../utils/logUtil'

async function globalTeardown() {
    LogUtil.saveLog(`============ All tests finished ============`);
}

export default globalTeardown;