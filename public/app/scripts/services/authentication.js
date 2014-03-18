'use strict';

angular.module( 'portailApp.services.authentication', [  ] );
angular.module( 'portailApp.services.authentication' )
    .service('currentUser',
	     [ '$http', 'APPLICATION_PREFIX',
	       function( $http, APPLICATION_PREFIX ) {
		   var user = null;
		   this.get = function() {
		       if ( user == null ) {
			   user = $http.get( APPLICATION_PREFIX + '/api/user' )
			       .success( function( response ) {
				   response.is_logged = response.user !== '';
				   return response;
			       } );
		       }

		       return user;
		   };
	       } ] );
