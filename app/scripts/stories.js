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
