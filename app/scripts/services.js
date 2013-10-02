var stories = angular.module('stories', []);

stories.provider('StorageService', function() {
    this.$get = function() {
        return {
            getStories: function() {
                return JSON.parse(window.localStorage.getItem("persistedData"));
            },
            setStories : function(data) {
                window.localStorage.setItem("persistedData", JSON.stringify(data));
            }
        }
    };
});




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