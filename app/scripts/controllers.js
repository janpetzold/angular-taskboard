/**
 * This script is the front controller for all user action related to stories and tasks.
 *
 * @author Jan Petzold
 */

/**
 * The main AngularJS controller for the taskboard.
 *
 * @param $scope The global application scope.
 * @param storageService The service to load and store all story-related data.
 * @param sequenceNumberService The service for generating unique IDs.
 * @constructor
 */
function StoryController($scope, storageService, sequenceNumberService) {
    // Model for all stories
    $scope.stories = storageService.getStories();

    // Model for all assignees
    $scope.assignees = storageService.getAssignees();

    // Default story order (Creation time descending)
    $scope.orderProp = "-time";

    // Reset the assignee filter
    $scope.resetFilter = function() {
        $scope.filterProp = "";
    };

    /* Story methods */

    $scope.newStory = app.stories.storyTemplate;

    $scope.newStory.add = function() {
        if($scope.newStory.name && $scope.newStory.name.length > 0) {
            app.stories.createStory($scope.stories, $scope.newStory, storageService, sequenceNumberService);

            // Hide the input dialog
            $scope.newStory.hidden = true;
        }
    };

    $scope.deleteStory = function(story) {
        app.stories.deleteStory($scope.stories, story, storageService);
    };

    // Watch Stories for changes to immediately update the task count for each level
    // TODO: Maybe this can be simplified?
    $scope.$watch('stories', function() {
        $scope.tasksUndone = app.tasks.getTasksForLevel($scope.stories, 0);
        $scope.tasksProgressing = app.tasks.getTasksForLevel($scope.stories, 1);
        $scope.tasksResolved = app.tasks.getTasksForLevel($scope.stories, 2);
        $scope.tasksDone = app.tasks.getTasksForLevel($scope.stories, 3);
    }, true);

    $scope.getRemainingTime = function(story) {
        return app.stories.getRemainingTime(story);
    };

    $scope.changeStoryState = function(story) {
        app.stories.changeStoryState($scope.stories, story, storageService);
    };

    $scope.newStory.triggerDialog = function() {
        app.helpers.triggerHidden($scope.newStory);
    };

    /* Task methods */

    $scope.newTask = app.tasks.taskTemplate;

    // Define task targets state - hidden by default
    $scope.taskTargets = app.tasks.taskTargets;

    // handle the different drag states
    $scope.handleDragFromState = function(state) {
        app.tasks.handleDragFromState($scope.taskTargets, state);
    };

    // Reset dragging and hide all taskTargets
    $scope.handleResetDragState = function() {
        for(var target in $scope.taskTargets) {
            $scope.taskTargets[target].hidden = true;
        }
    };

    $scope.newTask.triggerDialog = function(story) {
        app.helpers.triggerHidden($scope.newTask);

        // Set the story ID as property of the new task
        if($scope.newTask.hidden === false) {
            $scope.newTask.storyId = story.id;
        }
    };

    $scope.newTask.add = function() {
        if($scope.newTask.title && $scope.newTask.title.length > 0) {
            app.tasks.createNewTask($scope.stories, $scope.newTask, $scope.assignees, storageService, sequenceNumberService);

            // Hide the input dialog
            $scope.newTask.hidden = true;
        }
    };

    $scope.deleteTask = function(task, taskIndex) {
        app.tasks.deleteTask($scope.stories, task, taskIndex, storageService);
    };

    $scope.changeTaskState = function(storyId, taskIndex, state) {
        app.tasks.changeTaskState($scope.stories, storyId, taskIndex, state, storageService);
    };

    $scope.taskUpdated = function(task) {
        // Update textarea height so it shows the entire text during typing
        app.layout.adjustTextAreaHeight("#task" + task.id + " textarea");

        // Update storage on every change
        storageService.setStories($scope.stories);
    };

    $scope.taskEstimateUpdated = function() {
        storageService.setStories($scope.stories);
    };
}

// List all DIs to avoid errors in minification
StoryController.$inject = ['$scope', 'storageService', 'sequenceNumberService'];