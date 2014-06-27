'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailAppsDamierCtrl',
		 [ '$scope', 'currentUser', 'news', 'APP_PATH',
		   function( $scope, currentUser, news, APP_PATH ) {
                       $scope.prefix = APP_PATH;
		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
			   if ( $scope.current_user.is_logged ) {
			       currentUser.apps().then( function( response ) {
				   $scope.apps = response;
			       });
			   }
		       });
		   } ] );
