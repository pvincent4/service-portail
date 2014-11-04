'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailAppsDamierCtrl',
		 [ '$scope', 'current_user', 'current_apps', 'APP_PATH',
		   function( $scope, current_user, current_apps, APP_PATH ) {
		       $scope.prefix = APP_PATH;

		       $scope.current_user = current_user;
		       $scope.apps = current_apps.map( function( app ) {
			   app.configure = false;
			   app.toggle_configure = function() { app.configure = !app.configure; };
			   app.deactivate = function() { console.log( app.nom + ' désactivée.' ); };

			   return app;
		       } );
		   } ] );
