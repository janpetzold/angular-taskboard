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

app.helpers.test = function() {
    return true;
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
