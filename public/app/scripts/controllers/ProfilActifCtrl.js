'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'ProfilActifCtrl',
		 [ '$scope', 'currentUser',
		   function( $scope, currentUser ) {
		       $scope.reload = function() {
			   console.debug($scope.current_user['profil_actif'])
		       };

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
		       });
		   } ] );
