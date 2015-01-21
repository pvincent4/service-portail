'use strict';

angular.module( 'portailApp' )
    .controller( 'AppWrapperCtrl',
		 [ '$scope', '$http', '$stateParams', '$sce', '$state', 'currentUser', 'Apps', 'APP_PATH',
		   function ( $scope, $http, $stateParams, $sce, $state, currentUser, Apps, APP_PATH ) {
		       $scope.iOS = ( navigator.userAgent.match( /iPad/i ) !== null ) || ( navigator.userAgent.match( /iPhone/i ) !== null );
		       $scope.prefix = APP_PATH;

		       $scope.go_home = function() {
			   $state.go( 'portail.logged' );
		       };

		       currentUser.get().then( function ( response ) {
			   $scope.current_user = response;

			   // Les applications de l'utilisateur
			   Apps.query()
			       .$promise.then( function ( response ) {
				   // Toutes les applications en iframe
				   var app = _( response ).findWhere( { application_id: $stateParams.app } );

				   if ( _(app).isUndefined() ) {
				       app = _(response).findWhere( { libelle: $stateParams.app } );

				       // App still undefined => app is not visible from this profil => redirect to portail
				       if ( _(app).isUndefined() ) {
					   $state.go( '/' );
				       }
				   }

				   $scope.app = { nom: app.nom,
						  url: $sce.trustAsResourceUrl( app.url ) };
			       } );
		       } );
		   }
		 ] );
