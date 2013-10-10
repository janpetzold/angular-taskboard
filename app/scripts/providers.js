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