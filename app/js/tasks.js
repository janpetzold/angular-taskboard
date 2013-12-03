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
    "storyName" : '',
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