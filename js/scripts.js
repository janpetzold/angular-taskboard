/**
 * This is the initial loading script for the application with the core variable <code>app</code>.
 *
 * @author Jan Petzold
 */

var app = angular.module('stories', []);
app.layout = {};

/**
 * Auto-fit all text areas to adjust height based on the text inside them
 */
app.layout.autoFitTextArea = function() {
    $(".item textarea").each(function() {
        $(this).css("overflow", "hidden");
        app.layout.adjustTextAreaHeight(this);
    });
};

app.layout.adjustTextAreaHeight = function(element) {
    $(element).height(24);
    $(element).height($(element).prop("scrollHeight") + 12);
};

/**
 * Execute this after DOM load
 */
$(document).ready(app.layout.autoFitTextArea);
/**
 * This script collects all assignee-related methods.
 *
 * * @author Jan Petzold
 */

app.assignees = {};

/**
 * Create a new assignee for a task
 * @param name The name of the assignee
 * @returns {{name: *}} The created assignee
 */
app.assignees.createNewAssignee = function(name) {
    return {
        name : name
    };
};

/**
 * Add a new assignee to the existing collection.
 *
 * @param assignees The currently existing assignees
 * @param assignee The new assignee
 * @returns {*} The updated collection of assignees
 */
app.assignees.addAssignee = function(assignees, assignee) {
    if(assignees && assignees.length > 0) {
        var assigneeFound = false;
        for (var i in assignees) {
            if(assignees[i].name === assignee.name) {
                assigneeFound = true;
            }
        }
        if(!assigneeFound) {
            assignees.push(assignee);
        }
    } else {
        assignees = [assignee];
    }
    return assignees;
};
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
            $scope.stories = app.stories.createStory($scope.stories, $scope.newStory, storageService, sequenceNumberService);

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
/**
 * This script contains all Angular directives. Right now this is the drag'n'drop-functionality of the tasks.
 *
 * @author Jan Petzold
 */

app.task = {};

/**
 * Angular directive for a draggable element.
 */
app.directive('draggable', function() {
    return function(scope, element) {
        var el = element[0];

        el.draggable = true;

        el.addEventListener("dragstart", function(e) {
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("text/plain", this.id);

            // Update height of other taskTargets depending on the current height
            $(".task-drop-target").height($(el).height() + 20);

            // Update top position of other taskTargets depending on the current top
            $(".task-drop-target").css("top", $(el).position().top - 2);

            // Show targets depending on state
            scope.$apply('handleDragFromState(' + scope.task.status + ')');

            return false;
        }, false);

        el.addEventListener("dragend", function(e) {
            scope.$apply('handleResetDragState()');

            // Get the current screen dimension
            var width = parseInt($("body").width(), 10);
            scope.$apply('changeTaskState(' + scope.$parent.story.id + ',' + scope.$index + ',' + app.helpers.getStatusFromOffset(width, e.screenX) + ')');

            return false;
        }, false);
    }
});

/**
 * Angular directive for the drop zone.
 */
app.directive('droppable', function() {
    return function(scope, element) {
        var el = element[0];

        el.addEventListener("dragover", function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'copy';
            return false;
        },
        false);

        el.addEventListener("dragenter", function(e) {
            return false;
        }, false);

        el.addEventListener("dragleave", function(e) {
        }, false);

        el.addEventListener("drop", function(e) {
            if (e.stopPropagation()) {
                e.stopPropagation();
            }
            if(e.preventDefault()) {
                e.preventDefault();
            }
            return false;
        },
        false);
    }
});
/**
 * This script collects all kinds of helper functions.
 *
 * @author: Jan Petzold
 */

app.helpers = {};

/**
 * Change the <code>hidden</code> property of an object.
 * @param obj The object with the property
 * @returns {*} The updated object
 */
app.helpers.triggerHidden = function(obj) {
    obj.hidden = obj.hidden === false;
    return obj;
};

/**
 * Perform a very simple benchmark between the call of start / stop.
 */
app.helpers.simpleBenchmark = (function() {
    var startTime;

    return {
        start : function() {
            startTime = new Date().getTime();
        },
        stop : function() {
            var elapsedTime = new Date().getTime() - startTime;
            console.log("Elapsed time: " + elapsedTime + "ms");
            return elapsedTime;
        }
    };
})();

/**
 * Helper method to get the status code by the current X offset
 *
 * @param offset The X offset of the current element
 * @returns {number} The status code for the current <code>task</code>
 */
app.helpers.getStatusFromOffset = function(width, offset) {
    var interval = width / 3;

    if(offset >= interval && offset <= (interval * 2)) {
        return 1;
    } else if (offset >= (interval * 2)) {
        return 2;
    } else {
        return 0;
    }
};

/**
 * This is a helper function just to emulate some processing. NEVER USE THIS IN PRODUCTION!
 * @param millis
 */
app.helpers.sleep = function(millis) {
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); }
    while(curDate-date < millis);
};

/**
 * This script has all <code>provider</code>s that the Angular controller can use.
 *
 * @author Jan Petzold
 */

/**
 * This service is used to generate a new number which can be used as an ID. May be replaced with a UUID / GUID generator.
 */
app.provider('sequenceNumberService', function() {
    this.$get = function() {
        return {
            getSequenceNumber: function() {
                var num = parseInt(window.localStorage.getItem("sequenceNumber"), 10);
                if(!num) {
                    num = 1;
                }
                window.localStorage.setItem("sequenceNumber", (num + 1));
                return num + 1;
            }
        }
    };
});

/**
 * This service saves all story data into the browsers <code>localStorage</code>.
 */
app.provider('storageService', function() {
    this.$get = function() {
        return {
            getStories: function() {
                return JSON.parse(window.localStorage.getItem("persistedData"));
            },
            setStories : function(data) {
                window.localStorage.setItem("persistedData", JSON.stringify(data));
            },
            getAssignees: function() {
                return JSON.parse(window.localStorage.getItem("persistedAssignees"));
            },
            setAssignees : function(data) {
                window.localStorage.setItem("persistedAssignees", JSON.stringify(data));
            }
        }
    };
});
/**
 * This script collects all story-related methods.
 *
 * @author Jan Petzold
 */

app.stories = {};

/**
 * Template object for a new story. Values will be displayed in the dialog.
 */
app.stories.storyTemplate = {
    "hidden" : true,
    "name" : '',
    "priority" : 1,
    "time" : new Date().getTime()
};

/**
 * Create a new story based on the parameters
 *
 * @param stories All existing stories
 * @param sourceStory The story object that contains the user input data
 * @param storageService The service where the stories are persisted
 * @param sequenceNumberService The service that generates the unique ID for the story
 */
app.stories.createStory = function(stories, sourceStory, storageService, sequenceNumberService) {
    var story = {
        "id" : sequenceNumberService.getSequenceNumber(),
        "name" : sourceStory.name,
        "priority" : sourceStory.priority,
        "time" : sourceStory.time,
        "state" : "expanded"
    };

    // Update stories in view and storage
    stories = app.stories.addStory(stories, story);
    storageService.setStories(stories);

    return stories;
};

/**
 * Adds the created story to a collection of stories.
 *
 * @param stories The exitsintg story collection
 * @param story The story that shall be added
 * @returns {{stories}} The updated story collection
 */
app.stories.addStory = function(stories, story) {
    if(stories && stories.length > 0) {
        stories.push(story);
    } else {
        stories = [story];
    }
    return stories;
};

/**
 * Deletes a given story and persist the changes
 *
 * @param stories All existing stories
 * @param story The story that shall be deleted
 * @param storageService The storage service to persist the changes
 */
app.stories.deleteStory = function(stories, story, storageService) {
    for(var i in stories) {
        if(stories[i].id === story.id) {
            stories.splice(i, 1);
        }
    }
    storageService.setStories(stories);
};

/**
 * Change the story state (expanded or collapsed) and save that property
 * @param stories All existing stories
 * @param story The story to be updated
 * @param storageService The storage service where the change will be persisted
 */
app.stories.changeStoryState = function(stories, story, storageService) {
    if(story.state === "expanded") {
        story.state = "collapsed";
    } else if(story.state === "collapsed") {
        story.state = "expanded";
        // TODO: Add listener for textarea visibility change
    }
    // Update stories in storage
    storageService.setStories(stories);
};



/**
 * Retrieves a story by its ID
 * @param stories All stories that need to be considered
 * @param id The ID of the story
 * @returns {{story}} The story object. May be <code>null</code>.
 */
app.stories.getStoryById = function(stories, id) {
    for (var story in stories) {
        if(stories[story].id === id) {
            return stories[story];
        }
    }
    return null;
};

/**
 * Get the sum of remaining time for a story. Is calculated based on the estimate-attribute for each task.
 *
 * @param story The story
 * @returns {number} The remaining time for the story
 */
app.stories.getRemainingTime = function(story) {
    var counter = 0;
    if(story.hasOwnProperty("tasks")) {
        for (var task in story.tasks) {
            counter = counter + parseInt(story.tasks[task].estimate, 10);
        }
    }
    return counter;
};

/**
 * This script collects all task-related methods.
 *
 * @author Jan Petzold
 */

app.tasks = {};

/**
 * Template object for a new task. Values will be displayed in the dialog.
 */
app.tasks.taskTemplate = {
    "hidden" : true,
    "storyId" : null,
    "title" : '',
    "assignee" : '',
    "estimate" : 1,
    "status" : 0,
    "time" : new Date().getTime()
};

/**
 * An object with all potential task targets.
 */
app.tasks.taskTargets = {
    "targetToDo": {
        "hidden" : true
    },
    "targetProgress": {
        "hidden" : true
    },
    "targetResolved": {
        "hidden" : true
    }
};

/**
 * Creates a new task object based on the input parameters.
 *
 * @param stories All existing stories
 * @param sourceTask The task data based on the user input
 * @param assignees All existing assignees
 * @param storageService The storage service where changes shall be persisted
 * @param sequenceNumberService The service where a unique ID for this task can be fetched
 */
app.tasks.createNewTask = function(stories, sourceTask, assignees, storageService, sequenceNumberService) {
    var task = {
        "id" : sequenceNumberService.getSequenceNumber(),
        "storyId" : sourceTask.storyId,
        "title" : sourceTask.title,
        "assignee" : sourceTask.assignee,
        "estimate" : sourceTask.estimate,
        "status" : sourceTask.status,
        "time" : sourceTask.time
    };

    app.tasks.addTaskToStories(stories, task);

    // Update stories in storage
    storageService.setStories(stories);

    // Create assignee by name and add it to the model
    var assignee = app.assignees.createNewAssignee(task.assignee);
    var assignees = app.assignees.addAssignee(assignees, assignee);

    // Update assignees in storage
    storageService.setAssignees(assignees);
};

/**
 * Adds the created task to the story collection
 *
 * @param stories All existing stories
 * @param task The created task
 */
app.tasks.addTaskToStories = function(stories, task) {
    var story = app.stories.getStoryById(stories, task.storyId);
    if(story.hasOwnProperty("tasks")) {
        story.tasks.push(task);
    } else {
        story.tasks = [task];
    }
};

/**
 * Deletes a task from the given story
 *
 * @param stories All existing stories
 * @param task The task that shall be deleted
 * @param taskIndex The index of the task in the tasks object of the story
 * @param storageService The storage service to persist the changes
 */
app.tasks.deleteTask = function(stories, task, taskIndex, storageService) {
    var story = app.stories.getStoryById(stories, task.storyId);
    story.tasks.splice(taskIndex, 1);
    storageService.setStories(stories);
};

/**
 * Update the status of a given task.
 * @param stories All existing stories
 * @param storyId The story ID of the task
 * @param taskIndex The index of the task in the tasks object of the story
 * @param state The new status
 * @param storageService The storage service to persist the changes
 */
app.tasks.changeTaskState = function(stories, storyId, taskIndex, state, storageService) {
    var story = app.stories.getStoryById(stories, storyId);
    story.tasks[taskIndex].status = state;

    storageService.setStories(stories);
};

/**
 * Call this when a drag is started to determine potential drop targets
 *
 * @param taskTargets All potential targets
 * @param state The current task state
 */
app.tasks.handleDragFromState = function(taskTargets, state) {
    if(state === 0) {
        taskTargets.targetProgress.hidden = false;
        taskTargets.targetResolved.hidden = false;
    } else if(state === 1) {
        taskTargets.targetToDo.hidden = false;
        taskTargets.targetResolved.hidden = false;
    } else if(state === 2) {
        taskTargets.targetToDo.hidden = false;
        taskTargets.targetProgress.hidden = false;
    }
};

/**
 * Get the sum of tasks in all stories for a certain level (e.g. Progressing)
 *
 * @param stories All stories that need to be covered
 * @param level The current level (e.g. 1=Progressing)
 * @returns {number} The amount of tasks for this level
 */
app.tasks.getTasksForLevel = function(stories, level) {
    var count = 0;
    for (var story in stories) {
        if(stories[story].hasOwnProperty("tasks")) {
            var tasks = stories[story].tasks;
            for(var task in tasks) {
                if(tasks[task].status === level) {
                    count++;
                }
            }
        }
    }
    return count;
};
