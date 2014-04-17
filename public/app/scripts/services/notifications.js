/* 
 * Service de notification du portail
 */
'use strict';

angular.module( 'portailApp.services.notifications', [  ] );
angular.module( 'portailApp.services.notifications' )
    .service('notifications',
	     [ '$http', 'APPLICATION_PREFIX',
	       function( $http, APPLICATION_PREFIX ) {
		   this.get = _.memoize( function() {
		       return $http.get( APPLICATION_PREFIX + '/api/notifications' );
		   });
	       } ] );
