describe('End-to-end test for the StoryController', function() {

    beforeEach(function() {
        browser().navigateTo('/angular-taskboard/app/index.html');

        // Reset localStorage to start from scratch
        localStorage.clear();
    });

    it('Create a new story with one task', function() {
        expect(element('.dropzone .storyContainer').count()).toBe(0);
        expect(element('.addStoryContainer').css('display')).toBe('none');
        expect(element('.addTaskContainer').css('display')).toBe('none');

        // Click button to open dialog for a new story
        element('#addStoryButton').click();

        expect(element('.addStoryContainer').css('display')).toBe('block');

        // Simulate data
        input('newStory.name').enter('Go shopping');
        input('newStory.priority').enter(4);

        // Submit and reload the browser
        element('.addStoryContainer a').click();
        browser().reload();

        // Add task to story
        element('.addTaskButton:first').click();

        expect(element('.addTaskContainer').css('display')).toBe('block');

        // Simulate data
        input('newTask.title').enter('Buy potatoes');
        input('newTask.assignee').enter('Jan');
        input('newTask.estimate').enter(4);

        // Submit
        element('.addTaskContainer a').click();

        expect(element('.item textarea').count()).toBe(1);
        expect(element('.item textarea').text()).toBe("Buy potatoes");
        expect(element('.storyContainer h2').text()).toBe('Story Go shopping (1 tasks, 4 remaining days)');
    });
});
