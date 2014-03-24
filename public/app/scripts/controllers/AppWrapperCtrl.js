'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'AppWrapperCtrl',
		 [ '$scope', '$http', '$stateParams', '$sce', 'currentUser', 'APPLICATION_PREFIX',
		   function( $scope, $http, $stateParams, $sce, currentUser, APPLICATION_PREFIX ) {
		       $scope.menu = [ { icone: 'logolaclasse.svg',
					 texte: 'retour au portail',
					 lien: '/portail' },
				       { icone: '12_aide.svg',
					 texte: 'aide',
					 lien: '/portail' },
				       { icone: '12_aide.svg',
					 texte: 'se déconnecter',
					 lien: '/logout' } ];

		       $http.get( APPLICATION_PREFIX + '/api/apps/' + $stateParams.app )
			   .success( function( response ) {
			       $scope.app = response;
			       // sans $sce.trustasresourceurl l'iframe ne marche pas
			       $scope.app.url = $sce.trustAsResourceUrl( $scope.app.url );
			   });

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response.data;
		       } );
		 } ] );
