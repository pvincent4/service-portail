'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailAsideCtrl',
		 [ '$scope', '$sce', 'currentUser', 'news', 'APP_PATH',
		   function( $scope, $sce, currentUser, news, APP_PATH ) {
		       currentUser.get().then( function( response ) {
                           $scope.prefix = APP_PATH;
			   $scope.current_user = response;
			   $scope.avatar = '';

			   if ( $scope.current_user.is_logged ) {
			        if ( $scope.current_user['avatar'] !== null ) {
			            $scope.avatar = $scope.current_user['avatar'];
			        } else
			       if ( $scope.current_user['sexe'] == 'F' ) {
				   $scope.avatar = APP_PATH + '/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg';
			       } else {
				   $scope.avatar = APP_PATH + '/bower_components/charte-graphique-laclasse-com/images/avatar_masculin.svg';
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
