/**
 * This is the initial loading script for the application with the core variable <code>app</code>.
 *
 * @author Jan Petzold
 */

var app = angular.module('stories', []);
app.layout = {};

/**
 * Auto-fit all text areas to adjust height based on the text inside them
 */
app.layout.autoFitTextArea = function() {
    $(".item textarea").each(function() {
        $(this).css("overflow", "hidden");
        app.layout.adjustTextAreaHeight(this);
    });
};

app.layout.adjustTextAreaHeight = function(element) {
    $(element).height(24);
    $(element).height($(element).prop("scrollHeight") + 12);
};

/**
 * Execute this after DOM load
 */
$(document).ready(app.layout.autoFitTextArea);