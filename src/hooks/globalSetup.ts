import { FullConfig } from "@playwright/test";
import * as logUtil from '../utils/logUtil'

async function globalSetup(config:FullConfig) {
    
    logUtil.createLogFile();
    logUtil.saveLog(`============ Start running tests ============`);

}

export default globalSetup;
