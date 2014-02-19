'use strict';

describe('Service: ServicesAuthentication', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var ServicesAuthentication;
  beforeEach(inject(function (_ServicesAuthentication_) {
    ServicesAuthentication = _ServicesAuthentication_;
  }));

  it('should do something', function () {
    expect(!!ServicesAuthentication).toBe(true);
  });

});
