/* 
 * Service de notification du portail
 */
'use strict';

angular.module( 'portailApp.services.notifications', [  ] );
angular.module( 'portailApp.services.notifications' )
    .service('notifications',
	     [ '$http', 'APP_PATH',
	       function( $http, APP_PATH ) {
		   this.get = _.memoize( function() {
		       return $http.get( APP_PATH + '/api/notifications' );
		   });
	       } ] );
