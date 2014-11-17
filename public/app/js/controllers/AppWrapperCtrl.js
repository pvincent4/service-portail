'use strict';

angular.module( 'portailApp' )
    .controller( 'AppWrapperCtrl',
		 [ '$scope', '$http', '$stateParams', '$sce', 'currentUser', 'APP_PATH',
		   function ( $scope, $http, $stateParams, $sce, currentUser, APP_PATH ) {
		       $scope.iOS = ( navigator.userAgent.match( /iPad/i ) !== null ) || ( navigator.userAgent.match( /iPhone/i ) !== null );
		       $scope.prefix = APP_PATH;

		       currentUser.get().then( function ( response ) {
                       $scope.current_user = response;

                        switch ($stateParams.app) {
                            case "GAR":
                                // Les ressources numériques de l'utilisateur
                                currentUser.ressources().then( function ( response ) {
                                     $scope.ressources_numeriques = response;
                                 } );
                                break;
                            case "TROMBI":
                                // Application Trombinoscope
                                currentUser.mes_regroupements().then( function ( response ) {
                                     $scope.mes_regroupements = response;
                                 } );
                                break;
                            default:
                        }

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
