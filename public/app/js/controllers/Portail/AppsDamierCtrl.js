'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailAppsDamierCtrl',
		 [ '$scope', 'current_user', 'current_apps', 'APP_PATH', 'CASES',
		   function( $scope, current_user, current_apps, APP_PATH, CASES ) {
		       $scope.prefix = APP_PATH;

		       $scope.current_user = current_user;

		       $scope.cases = CASES;

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
