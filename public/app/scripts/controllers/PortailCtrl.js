/*
 * Controleur de la page publique
 */
'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailCtrl',
		 [ '$scope', 'currentUser', 'APP_PATH',
		   function( $scope, currentUser, APP_PATH ) {
		       $scope.prefix = APP_PATH;
		       // TODO : faire une factory et un service pour les annonces.
		       // L'idée est d'aller lire le flux twitter @laclasse avec le hash #sys
		       $scope.annonce = ""; //"En moment sur Laclasse.com : La version 3 sort des cartons !";
		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
		       });
		   } ] );
