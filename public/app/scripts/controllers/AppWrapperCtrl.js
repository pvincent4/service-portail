'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'AppWrapperCtrl',
		 [ '$scope', '$http', '$stateParams', '$sce', 'currentUser', 'APP_PATH',
		   function ( $scope, $http, $stateParams, $sce, currentUser, APP_PATH ) {
		       $scope.iOS = ( navigator.userAgent.match( /iPad/i ) !== null ) || ( navigator.userAgent.match( /iPhone/i ) !== null );
		       $scope.prefix = APP_PATH;
		       $scope.menu = [ { icone: 'logolaclasse.svg',
					 texte: 'retour au portail',
					 lien: APP_PATH + '/' },
				       { icone: '12_aide.svg',
					 texte: 'aide',
					 app: 'aide' },
				       { icone: '12_aide.svg',
					 texte: 'se déconnecter',
					 lien: '/logout' } ];

		       currentUser.get().then( function ( response ) {
			   $scope.current_user = response;                                                  
                           // Les ressources numériques de l'utilisateur
                           currentUser.ressources().then( function ( response ) {
                               $scope.ressources_numeriques = response;
                           } );
                           
			   // Les applications de l'utilisateur
                           currentUser.apps().then( function ( response ) {
                               // Intégrer les pages statiques
                               if ($stateParams.static) {
			       $scope.app = { nom: '',
					      url: $sce.trustAsResourceUrl( APP_PATH + '/pages/' + $stateParams.static ),
                                              static: true };
                               } else {
                               // intégrer les applications dynamiques
			       var app = _( response ).findWhere( { id: $stateParams.app } );
			       $scope.app = { nom: app.nom,
					      url: $sce.trustAsResourceUrl( app.url ),
                                              static: app.url.match( /\/pages\// ) !== null };
                                      }
                           } );
		       } );
		   }
		 ] );
