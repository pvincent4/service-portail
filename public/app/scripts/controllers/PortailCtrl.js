'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailCtrl',
		 [ '$scope', 'currentUser',
		   function( $scope, currentUser ) {
		       // {{{ damier
		       var nb_cases = 20;

		       $scope.couleurs = [ 'rouge',
					   'orange',
					   'jaune',
					   'vert',
					   'bleu',
					   'indigo',
					   'violet' ];
		       $scope.randCouleur = function(  ) {
			   return $scope.couleurs[ _.random( 0, $scope.couleurs.length - 1 ) ];
		       };

		       currentUser.get().then( function( response ) {
			   $scope.currentUser = response.data;

			   $scope.apps = [];

			   if ( $scope.currentUser.is_logged ) {
			       // FIXME: utiliser de vrais données
			       $scope.apps = [
				   { icone: '📓',
				     couleur: $scope.randCouleur(),
				     nom: 'Cahier de textes',
				     lien: '/portail/#/show-app',
				     notifications: [ { dummy: 'value' },
						      { dummy: 'value' },
						      { dummy: 'value' },
						      { dummy: 'value' }
						    ] },
				   { icone: '☕',
				     couleur: $scope.randCouleur(),
				     nom: 'Café',
				     lien: '/café',
				     notifications: [ { dummy: 'value' }
						    ] },
				   { icone: '🎵',
				     couleur: $scope.randCouleur(),
				     nom: 'Musique',
				     lien: '/musique',
				     notifications: [  ] }
			       ];
			   }

			   // ajout cases vides
			   _(nb_cases - $scope.apps.length).times( function() {
			       $scope.apps.push( { icone: '',
						   couleur: $scope.randCouleur(),
						   nom: '',
						   lien: '',
						   notifications: [  ] } );
			   });

			   // randomize
			   $scope.apps = _($scope.apps).shuffle();
			   // }}}

			   // {{{ aside
			   // }}}
		       });

		   } ] );
