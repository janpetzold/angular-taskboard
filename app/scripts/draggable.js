/**
 * Created by jpetzold on 07.10.13.
 */
//var app = angular.module('stories', []);

app.directive("draggable", function() {
    return function(scope, element) {
        var el = element[0];

        el.draggable = true;

        el.addEventListener("dragstart", function(e) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("Text", this.id);

            console.log("Starting Drag");

            return false;
        },
        false);
    }
});