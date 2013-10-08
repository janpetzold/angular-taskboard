var app = angular.module('stories', []);

app.provider('StorageService', function() {
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

app.directive('draggable', function() {
    return function(scope, element) {
        var el = element[0];

        el.draggable = true;

        el.addEventListener("dragstart", function(e) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("Text", this.id);

            // Update height of other taskTargets depending on the current height
            $(".taskTarget").height($(el).height() + 20);

            // Update top position of other taskTargets depending on the current top
            $(".taskTarget").css("top", $(el).position().top - 3);

            // Show targets depending on state
            if(scope.task.status === 0) {
                scope.$apply('handleDragStateFromToDo()');
            } else if (scope.task.status === 1) {
                scope.$apply('handleDragStateFromProgress()');
            } else if (scope.task.status === 2) {
                scope.$apply('handleDragStateFromResolved()');
            }

            return false;
        }, false);

        el.addEventListener("dragend", function(e) {
            scope.$apply('handleResetDragState()');

            scope.$apply('changeStateForTask("' + scope.task.$$hashKey + '",' + getStatusFromOffset(e.x) + ')');

            return false;
        }, false);
    }
});

app.directive('droppable', function() {
    return function(scope, element) {
        var el = element[0];

        el.addEventListener("dragover", function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.dataTransfer.dropEffect = 'move';
                return false;
            },
            false
        );

        el.addEventListener("drop", function(e) {
                if (e.stopPropagation()) {
                    e.stopPropagation();
                }
                return false;
            },
            false
        );
    }
});

function getStatusFromOffset(offset) {
    // Get the cutrrent screen dimension
    var max = parseInt($("body").width(), 10);
    var interval = max / 4;

    if(offset >= interval && offset <= (interval * 2)) {
        return 1;
    } else if (offset >= (interval * 2) && offset <= (interval * 3)) {
        return 2;
    } else if (offset >= (interval * 3)) {
        return 3;
    } else {
        return 0;
    }
}




// This is not needed anymore - just here as reference
//var testData = [
//    {
//        "name": "TB-001",
//        "priority": 5,
//        "time": new Date().getTime(),
//        "tasks": [
//            {
//                "title" : "Bug fixen",
//                "description" : "Alles ist kaputt",
//                "estimate": 3
//            },
//            {
//                "title" : "Schuhe putzen",
//                "description" : "Blitzeblank, bitteschön",
//                "estimate": 22
//            }
//        ]
//    },
//    {
//        "name": "TB-002",
//        "priority": 3,
//        "time" : new Date().getTime(),
//        "tasks": [
//            {
//                "title" : "Spielzeug wegräumen",
//                "description" : "So ein Saustall",
//                "estimate": 2
//            }
//        ]
//    }
//];