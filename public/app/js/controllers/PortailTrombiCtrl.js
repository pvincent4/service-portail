'use strict';
'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailTrombiCtrl',
		 [ '$scope', '$state', 'currentUser', 'RegroupementDetail',
		   function( $scope, $state, currentUser, RegroupementDetail) {
		       currentUser.regroupements().then( function ( response ) {
			   $scope.mes_regroupements = response;

			   $scope.showElevesRegroupement = function( regtId ){
			       $scope.eleves = RegroupementDetail.query( { id: regtId } );
			   };

			   $scope.retour = function() {
			       $scope.eleves = undefined;
			   };
		       });
		   }
		 ]
	       )
;
