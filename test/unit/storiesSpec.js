/**
 * All unit tests for the stories module
 *
 * @author Jan Petzold
 */

app.tests = {};

describe("Unit tests for stories module", function() {
    var story1, story2, story3 = null;
    var stories = [];
    var storageService, sequenceNumberService = null;

    beforeEach(function() {
        // Mock stories
        story1 = app.tests.mockStory(1, 3);
        story2 = app.tests.mockStory(2, 1);
        story3 = app.tests.mockStory(3, 5);
        stories = [story1, story2, story3];

        // Mock storageService
        storageService = app.tests.mockStorageService();
        spyOn(storageService, 'setStories');

        // Mock sequenceNumberService
        sequenceNumberService = app.tests.mockSequenceNumberService();
    });

    it("check creating a new story", function() {
        var sourceStory = {
            "hidden" : true,
            "name" : 'A completely new and fascinating story',
            "priority" : 4,
            "time" : new Date().getTime()
        };

        app.stories.createStory(stories, sourceStory, storageService, sequenceNumberService);

        expect(stories.length).toEqual(4);
        expect(stories[stories.length - 1].id).toEqual(1024);
        expect(storageService.setStories).toHaveBeenCalled();
    });

    it("check deleting a story", function() {
        app.stories.deleteStory(stories, story3, storageService);

        expect(stories.length).toEqual(2);
        expect(stories[stories.length - 1].id).toEqual(2);
        expect(storageService.setStories).toHaveBeenCalled();
    });

    it("check changing of a story state", function() {
        app.stories.changeStoryState(stories, story2, storageService);

        expect(story1.state).toEqual("expanded");
        expect(story2.state).toEqual("collapsed");
        expect(storageService.setStories).toHaveBeenCalled();
    });

    it("check fetching a story by id", function() {
        var story = app.stories.getStoryById(stories, 2);
        expect(story.id).toEqual(2);

        story = app.stories.getStoryById(stories, 999);
        expect(story).toBe(null);
    });

    it("check calculating the remaining story time", function() {
        expect(app.stories.getRemainingTime(story1)).toEqual(0);

        // Create some dummy tasks
        var task1 = app.tests.mockTask(1, story1, 4);
        var task2 = app.tests.mockTask(2, story1, 3);
        var task3 = app.tests.mockTask(3, story1, 7);
        story1.tasks = [task1, task2, task3];

        expect(app.stories.getRemainingTime(story1)).toEqual(14);
    });
});

app.tests.mockStory = function(num, priority) {
    return {
        "id" : num,
        "name" : "TestStory" + num,
        "priority" : priority,
        "time" : new Date().getTime(),
        "state" : "expanded"
    };
};

app.tests.mockTask = function(num, story, estimate) {
    return {
        "storyId" : story.id,
        "title" : 'TestTask' + num,
        "assignee" : 'TestUser',
        "estimate" : estimate,
        "status" : 0,
        "time" : new Date().getTime()
    };
};

app.tests.mockStorageService = function() {
    return {
        setStories : function() {
            return null;
        }
    };
};

app.tests.mockSequenceNumberService = function() {
    return {
        getSequenceNumber : function() {
            return 1024;
        }
    };
};

