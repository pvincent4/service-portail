'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailAppsDamierCtrl',
		 [ '$scope', 'currentUser', 'news', 'APPLICATION_PREFIX',
		   function( $scope, currentUser, news, APPLICATION_PREFIX ) {
                       $scope.prefix = APPLICATION_PREFIX;
		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
			   if ( $scope.current_user.is_logged ) {
			       currentUser.apps().then( function( response ) {
				   $scope.apps = response;
			       });
			   }
		       });
		   } ] );
