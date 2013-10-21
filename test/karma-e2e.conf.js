module.exports = function (config) {
  config.set({
    basePath: '',

    files: [
        'e2e/**/*.js'
    ],

    frameworks: ['ng-scenario'],

    autoWatch: false,

    browsers : ['Chrome'],

    singleRun: true,

    proxies: {
      '/': 'http://localhost:63343/'
    },

    junitReporter: {
      outputFile: 'results/e2e.xml',
      suite: 'e2e'
    }
  });
};
