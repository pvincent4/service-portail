'use strict';

angular.module( 'portailApp' )
    .controller( 'ProfilActifCtrl',
		 [ '$scope', '$state', '$stateParams', 'currentUser',
		   function( $scope, $state, $stateParams, currentUser ) {
		       $scope.reload = function() {
			   $scope.current_user.$change_profil_actif( { profil_id: $scope.current_user.profil_actif.profil_id,
								       uai: $scope.current_user.profil_actif.etablissement_code_uai } )
			       .then( function() {
				   $state.transitionTo( $state.current, $stateParams, { reload: true, inherit: true, notify: true } );
			       });
		       };

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
		       });
		   } ] );
