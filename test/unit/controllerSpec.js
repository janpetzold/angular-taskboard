/**
 * All unit tests for the controller
 *
 * @auther Jan Petzold
 */
describe("Unit tests for controller", function() {
    var scope, storyController, storageService, sequenceNumberService;

    beforeEach(module('stories'));

    beforeEach(inject(function($rootScope, $controller) {
        inject(function($injector) {
            storageService = $injector.get('storageService');
            sequenceNumberService = $injector.get('sequenceNumberService');
        });

        // Create new scope and controller
        scope = $rootScope.$new();

        // Reset stories in localStorage
        storageService.setStories([]);

        storyController = $controller(StoryController, {$scope: scope, storageService : storageService, sequenceNumberService : sequenceNumberService});
    }));


    it('Test controller methods for story', function() {
        expect(scope.stories).toEqual([]);
        expect(scope.orderProp).toBe('-time');

        // Create a new story
        scope.newStory = app.stories.storyTemplate;

        scope.newStory.name = "Go shopping";
        scope.newStory.add();

        // Refresh stories in scope (TODO: Why is that necessary?)
        scope.stories = storageService.getStories();

        expect(scope.getRemainingTime(scope.newStory)).toBe(0);
        expect(scope.stories.length).toBe(1);
        expect(scope.stories[0].name).toBe("Go shopping");
    });
});
