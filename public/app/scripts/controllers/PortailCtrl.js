'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailCtrl',
		 [ '$scope', 'currentUser', 'APPLICATION_PREFIX',
		   function( $scope, currentUser, APPLICATION_PREFIX ) {
		       // {{{ damier
		       var nb_cases = 20;

		       $scope.racine_images = '/app/bower_components/charte-graphique-laclasse-com/images/';
		       $scope.couleurs = [ 'bleu',
					   'vert',
					   'rouge',
					   'violet',
					   'orange',
					   'jaune',
					   'gris1',
					   'gris2',
					   'gris3',
					   'gris4' ];
		       $scope.apps_definitions = {
			   'cahierdetextes': {icone: $scope.racine_images + '03_cahierdetextes.svg',
					      couleur: 'violet',
					      nom: 'Cahier de textes',
					      lien: '/portail/#/show-app'}
		       };
		       $scope.randCouleur = function(  ) {
			   return $scope.couleurs[ _.random( 0, $scope.couleurs.length - 1 ) ];
		       };

		       currentUser.get().then( function( response ) {
			   $scope.currentUser = response.data;

			   $scope.apps = [];

			   if ( $scope.currentUser.is_logged ) {
			       // FIXME: utiliser de vraies données
			       $scope.apps = [
				   { id: 'cahierdetextes',
				     notifications: [ { dummy: 'value' },
						      { dummy: 'value' },
						      { dummy: 'value' },
						      { dummy: 'value' }
						    ] }
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
