require('@babel/register');
const { addAttachment } = require('@wdio/allure-reporter').default;
const path = require('path');
const seleniumArgs = require('./config/selenium-defaults');
const exec = require('child_process').exec;
const pWaitFor = require('p-wait-for');
const pathExists = require('path-exists');
const fs = require('fs');

process.env.DEFAULT_DOWNLOAD_DIR = path.join(__dirname, 'downloads');
let maxInstances = +process.env.INSTANCES || 1;
let waitforTimeout =  +process.env.WAIT_TIMEOUT || 40000;

// =========
// Arguments
// =========
let chromeArgs = [
    '--no-sandbox',
    "window-size=1920,1080",
    'disable-infobars',
    'disable-extensions',
    'disable-notifications',
    'disable-popup-blocking',
    '--disable-dev-shm-usage',
    '--disable-impl-side-painting'
];

let fireFoxArgs = [];

// ============
// Capabilities
// ============
let capabilities = [];

let chromeCaps = {
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: chromeArgs,
        prefs: {
            download: {
                default_directory: process.env.DEFAULT_DOWNLOAD_DIR
            }
        }
    }
};

let fireFoxCaps = {
    // maxInstances can get overwritten per capability. So if you have an in house Selenium
    // grid with only 5 firefox instance available you can make sure that not more than
    // 5 instance gets started at a time.
    browserName: 'firefox',
    "moz:firefoxOptions": {
        // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
        args: fireFoxArgs,
        prefs: {
            "browser.download.manager.showWhenStarting": false,
            "browser.download.manager.showAlertOnComplete": false,
            "browser.helperApps.neverAsk.saveToDisk": "text/csv",
            "browser.download.folderList": 2,
            "browser.download.dir": process.env.DEFAULT_DOWNLOAD_DIR
        }
    }
};

switch (process.env.BROWSER_NAME.toLowerCase()) {
    case 'chrome':
        capabilities.push(chromeCaps);
        break;
    case 'firefox':
        capabilities.push(fireFoxCaps);
        break;
    case 'all':
        capabilities.push(chromeCaps, fireFoxCaps);
        break;
    default:
        throw new Error(`Incorrect -> ${process.env.BROWSER_NAME} <-  browser name - please check BROWSER_NAME=??? in package.json for your command`);
}

// ========
// HEADLESS
// ========
if(process.env.HEADLESS == true || process.env.HEADLESS === 'true') {
    chromeArgs.push('--headless');
    fireFoxArgs.push('-headless');
    maxInstances = +process.env.INSTANCES || 7;
    waitforTimeout = +process.env.WAIT_TIMEOUT || 100000;
}

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    // runner: 'local',
    // port: 9515,
    seleniumArgs,
    seleniumInstallArgs: seleniumArgs,
    seleniumLogs: './logs',
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        './specs/**/*.js'
    ],
    suites: {
        login: ['./specs/login/*.js'],
        // sub-features for login
        userLogin: ['./specs/login/userLogin.js'],
        userLogout: ['./specs/login/userLogout.js'],
        // ================================
    },
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    capabilities,
    maxInstances,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    // capabilities: {
    //     myChromeBrowser: {
    //         capabilities: {
    //             browserName: 'chrome'
    //         }
    //     },
    //     myFirefoxBrowser: {
    //         capabilities: {
    //             browserName: 'firefox'
    //         }
    //     }
    // },
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'error',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    // webdriver: 'info',
    // '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    // path:'/',
    sync: true,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'https://google.com',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: process.env.CONNECT_TIMEOUT ? +process.env.CONNECT_TIMEOUT : 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['selenium-standalone'],
    //
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    reporters: [
        // temporary disabled
        // [video, {
        // saveAllVideos: false,       // If true, also saves videos for successful test cases
        // videoSlowdownMultiplier: 3, // Higher to get slower videos, lower for faster videos [Value 1-100]
        // outputDir: 'artifacts/video-reporter'
        // }],
        ['allure', {
            //
            // If you are using the "allure" reporter you should define the directory where
            // WebdriverIO should save all allure reports.
            outputDir: 'artifacts/allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true
        }],
        'spec'
    ],
    // Saves a screenshot to a given path if a command fails.
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        compilers: ['js:@babel/register'],
        timeout: 7000000,
        retries: 1
    },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: async function (config, capabilities) {
        exec('rm -rf artifacts/* && mkdir -p downloads && rm -rf downloads/*');
    },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities, specs) {
        browser.setTimeout({ 'implicit': 2000 });
        let chai = require('chai');
        global.expect = chai.expect;
    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },

    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
     * @param {Object} test test details
     */
    beforeTest: function (test) {
        console.log(test.title);
    },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function () {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function () {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
     * @param {Object} test test details
     */
    afterTest: function (test) {

        let image = null;
        let fileName = null;

        if (!test.passed) {
            const screenShot = browser.takeScreenshot();
            image = new Buffer.from(screenShot, 'base64');
            fileName = `Screenshot - ${test.title.slice(0, 50)}...`;
            addAttachment(fileName, image, 'image/png');
        }

        try {
            browser.execute('window.sessionStorage.clear(); window.localStorage.clear();')
        } catch (err) {
            console.log(err)
        }
        browser.refresh();

        browser.setTimeout({ 'implicit': 2000 });
    },
    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },

    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: async function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    afterSession: async function (config, capabilities, specs) {
        await new Promise(resolve => setTimeout(resolve, 15000));
    },
    /**
     * Gets executed after all workers got shut down and the process is about to exit.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: async function(exitCode, config, capabilities, results) {
        exec('allure generate --clean ./artifacts/allure-results -o ./artifacts/allure-report');
        exec('rm -rf downloads/*');

        await pWaitFor(() => pathExists(path.join(__dirname, 'artifacts' ,'allure-report', 'data', 'attachments')), {
            timeout: 150000
        });

        return await new Promise(resolve => setTimeout(resolve, 7000));
    },
    /**
    * Gets executed when a refresh happens.
    * @param {String} oldSessionId session ID of the old session
    * @param {String} newSessionId session ID of the new session
    */
    //onReload: function(oldSessionId, newSessionId) {
    //}
};
