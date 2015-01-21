'use strict';

angular.module( 'portailApp' )
    .controller( 'IframeCtrl',
		 [ '$scope', '$stateParams', '$sce', '$state', 'currentUser', 'Apps',
		   function ( $scope, $stateParams, $sce, $state, currentUser, Apps ) {
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
					   $state.go( 'portail.logged' );
				       }
				   }

				   $scope.app = { nom: app.nom,
						  url: $sce.trustAsResourceUrl( app.url ) };
			       } );
		       } );
		   }
		 ] );
