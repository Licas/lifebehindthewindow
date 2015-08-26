'use strict';

describe('Directive: myStopButton', function () {

  // load the directive's module
  beforeEach(module('lifebehindthewindowApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-stop-button></my-stop-button>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myStopButton directive');
  }));
});
