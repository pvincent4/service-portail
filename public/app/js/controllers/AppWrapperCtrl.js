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
				   if ($stateParams.static) {
				       // Pour la navigation inter pages-statiques (d'une page statique à une autres,
				       // on définit que l'on va vers une page statique afin de l'intégrer correctement et sans ifram dans
				       // le template d'affichage.
				       $scope.app = { nom: '',
						      url: $sce.trustAsResourceUrl( APP_PATH + '/pages/' + $stateParams.static ),
						      static: true };
				   } else {
				       // Toutes les applications en iframe et les pages statiques
				       var app = _( response ).findWhere( { application_id: $stateParams.app } );

				       if ( _(app).isUndefined() ) {
					   app = _(response).findWhere( { libelle: $stateParams.app } );

					   // App still undefined => app is not visible from this profil => redirect to portail
					   if ( _(app).isUndefined() ) {
					       $state.go( '/' );
					   }
				       }

				       $scope.app = { nom: app.nom,
						      url: $sce.trustAsResourceUrl( app.url ),
						      // Si l'application contient */pages/* dans son url
						      // elle est statique, on lui ajoute le paramètre 'static=true'
						      // pour qu'elle soit intégrée dans le template de rendu comme une page statique.
						      static: app.url.match( /\/pages\// ) !== null };
				   }
			       } );
		       } );
		   }
		 ] );
