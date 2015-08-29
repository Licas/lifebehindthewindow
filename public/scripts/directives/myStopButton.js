'use strict';

angular.module('lifebehindthewindowApp')
  .directive('myStopButton', function () {
    return {
		restrict: "E",
        require: "^videogular",
        template: "<div class='iconButton' ng-click='API.stop()'>STOP</div>",
        link: function postLink(scope, element, attrs) {
        	element.text('this is the myStopButton directive');
      	}
    };
  });