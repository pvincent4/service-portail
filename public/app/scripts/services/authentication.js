'use strict';

angular.module( 'portailApp.services.authentication', [  ] );

angular.module('portailApp.services.authentication')
    .factory('User', [ '$resource', 'APPLICATION_PREFIX',
		       function( $resource, APPLICATION_PREFIX ) {
			   return $resource( APPLICATION_PREFIX + '/api/user' );
		       } ] );

angular.module( 'portailApp.services.authentication' )
    .service('currentUser',
	     [ '$http', 'User',
	       function( $http, User ) {
		   var user = null;
		   this.get = function() {
		       if ( user == null ) {
			   user = User.get().$promise;
		       }
		       return user;
		   };
	       } ] );
