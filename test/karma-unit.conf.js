module.exports = function (config) {
    config.set({
        basePath: '',

        files: [
            '../app/bower_components/angular/angular.js',
            '../app/bower_components/jquery/jquery.js',
            '../app/bower_components/underscore/underscore.js',
            'lib/angular-mocks.js',
            '../app/scripts/**/*.js',
            'unit/storiesSpec.js'
        ],

        frameworks: ['jasmine'],

        reporters: ['progress', 'coverage'],

        preprocessors: {
            '../app/scripts/**/*.js' : 'coverage'
        },

        autoWatch: false,

        browsers : ['C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'],

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