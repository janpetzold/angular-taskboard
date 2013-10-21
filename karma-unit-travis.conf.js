// Karma configuration
// Generated on Mon Oct 21 2013 18:35:42 GMT+0200 (W. Europe Daylight Time)
// TODO: This file exists because I had a number of path issues

// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    './app/js/libraries/angular/angular.js',
    './app/js/libraries/jquery/jquery.js',
    './test/lib/angular-mocks.js',
    './app/js/*.js',
    './test/unit/*.js'
];


// list of files to exclude
exclude = [

];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];

// web server port
port = 9876;

// cli runner port
runnerPort = 9100;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 10000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
