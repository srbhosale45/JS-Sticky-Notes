var noteApp = angular.module('noteApp', ['ui.router', 'ngStorage']);

(function() {

    'use Strict';
    noteApp.controller('homeController', function($scope, $localStorage) {

        if ($localStorage.note != null) {
            $scope.notes = $localStorage.note;
        } else {
            $scope.notes = [];
        }

        /*
         Save new note to localstorage
        */
        $scope.addNote = function() {
            var date = new Date();
            var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            var newDate = new Date(utc + (3600000 * (+5.5)));
            var noteObject = {
                title: "Untitled",
                content: "Contents Here!",
                timestamp: newDate.toLocaleString()
            }
            console.log("Add note called");
            $scope.notes.unshift(noteObject);
            saveNotesState();
            $scope.title = "";
            $scope.content = "";
            return false;
        }

        $scope.removeNote = function(delNote) {
            $scope.notes.splice($scope.notes.indexOf(delNote), 1);
            saveNotesState();
        }

        $scope.updateNote = function(updateNoteObj) {
            $scope.notes.indexOf(updateNoteObj).title = $scope.title;
            $scope.notes.indexOf(updateNoteObj).content = $scope.content;
            saveNotesState();
        }

        // Saving the notes to localstorage
        function saveNotesState() {
            $localStorage.note = $scope.notes;
            return false;
        }
    });
})();