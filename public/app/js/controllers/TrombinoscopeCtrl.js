'use strict';

angular.module( 'portailApp' )
    .controller( 'TrombinoscopeCtrl',
		 [ '$scope', '$state', 'currentUser', 'COULEURS',
		   function( $scope, $state, currentUser, COULEURS ) {
		       var randomize_colors = function( ary, couleurs ) {
			   _(ary).each( function( item ) {
			       item.color = couleurs[ _.random( 0, couleurs.length - 1 ) ];
			   } );
		       };

		       $scope.filters = {
			   regroupements_types: { classes: true,
						  groupes_eleves: false },
			   text: { regroupement: '',
				   user: '' },
			   order_asc: true
		       };

		       currentUser.regroupements().then( function ( response ) {
			   $scope.regroupements = response;
			   randomize_colors( $scope.regroupements, COULEURS );

			   $scope.showElevesRegroupement = function( regroupement ) {
			       $scope.regroupement = regroupement;
			       currentUser.eleves_regroupement( regroupement.id )
				   .then( function( response ) {
				       $scope.eleves = response;
				       randomize_colors( $scope.eleves, COULEURS );
				   } );
			   };

			   $scope.retour = function() {
			       $scope.eleves = undefined;
			       $scope.regroupement = undefined;
			   };
		       });
		   }
		 ]
	       );
