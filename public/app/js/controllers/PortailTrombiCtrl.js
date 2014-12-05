'use strict';
'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailTrombiCtrl',
		 [ '$scope', '$state', 'currentUser', 'APP_PATH', 'RegroupementDetail',
		   function( $scope, $state, currentUser, APP_PATH ,RegroupementDetail) {
		       
		       currentUser.regroupements().then( function ( response ) {
			   			$scope.mes_regroupements = response;

			   			$scope.showElevesRegroupement = function(regtId){
			   				$scope.eleves = RegroupementDetail.query({id: regtId});
			   			}

			   			$scope.retour = function() {
			   				$scope.eleves	= undefined;
			   			}
		       });
				}
			]
		)
;
