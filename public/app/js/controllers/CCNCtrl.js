'use strict';

angular.module( 'portailApp' )
    .controller( 'CCNCtrl',
		 [ '$scope', 'APP_PATH',
		   function( $scope, APP_PATH ) {
		       $scope.prefix = APP_PATH;
		   }
		 ]
	       );
