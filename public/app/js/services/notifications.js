/*
 * Service de notification du portail
 */
'use strict';

angular.module( 'portailApp' )
    .service('notifications',
	     [ '$http', 'APP_PATH',
	       function( $http, APP_PATH ) {
		   this.get = _.memoize( function() {
		       return $http.get( APP_PATH + '/api/notifications' );
		   });
	       } ] );
