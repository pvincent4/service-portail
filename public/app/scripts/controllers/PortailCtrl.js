/*
 * Controleur de la page publique
 */
'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailCtrl',
		 [ '$scope', '$sce', 'currentUser', 'APP_PATH', 'news',
		   function( $scope, $sce, currentUser, APP_PATH, news ) {
		       $scope.prefix = APP_PATH;
		       // TODO : faire une factory et un service pour les annonces.
		       // L'idée est d'aller lire le flux twitter @laclasse avec le hash #sys
		       $scope.annonce = ""; //"En moment sur Laclasse.com : La version 3 sort des cartons !";
		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;

			   if ( $scope.current_user.is_logged ) {
			       if ( $scope.current_user['avatar'] !== null ) {
				   $scope.avatar = $scope.current_user['avatar'];
			       } else {
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
			   }
		       });
		   } ] );
