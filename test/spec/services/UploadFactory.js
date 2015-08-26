'use strict';

describe('Service: Uploadfactory', function () {

  // load the service's module
  beforeEach(module('lifebehindthewindowApp'));

  // instantiate service
  var Uploadfactory;
  beforeEach(inject(function (_Uploadfactory_) {
    Uploadfactory = _Uploadfactory_;
  }));

  it('should do something', function () {
    expect(!!Uploadfactory).toBe(true);
  });

});
