'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailUserCtrl',
		 [ '$scope', '$state', 'currentUser', 'APP_PATH',
		   function( $scope, $state, currentUser, APP_PATH ) {
		       $scope.prefix = APP_PATH;
		       $scope.groups = [ { ouvert: true },
					 { ouvert: false },
					 { ouvert: false },
					 { ouvert: false } ];

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
			   $scope.current_user.date_naissance = _($scope.current_user).has('date_naissance') ? new Date( $scope.current_user.date_naissance ) : new Date();

			   $scope.enregistrer = function() {
			       $scope.current_user.$update( {} )
				   .then( function() {
				       $state.go( 'portail.logged' );
				   } );
			   };

			   $scope.annuler = function() {
			       $state.go( 'portail.logged' );
			   };
		       });
		   } ] );
