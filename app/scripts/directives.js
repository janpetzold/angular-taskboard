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
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("Text", this.id);

            // Update height of other taskTargets depending on the current height
            $(".taskTarget").height($(el).height() + 20);

            // Update top position of other taskTargets depending on the current top
            $(".taskTarget").css("top", $(el).position().top - 2);

            // Show targets depending on state
            scope.$apply('handleDragFromState(' + scope.task.status + ')');

            return false;
        }, false);

        el.addEventListener("dragend", function(e) {
            scope.$apply('handleResetDragState()');
            scope.$apply('changeTaskState(' + scope.$parent.story.id + ',' + scope.$index + ',' + app.helpers.getStatusFromOffset(e.x) + ')');

            return false;
        }, false);
    }
});

/**
 * Angular directive for the drop zone.
 * TODO: Doesn't work in Firefox yet.
 */
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