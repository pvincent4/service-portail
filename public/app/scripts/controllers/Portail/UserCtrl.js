'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailUserCtrl',
		 [ '$scope', 'currentUser', 'APP_PATH',
		   function( $scope, currentUser, APP_PATH ) {
		       $scope.prefix = APP_PATH;
		       $scope.annuler = function() {
			   console.debug( 'annuler les modifications')
		       };
		       $scope.enregistrer = function() {
			   $scope.current_user.$save();
			   console.debug($scope.current_user)
		       };

		       $scope.groups = [ { ouvert: true },
					 { ouvert: false },
					 { ouvert: false },
					 { ouvert: false } ];

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
		       });
		   } ] );
