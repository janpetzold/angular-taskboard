/**
 * Created by jpetzold on 07.10.13.
 */

var app = angular.module('stories', []);

app.directive("droppable", function() {
    return {
        scope: {
            drop: "&" // Parent scope
        },
        link: function(scope, element) {
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

            el.addEventListener("dragenter", function(e) {
                    return false;
                },
                false
            );

            el.addEventListener("dragleave", function(e) {
                    return false;
                },
                false
            );

            el.addEventListener("drop", function(e) {
                    if (e.stopPropagation()) {
                        e.stopPropagation();
                    }

                    console.log(e);
                    //console.log("Dropped at position " + e.clientX);

                    // call the drop passed drop method
                    scope.$apply("drop()");

                    return false;
                },
                false
            );
        }
    }
});
