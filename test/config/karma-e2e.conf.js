module.exports = function (config) {
  config.set({
    basePath: '../',

    files: [
      'e2e/**/*.js'
    ],

    frameworks: ['ng-scenario'],

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: true,

    proxies: {
      '/': 'http://localhost:63342/'
    },

    junitReporter: {
      outputFile: 'test_out/e2e.xml',
      suite: 'e2e'
    }
  });
};
