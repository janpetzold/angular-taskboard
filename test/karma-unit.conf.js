module.exports = function (config) {
    config.set({
        basePath: '',

        files: [
            '../app/js/libraries/angular/angular.js',
            '../app/js/libraries/jquery/jquery.js',
            '../app/js/libraries/underscore/underscore.js',
            'lib/angular-mocks.js',
            '../app/js/**/*.js',
            'unit/controllerSpec.js',
        ],

        frameworks: ['jasmine'],

        autoWatch: false,

        browsers : ['C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'],

        singleRun: true,

        proxies: {
            '/': 'http://localhost:63342/'
        },

        junitReporter: {
            outputFile: 'results/unit.xml',
            suite: 'unit'
        }
    });
};