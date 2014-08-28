'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'ProfilActifCtrl',
		 [ '$scope', '$state', '$stateParams', 'currentUser',
		   function( $scope, $state, $stateParams, currentUser ) {
		       $scope.reload = function() {
			   $scope.current_user.$change_profil_actif( { profil_id: $scope.current_user.profil_actif[0].profil_id,
								       uai: $scope.current_user.profil_actif[0].uai } )
			       .then( function() {
				   $state.reload();
			       });
		       };

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
		       });
		   } ] );
