/*
 * Controleur de la page publique
 */
'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailCtrl',
		 [ '$scope', '$sce', '$state', '$modal', 'current_user', 'APP_PATH', 'news',
		   function( $scope, $sce, $state, $modal, current_user, APP_PATH, news ) {
		       $scope.prefix = APP_PATH;
		       $scope.current_user = current_user;

		       $scope.go_home = function() {
			   $state.go( 'portail.logged' );
		       };

		       $scope.carousel_index = 0;

		       // TODO : faire une factory et un service pour les annonces.
		       // L'idée est d'aller lire le flux twitter @laclasse avec le hash #sys
		       $scope.annonce = ""; //"En moment sur Laclasse.com : La version 3 sort des cartons !";

		       if ( $scope.current_user.is_logged ) {
			   var retrieve_news = function() {
			       news.get().then( function( response ) {
				   $scope.newsfeed = _(response.data).map( function( item, index ) {
				       item.id = index;
				       item.trusted_description = $sce.trustAsHtml( item.description );

				       return item;
				   });
				   $scope.news_index = 0;
			       });
			   };

			   $scope.config_news_fluxes = function() {
			       $modal.open( {
				   templateUrl: 'views/popup_config_news_fluxes.html',
				   controller: 'PopupConfigNewsFluxesCtrl'
			       } )
				   .result.then( function() {
				       retrieve_news();
				   } );
			   };

			   retrieve_news();
		       }
		   } ] );
