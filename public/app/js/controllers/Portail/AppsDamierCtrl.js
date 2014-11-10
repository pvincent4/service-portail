'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailAppsDamierCtrl',
		 [ '$scope', 'current_user', 'current_apps', 'APP_PATH', 'CASES',
		   function( $scope, current_user, current_apps, APP_PATH, CASES ) {
		       $scope.prefix = APP_PATH;
		       $scope.current_user = current_user;
		       $scope.cases = CASES;

		       $scope.modification = false;
		       $scope.sortable_options = {
			   disabled: !$scope.modification,
			   containment: '.damier',
			   handle: '.handle',
			   'ui-floating': true,
			   update: function(e, ui) {
			       console.log( 'Update' );
			   },
			   stop: function(e, ui) {
			       console.log( 'Stop' );
			   }
		       };
		       $scope.toggle_modification = function() {
			   $scope.modification = !$scope.modification;
			   $scope.sortable_options.disabled = !$scope.sortable_options.disabled;
		       };

		       _.chain(current_apps)
			   .select( function( app ) { return app.active; } )
			   .each( function( app, i ) {
			       $scope.cases[ i ].app = app;
			       $scope.cases[ i ].app.configure = false;
			       $scope.cases[ i ].app.tmp_active = $scope.cases[ i ].app.active;

			       $scope.cases[ i ].app.toggle_configure = function() { app.configure = !app.configure; };
			       $scope.cases[ i ].app.deactivate = function() { console.log( app.nom + ' désactivée.' ); };
			   } );
		   } ] );
