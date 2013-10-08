'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('AngularStoriesTest', function() {
  describe('Test initial view', function() {

    beforeEach(function() {
      browser().navigateTo('/angular-taskboard/app/index.html');
    });

    it('Check greeting message', function() {
        expect(element('h1').text()).toBe('the simple taskboard');
    });
  });
});
