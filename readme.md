1. Create new framework:
npm init playwright@latest
2. Run framework
Run all: npx playwright test
Run only 1 browser: npx playwright test --project=chromium
Run and show head: npx playwright test --project=chromium --head
Run 1 file: npx playwright test example.spec.js 
Run 1 test: Mark the test case as: test.only and run file
3. Trace and debug
Trace: npx playwright test example.spec.js --trace on
Debug: npx playwright test example.spec.js --debug
