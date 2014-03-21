'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'AppWrapperCtrl',
		 [ '$scope',
		   function( $scope ) {
		       $scope.menu = [ { icone: '12_aide.svg',
					 texte: 'retour au portail',
					 lien: '/portail' },
				       { icone: '12_aide.svg',
					 texte: 'aide',
					 lien: '/portail' },
				       { icone: '12_aide.svg',
					 texte: 'se déconnecter',
					 lien: '/logout' } ];
		 } ] );
