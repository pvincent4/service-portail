'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailUserCtrl',
		 [ '$scope', 'currentUser',
		   function( $scope, currentUser ) {
		       $scope.groups = [ { ouvert: true },
					 { ouvert: false },
					 { ouvert: false },
					 { ouvert: false } ];

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response.data;
			   console.debug($scope.current_user)
		       });
		   } ] );
