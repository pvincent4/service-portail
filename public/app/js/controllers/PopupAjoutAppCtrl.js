'use strict';

angular.module( 'portailApp' )
    .controller( 'PopupAjoutAppCtrl',
		 [ '$scope', '$modalInstance', 'APP_PATH', 'apps',
		   function( $scope, $modalInstance, APP_PATH, apps ) {
		       $scope.prefix = APP_PATH;
		       $scope.apps = apps;
		       $scope.selected = { apps: null };

		       $scope.selected = function( app ) {
			   _($scope.apps).each( function( app ) {
			       app.selected = false;
			   } );
			   app.selected = true;
		       };

		       $scope.ok = function () {
			   $modalInstance.close( _($scope.apps).findWhere( { selected: true } ) );
		       };

		       $scope.cancel = function () {
			   $modalInstance.dismiss();
		       };
		   } ] );
