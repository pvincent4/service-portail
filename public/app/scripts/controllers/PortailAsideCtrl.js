'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailAsideCtrl',
		 [ '$scope', 'currentUser', 'news', 'APPLICATION_PREFIX',
		   function( $scope, currentUser, news, APPLICATION_PREFIX ) {
		       currentUser.get().then( function( response ) {
			   $scope.current_user = response.data;

			   news.get().then( function( response ) {
			       $scope.newsfeed = response.data;
			   });
		       });
		   } ] );
