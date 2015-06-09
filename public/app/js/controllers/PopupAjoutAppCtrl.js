'use strict';

angular.module( 'portailApp' )
    .controller( 'PopupAjoutAppCtrl',
		 [ '$scope', '$modalInstance', 'APP_PATH', 'Apps', 'current_apps',
		   function( $scope, $modalInstance, APP_PATH, Apps, current_apps ) {
		       $scope.prefix = APP_PATH;
		       Apps.query_default().$promise
			   .then( function( response ) {
			       $scope.apps = _(response).reject( function( app ) {
				   return app.application_id == 'PORTAIL' || app.application_id == 'ANNUAIRE';
			       } );

			       _($scope.apps).each( function( app ) {
				   app.available = function() {
				       return !_.chain(current_apps)
					   .reject( function( a ) {
					       return a.to_delete;
					   } )
					   .pluck( 'application_id' )
					   .contains( app.application_id )
					   .value();
				   };
			       } );
			       $scope.apps.push( new Apps( { creation: true,
							     present: false,
							     type: 'EXTERNAL',
							     libelle: '',
							     description: '',
							     url: 'http://',
							     color: '',
							     active: true } ) );
			   } );
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
