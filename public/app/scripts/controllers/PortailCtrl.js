'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailCtrl',
		 [ '$scope',
		   function( $scope ) {
		       // Returns a random number between min and max
		       var randInt = function( min, max ) {
			   return Math.floor( Math.random(  ) * ( max - min ) + min );
		       };
		       $scope.couleurs = [ 'red',
					   'blue',
					   'yellow' ];
		       $scope.apps = [
			   { icone: '📓',
			     couleur: $scope.couleurs[ randInt( 0, $scope.couleurs.length ) ],
			     nom: 'Cahier de textes',
			     lien: '/portail/#/show-app',
			     notifications: [ { dummy: 'value' },
					      { dummy: 'value' },
					      { dummy: 'value' },
					      { dummy: 'value' }
					    ] },
			   { icone: '☕',
			     couleur: $scope.couleurs[ randInt( 0, $scope.couleurs.length ) ],
			     nom: 'Café',
			     lien: '/café',
			     notifications: [ { dummy: 'value' }
					    ] },
			   { icone: '🎵',
			     couleur: $scope.couleurs[ randInt( 0, $scope.couleurs.length ) ],
			     nom: 'Musique',
			     lien: '/musique',
			     notifications: [  ] }
		       ];
		 } ] );
