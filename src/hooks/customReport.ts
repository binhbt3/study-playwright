import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter'
import * as logUtil from '../utils/logUtil'
import * as FramworkConstants from '../constants/framework-constants'

class CustomReporter implements Reporter {
    onBegin(config: FullConfig, suite: Suite): void {
        const suiteTitle = suite.suites.length > 0 ? suite.suites[0].title : 'Root Suite';
        logUtil.saveLog(`Starting test suite: "${suiteTitle}"`);
    }

    onTestBegin(test: TestCase, result: TestResult): void {
        logUtil.saveLog(`Test started: "${test.parent?.title || 'No Suite'}" -> "${test.title}"`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        logUtil.saveLog(`Test Completed: "${test.title}". Status: "${result.status}"`);
    }

    onEnd(result: FullResult) {
        logUtil.saveLog(`All tests finished!`)
    }

}

export default CustomReporter