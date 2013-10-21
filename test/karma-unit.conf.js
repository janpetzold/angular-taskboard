module.exports = function (config) {
    config.set({
        basePath: '',

        files: [
            '../app/js/libraries/angular/angular.js',
            '../app/js/libraries/jquery/jquery.js',
            'lib/angular-mocks.js',
            '../app/js/*.js',
            'unit/*.js'
        ],

        frameworks: ['jasmine'],

        autoWatch: false,

        browsers : ['PhantomJS'],

        singleRun: true,

        junitReporter: {
            outputFile: 'review/unit.xml',
            suite: 'unit'
        }
    });
};