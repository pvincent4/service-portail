'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'ProfilActifCtrl',
		 [ '$scope', 'currentUser',
		   function( $scope, currentUser ) {
		       $scope.reload = function() {
			   $scope.current_user.$change_profil_actif( { profil_id: $scope.current_user.profils[ $scope.current_user.profil_actif ].profil_id,
								       uai: $scope.current_user.profils[ $scope.current_user.profil_actif ].uai } );
		       };

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
		       });
		   } ] );
