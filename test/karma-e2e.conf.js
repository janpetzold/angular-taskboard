module.exports = function (config) {
  config.set({
    basePath: '',

    files: [
        'e2e/**/*.js'
    ],

    frameworks: ['ng-scenario'],

    autoWatch: false,

    browsers : ['C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'],

    singleRun: true,

    proxies: {
      '/': 'http://localhost:63342/'
    },

    junitReporter: {
      outputFile: 'results/e2e.xml',
      suite: 'e2e'
    }
  });
};
