function StoryController($scope, StorageService) {
    // Model for all stories
    $scope.stories = StorageService.getStories();

    // Model for all assignees
    $scope.assignees = StorageService.getAssignees();

    $scope.orderProp = "-time";

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

    $scope.getRemaining = function(story) {
        var counter = 0;
        if(story.hasOwnProperty("tasks")) {
            for (var task in story.tasks) {
                counter = counter + parseInt(story.tasks[task].estimate, 10);
            }
        }
        return counter;
    }

    $scope.changeStateForTask = function(taskId, state) {
        var task = getTaskByHashKey($scope.stories, taskId);
        task.status = state;

        StorageService.setStories($scope.stories);
    };

    $scope.taskUpdated = function(task) {
        // Update textarea height so it shows the entire text
        $("#task" + task.id + " textarea").height(24);
        $("#task" + task.id + " textarea").height($("#task" + task.id + " textarea").prop("scrollHeight") + 12);

        // Update storage on every change
        StorageService.setStories($scope.stories);
    };

    $scope.taskEstimateUpdated = function() {
        // Update storage on every change
        StorageService.setStories($scope.stories);
    };

    $scope.changeStoryState = function(story) {
        if(story.state === "expanded") {
            story.state = "collapsed";
        } else if(story.state === "collapsed") {
            story.state = "expanded";
        }

        // Update stories in storage
        StorageService.setStories($scope.stories);
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
        "storyId" : null,
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
            $scope.stories = addStory($scope.stories, story);
            StorageService.setStories($scope.stories);

            // Hide the input dialog
            $scope.newStory.hidden = true;
        }
    };

    $scope.deleteStory = function(story) {
        for(var i in $scope.stories) {
            if($scope.stories[i].id === story.id) {
                $scope.stories.splice(i, 1);
            }
        }
        StorageService.setStories($scope.stories);
    };

    $scope.newTask.triggerDialog = function(story) {
        if($scope.newTask.hidden === false) {
            $scope.newTask.hidden = true;
        } else {
            $scope.newTask.hidden = false;
            $scope.newTask.storyId = story.id;
        }
    };

    $scope.newTask.add = function(task) {
        if($scope.newTask.title && $scope.newTask.title.length > 0) {
            // Create new task and add it to the existing story
            var task = createNewTask($scope.newTask);

            addTaskToStories($scope.stories, task);

            // Update stories in storage
            StorageService.setStories($scope.stories);

            // Create assignee by name
            var assignee = createNewAssignee(task.assignee);

            // Add assignee to model
            $scope.assignees = addAssignee($scope.assignees, assignee);

            // Update assignees in storage
            StorageService.setAssignees($scope.assignees);

            // Hide the input dialog
            $scope.newTask.hidden = true;
        }
    };

    $scope.deleteTask = function(task, taskIndex) {
        var story = getStoryById($scope.stories, task.storyId);
        story.tasks.splice(taskIndex, 1);
        StorageService.setStories($scope.stories);
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
        "id" : app.service.getSequenceNumber(),
        "name" : story.name,
        "priority" : story.priority,
        "time" : story.time,
        "state" : "expanded"
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
        "id" : app.service.getSequenceNumber(),
        "storyId" : task.storyId,
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

function addTaskToStories(stories, task) {
    var story = getStoryById(stories, task.storyId)
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

function getStoryById(stories, id) {
    for (var story in stories) {
        if(stories[story].id === id) {
            return stories[story];
        }
    }
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