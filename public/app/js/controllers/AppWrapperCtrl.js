'use strict';

angular.module( 'portailApp' )
    .controller( 'AppWrapperCtrl',
		 [ '$scope', '$state', 'APP_PATH',
		   function ( $scope, $http, $stateParams, $sce, $state, currentUser, Apps, APP_PATH ) {
		       $scope.iOS = ( navigator.userAgent.match( /iPad/i ) !== null ) || ( navigator.userAgent.match( /iPhone/i ) !== null );
		       $scope.prefix = APP_PATH;

		       $scope.go_home = function() {
			   $state.go( 'portail.logged' );
		       };
		   }
		 ] );
