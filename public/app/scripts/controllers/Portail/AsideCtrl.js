'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailAsideCtrl',
		 [ '$scope', 'currentUser', 'news', 'APPLICATION_PREFIX',
		   function( $scope, currentUser, news, APPLICATION_PREFIX ) {
		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
			   $scope.avatar = '';

			   if ( $scope.current_user.is_logged ) {
			       // $scope.current_user['avatar'] = null //FIXME: debug
			       // if ( $scope.current_user['avatar'] !== null ) {
			       //     ;
			       // } else
			       if ( $scope.current_user['extra']['sexe'] == 'F' ) {
				   $scope.avatar = '/app/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg';
			       } else {
				   $scope.avatar = '/app/bower_components/charte-graphique-laclasse-com/images/avatar_masculin.svg';
			       }
			   }

			   news.get().then( function( response ) {
			       $scope.newsfeed = response.data;
			   });
		       });
		   } ] );
