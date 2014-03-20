'use strict';

angular.module( 'portailApp.services.news', [  ] );
angular.module( 'portailApp.services.news' )
    .service('news',
	     [ '$http', 'APPLICATION_PREFIX',
	       function( $http, APPLICATION_PREFIX ) {
		   this.get = _.memoize( function() {
		       return $http.get( APPLICATION_PREFIX + '/api/news' );
		   });
	       } ] );
