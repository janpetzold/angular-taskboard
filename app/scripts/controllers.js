function StoryController($scope, StorageService) {
    $scope.stories = StorageService.getStories();
    $scope.taskUpdated = function(element) {
        benchmark.start();

        // TODO: Any chance to implement undo?
        var storyIndex = element.$parent.$index;
        var taskIndex =  element.$index;

        $scope.stories[storyIndex].tasks[taskIndex].title = element.task.title;
        StorageService.setStories($scope.stories);

        benchmark.stop();
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
        "description" : '',
        "estimate" : 1,
        "status" : 0,
        "time" : new Date().getTime()
    }

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
            $scope.stories.push(story);
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

            // Update stories in storage
            StorageService.setStories($scope.stories);

            // Hide the input dialog
            $scope.newTask.hidden = true;
        }
    };

    $scope.deleteTask = function(key) {
        console.log("Lösche Task " + key);
        for (var story in $scope.stories) {
            if($scope.stories[story].hasOwnProperty("tasks")) {
                var tasks = $scope.stories[story].tasks;
                for(var task in tasks) {
                    if(tasks[task].$$hashKey === key) {
                        tasks.splice(task, 1);
                        StorageService.setStories($scope.stories);
                    }
                }
            }
        }
    };
}

function createNewStory(story) {
    var story = {
        "name" : story.name,
        "priority" : story.priority,
        "time" : story.time
    };
    return story;
}

function createNewTask(task) {
    var task = {
        "title" : task.title,
        "description" : task.description,
        "estimate" : task.estimate,
        "status" : task.status,
        "time" : task.time
    }
    return task;
}

function addTaskToStory(story, task) {
    if(story.hasOwnProperty("tasks")) {
        story.tasks.push(task);
    } else {
        story.tasks = [task];
    }
    console.log(story);
}

function getStoryByHashKey(stories, key) {
    for (var story in stories) {
        if(stories[story].$$hashKey === key) {
            return stories[story];
        }
    }
}



var benchmark = (function() {
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