'use strict';

describe('Service: constant', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var constant;
  beforeEach(inject(function (_constant_) {
    constant = _constant_;
  }));

  it('should do something', function () {
    expect(!!constant).toBe(true);
  });

});
