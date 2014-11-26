'use strict';

angular.module( 'portailApp' )
    .controller( 'PopupAjoutAppCtrl',
		 [ '$scope', '$modalInstance', 'APP_PATH', 'Apps',
		   function( $scope, $modalInstance, APP_PATH, Apps ) {
		       $scope.prefix = APP_PATH;
		       $scope.apps = Apps.query_default();
		       $scope.selected = { apps: null };

		       $scope.apps.push( { creation: true,
					   nom: '',
					   lien: '',
					   couleur: '' } );

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
