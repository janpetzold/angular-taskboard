/**
 * Created by jpetzold on 04.10.13.
 */

function init() {
    $(".dropzone").on("dragover", function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.originalEvent.dataTransfer.dropEffect = 'copy';
        return false;
    });

    $(".dropzone").on("drop", function(e) {
        if(e.stopPropagation()) {
            e.stopPropagation();
        }
        console.log("Dropped at position " + e.originalEvent.clientX);
        return false;
    });

    $(".item").on("dragstart", function(e) {
        console.log("Beginne Dragging - Breite: " + e.target.clientWidth + " Höhe: " + e.target.clientHeight + " Abstand oben: " + e.target.offsetTop);
        e.originalEvent.dataTransfer.effectAllowed = 'copy';
        e.originalEvent.dataTransfer.setData('text/plain', 'foo');

        console.log(e);

        // Display target rectangles
    });

    /*
    $(".item").on("dragend", function(e) {
        console.log(e);
        console.log("Dragging beendet");
    });
    */
}

$(document).ready(init);


