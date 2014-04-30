require(["config"], function() {
    require(["angular", "weighttracker"], function(angular, weighttracker) {

        "use strict"

        var weighttrackerApp = angular.module('WeightTrackerApp', ['ngroute']);

        console.log("DERP");

        weighttrackerApp.controller('WeightTrackerCtrl', function ($scope) {
            console.log("DERP");
            $scope.weighttracker = weighttracker;
        });

    });
});