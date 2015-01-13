'use strict';

angular.module( 'portailApp' )
    .controller( 'PopupConfigNewsFluxesCtrl',
		 [ '$scope', '$modalInstance', 'APP_PATH', 'current_fluxes',
		   function( $scope, $modalInstance, APP_PATH, current_fluxes ) {
		       $scope.prefix = APP_PATH;

		       $scope.ok = function () {
			   $modalInstance.close( _($scope.apps).findWhere( { selected: true } ) );
		       };

		       $scope.cancel = function () {
			   $modalInstance.dismiss();
		       };
		   } ] );
