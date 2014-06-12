'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailAsideCtrl',
		 [ '$scope', '$sce', 'currentUser', 'news', 'APPLICATION_PREFIX',
		   function( $scope, $sce, currentUser, news, APPLICATION_PREFIX ) {
		       currentUser.get().then( function( response ) {
                           $scope.prefix = APPLICATION_PREFIX;
			   $scope.current_user = response;
			   $scope.avatar = '';

			   if ( $scope.current_user.is_logged ) {
			        if ( $scope.current_user['avatar'] !== null ) {
			            $scope.avatar = $scope.current_user['avatar'];
			        } else
			       if ( $scope.current_user['sexe'] == 'F' ) {
				   $scope.avatar = APPLICATION_PREFIX + '/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg';
			       } else {
				   $scope.avatar = APPLICATION_PREFIX + '/bower_components/charte-graphique-laclasse-com/images/avatar_masculin.svg';
			       }
			   }

			   news.get().then( function( response ) {
			       $scope.newsfeed = _(response.data).map( function( item ) {
				   item.trusted_description = $sce.trustAsHtml( item.description );
				   return item;
			       });
			   });
		       });
		   } ] );
