'use strict';

angular.module( 'portailApp' )
    .controller( 'RessourcesNumeriquesCtrl',
		 [ '$scope', 'currentUser', 'APP_PATH',
		   function( $scope, currentUser, APP_PATH ) {
		       $scope.prefix = APP_PATH;

		       currentUser.ressources().then( function ( response ) {
			   $scope.ressources_numeriques = response;
		       } );
		   }
		 ]
	       );
