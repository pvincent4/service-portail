'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailUserCtrl',
		 [ '$scope', 'currentUser', 'APPLICATION_PREFIX',
		   function( $scope, currentUser, APPLICATION_PREFIX ) {
		       $scope.prefix = APPLICATION_PREFIX;
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
