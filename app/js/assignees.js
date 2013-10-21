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