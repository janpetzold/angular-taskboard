module.exports = function (config) {
    config.set({
        basePath: '',

        files: [
            '../app/js/libraries/angular/angular.js',
            '../app/js/libraries/jquery/jquery.js',
            '../app/js/libraries/underscore/underscore.js',
            'lib/angular-mocks.js',
            '../app/js/*.js',
            'unit/*.js'
        ],

        frameworks: ['jasmine'],

        browsers : ['PhantomJS'],

        singleRun: true,

        reporters: ['coverage'],

        coverageReporter : {
            type : 'text',
            dir : '../review/coverage'
        },

        preprocessors: {
            '../app/js/*.js': ['coverage']
        }
    });
};