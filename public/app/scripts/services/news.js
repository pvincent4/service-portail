'use strict';

angular.module( 'portailApp.services.news', [  ] );
angular.module( 'portailApp.services.news' )
    .service('news',
	     [ '$http', 'APP_PATH',
	       function( $http, APP_PATH ) {
		   this.get = function() { return $http.get( APP_PATH + '/api/news' ); };
	       } ] );
