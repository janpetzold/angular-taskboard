angular-taskboard
=================

This is a very basic taskboard single page app implemented mainly with AngularJS. It is nothing more than a prototype but works quite nice. The taskboard contains stories that group different tasks which can have a description, assignee and estimated duration. The taskboard can be filtered by each assignee and sorted by the story priority or creation time. It is pretty similar to [Trello](https://trello.com/) or the [JIRA Agile plugin](https://www.atlassian.com/software/jira-agile/overview), but very limited compared to them regarding features.

You can run it by accessing ....

The client-side dependencies ara managed via [Bower](http://bower.io/). Unit- and End-to-end-tests were implemented in [Jasmine](http://pivotal.github.io/jasmine/) and are executed by [Karma](http://karma-runner.github.io). The unit tests take advantage of [PhantomJS](http://phantomjs.org/), while the end-to-end tests are run in [Chrome](http://phantomjs.org/) but could be executed in any browser.

The [Gradle](http://www.gradle.org) build is itself concatenates and minifies the JavaScript and executes all tests. It also creates a [JSHint](http://www.jshint.com/) output file and performs a code-coverage check based on the unit tests via [Istanbul](http://gotwarlost.github.io/istanbul/).

The application runs entirely offline, so no requests to the "outside" are performed at runtime.

The following HTML5 features are used in the implementation:

* [localStorage](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage#localStorage) for persistence
* [AppCache](https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache) for caching most of the resource locally
* [Drag'n'Drop](https://developer.mozilla.org/en-US/docs/DragDrop/Drag_Operations) for task status updates

The layout is fluid and will automatically adjust to the available screen width / height.

I tested the application in Chrome and Firefox.

Some thing I might add in the future:

* allow closing of dialogs for new story / task
* IE compatibility
* type ahead for task assignee
* automatically delete assignee when he/she no longer has any open tasks