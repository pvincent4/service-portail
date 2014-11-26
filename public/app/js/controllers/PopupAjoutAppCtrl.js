'use strict';

angular.module( 'portailApp' )
    .controller( 'PopupAjoutAppCtrl',
		 [ '$scope', '$modalInstance', 'APP_PATH', 'Apps', 'current_apps',
		   function( $scope, $modalInstance, APP_PATH, Apps, current_apps ) {
		       $scope.prefix = APP_PATH;
		       Apps.query_default().$promise
			   .then( function( response ) {
			       $scope.apps = response;
			       _($scope.apps).each( function( app ) {
				   app.present = _(current_apps).contains( app.id );
			       } );

			       $scope.apps.push( new Apps( { creation: true,
							     present: false,
							     type: 'EXTERNAL',
							     libelle: '',
							     description: '',
							     url: '',
							     color: '',
							     active: true } ) );
			   });
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
