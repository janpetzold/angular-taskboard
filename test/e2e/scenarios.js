describe('End-to-end test for the StoryController', function() {
    var scope;

    beforeEach(function($rootScope) {
        browser().navigateTo('/angular-taskboard/app/index.html');

        // Reset localStorage to start from scratch
        localStorage.clear();
    });

    it('Create a new story with one task', function() {
        expect(element('.l-task-dropzone .l-stories').count()).toBe(0);
        expect(element('.l-dialog-story-popup').css('display')).toBe('none');
        expect(element('.l-dialog-task-popup').css('display')).toBe('none');

        // Click button to open dialog for a new story
        element('#story-add').click();

        expect(element('.l-dialog-story-popup').css('display')).toBe('block');

        // Simulate data
        input('newStory.name').enter('Go shopping');
        input('newStory.priority').enter(4);

        // Submit and reload the browser
        element('.l-dialog-story-popup a').click();

        // TODO: Why is that necessary? Try a rewrite using  Protractor!
        browser().reload();

        // Add task to story
        element('.task-add:first').click();

        expect(element('.l-dialog-task-popup').css('display')).toBe('block');

        // Simulate data
        input('newTask.title').enter('Buy potatoes');
        input('newTask.assignee').enter('Jan');
        input('newTask.estimate').enter(4);

        // Submit
        element('.l-dialog-task-popup a').click();

        expect(element('.task-item textarea').count()).toBe(1);
        expect(element('.task-item textarea').text()).toBe("Buy potatoes");
        expect(element('.l-stories h2').text()).toBe('Story Go shopping (1 tasks, 4 remaining days)');
    });
});
