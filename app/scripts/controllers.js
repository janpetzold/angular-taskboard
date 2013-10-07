function StoryController($scope, StorageService) {
    // Model for all stories
    $scope.stories = StorageService.getStories();

    // Model for all assignees
    $scope.assignees = StorageService.getAssignees();

    $scope.orderProp = "-age";

    // Watch Stories for changes to immediately update the task count for each level
    $scope.$watch('stories', function(stories) {
        $scope.tasksUndone = getTasksForLevel($scope.stories, 0);
        $scope.tasksProgressing = getTasksForLevel($scope.stories, 1);
        $scope.tasksResolved = getTasksForLevel($scope.stories, 2);
        $scope.tasksDone = getTasksForLevel($scope.stories, 3);
    }, true);

    // Define task targets state - hidden by default
    $scope.taskTargets = {
        "targetToDo": {
            "hidden" : true
        },
        "targetProgress": {
            "hidden" : true
        },
        "targetResolved": {
            "hidden" : true
        },
        "targetDone": {
            "hidden" : true
        }
    };

    $scope.handleDragStateFromToDo = function() {
        $scope.taskTargets.targetProgress.hidden = false;
        $scope.taskTargets.targetResolved.hidden = false;
    };

    $scope.handleDragStateFromProgress = function() {
        $scope.taskTargets.targetToDo.hidden = false;
        $scope.taskTargets.targetResolved.hidden = false;
    };

    $scope.handleDragStateFromResolved = function() {
        $scope.taskTargets.targetToDo.hidden = false;
        $scope.taskTargets.targetProgress.hidden = false;
    };

    $scope.handleResetDragState = function() {
       for(var target in $scope.taskTargets) {
           $scope.taskTargets[target].hidden = true;
       }
    };

    $scope.changeStateForTask = function(taskId, state) {
        var task = getTaskByHashKey($scope.stories, taskId);
        task.status = state;

        StorageService.setStories($scope.stories);
    };

    $scope.taskUpdated = function(element) {
        simplestBenchmark.start();

        // TODO: Any chance to implement undo?
        var storyIndex = element.$parent.$index;
        var taskIndex =  element.$index;

        $scope.stories[storyIndex].tasks[taskIndex].title = element.task.title;
        StorageService.setStories($scope.stories);

        simplestBenchmark.stop();
    };

    $scope.newStory =  {
        "hidden" : true,
        "name" : '',
        "priority" : 1,
        "time" : new Date().getTime()
    };

    // Set the pre-defined values of a new task
    $scope.newTask = {
        "hidden" : true,
        "story" : {
            key : '',
            name : ''
        },
        "title" : '',
        "assignee" : '',
        "estimate" : 1,
        "status" : 0,
        "time" : new Date().getTime()
    };

    $scope.newStory.triggerDialog = function() {
        if($scope.newStory.hidden === false) {
            $scope.newStory.hidden = true;
        } else {
            $scope.newStory.hidden = false;
        }
    };

    $scope.newStory.add = function() {
        if($scope.newStory.name && $scope.newStory.name.length > 0) {
            // Create new story and add it to the existing ones
            var story = createNewStory($scope.newStory);

            // Update stories in view and storage
            $scope.stories = addStory($scope.stories, story)
            StorageService.setStories($scope.stories);

            // Hide the input dialog
            $scope.newStory.hidden = true;
        }
    };

    $scope.deleteStory = function(key) {
        for (var story in $scope.stories) {
            if($scope.stories[story].$$hashKey === key) {
                $scope.stories.splice(story, 1);
                StorageService.setStories($scope.stories);
            }
        }
    };

    $scope.newTask.triggerDialog = function(key) {
        if($scope.newTask.hidden === false) {
            $scope.newTask.hidden = true;
        } else {
            $scope.newTask.hidden = false;
            var story = getStoryByHashKey($scope.stories, key);
            $scope.newTask.story.name = story.name;
            $scope.newTask.story.key = key;
        }
    };

    $scope.newTask.add = function() {
        if($scope.newTask.title && $scope.newTask.title.length > 0) {
            // Create new task and add it to the existing story
            var task = createNewTask($scope.newTask);

            var story = getStoryByHashKey($scope.stories, $scope.newTask.story.key);

            addTaskToStory(story, task);

            // Create assignee by name
            var assignee = createNewAssignee(task.assignee);

            // Add assignee to model
            $scope.assignees = addAssignee($scope.assignees, assignee);

            // Update stories in storage
            StorageService.setStories($scope.stories);

            // Update assignees in storage
            StorageService.setAssignees($scope.assignees);

            // Hide the input dialog
            $scope.newTask.hidden = true;
        }
    };

    $scope.deleteTask = function(key) {
        console.log("Deleting task " + key);
        for (var story in $scope.stories) {
            if($scope.stories[story].hasOwnProperty("tasks")) {
                var tasks = $scope.stories[story].tasks;
                for(var task in tasks) {
                    if(tasks[task].$$hashKey === key) {
                        tasks.splice(task, 1);
                        StorageService.setStories($scope.stories);
                        // TODO: Check if task.assignee is used in any other task - if not, delete him
                    }
                }
            }
        }
    };

    $scope.resetFilter = function() {
        $scope.filterProp = "";
    }
}

function createNewAssignee(name) {
    var assignee = {
        name : name
    };
    return assignee;
}

function createNewStory(story) {
    var story = {
        "name" : story.name,
        "priority" : story.priority,
        "time" : story.time
    };
    return story;
}

function addStory(stories, story) {
    if(stories && stories.length > 0) {
        stories.push(story);
    } else {
        stories = [story];
    }
    return stories;
}

function createNewTask(task) {
    var task = {
        "title" : task.title,
        "assignee" : task.assignee,
        "estimate" : task.estimate,
        "status" : task.status,
        "time" : task.time
    }
    return task;
}

function addAssignee(assignees, assignee) {
    if(assignees && assignees.length > 0) {
        if(!_.find(assignees, function(a) { return a.name === assignee.name })) {
            assignees.push(assignee);
        }
    } else {
        assignees = [assignee];
    }
    return assignees;
}

function addTaskToStory(story, task) {
    if(story.hasOwnProperty("tasks")) {
        story.tasks.push(task);
    } else {
        story.tasks = [task];
    }
}

function getTaskByHashKey(stories, key) {
    for (var story in stories) {
        if(stories[story].hasOwnProperty("tasks")) {
            var tasks = stories[story].tasks;
            for(var task in tasks) {
                if(tasks[task].$$hashKey === key) {
                    return tasks[task];
                }
            }
        }
    }
    return null;
}

function getTaskStatusByHashKey(key) {
    var stories = StorageService.getStories();
    for (var story in stories) {
        if(stories[story].hasOwnProperty("tasks")) {
            var tasks = stories[story].tasks;
            for(var task in tasks) {
                if(tasks[task].$$hashKey === key) {
                    return tasks[task].status;
                }
            }
        }
    }
    return null;
}

function getStoryByHashKey(stories, key) {
    for (var story in stories) {
        if(stories[story].$$hashKey === key) {
            return stories[story];
        }
    }
}

function getTasksForLevel(stories, level) {
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
}



var simplestBenchmark = (function() {
    var startTime;

    return {
        start : function() {
            startTime = new Date().getTime();
        },
        stop : function() {
            console.log("Zeit: " + (new Date().getTime() - startTime) + "ms");
        }
    };
})();

/**
 * This is a helper function just to emulate some processing. NEVER USE THIS IN PRODUCTION!
 * @param millis
 */
var sleep = function(millis)
{
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); }
    while(curDate-date < millis);
};


// List all DIs to avoid errors in minification
StoryController.$inject = ['$scope', 'StorageService'];