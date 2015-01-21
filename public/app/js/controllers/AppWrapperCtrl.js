'use strict';

angular.module( 'portailApp' )
    .controller( 'AppWrapperCtrl',
		 [ '$scope', '$state', 'APP_PATH', 'current_user',
		   function ( $scope, $state, APP_PATH, current_user ) {
		       $scope.iOS = ( navigator.userAgent.match( /iPad/i ) !== null ) || ( navigator.userAgent.match( /iPhone/i ) !== null );
		       $scope.prefix = APP_PATH;
		       $scope.current_user = current_user;

		       $scope.go_home = function() {
			   $state.go( 'portail.logged' );
		       };
		   }
		 ] );
