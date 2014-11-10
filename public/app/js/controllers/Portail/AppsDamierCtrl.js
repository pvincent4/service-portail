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
			   stop: function( e, ui ) {
			       console.log( $scope.cases );
			       _($scope.cases).each( function( c, i ) {
				   if ( _(c).has( 'app' ) ) {
				       c.app.index = i;
				       c.app.$update();
				   }
			       } );
			   }
		       };

		       $scope.toggle_modification = function() {
			   $scope.modification = !$scope.modification;
			   $scope.sortable_options.disabled = !$scope.sortable_options.disabled;
			   if ( !$scope.modification ) {
			       _($scope.cases).each( function( c ) {
				   if ( _(c).has( 'app' ) ) {
				       c.app.configure = false;
				   }
			       } );
			   }
		       };

		   _.chain(current_apps)
		   .select( function( app ) { return app.active; } )
		   .each( function( app, i ) {
		       $scope.cases[ i ].app = app;
		       $scope.cases[ i ].app.configure = false;
		       $scope.cases[ i ].app.tmp_active = $scope.cases[ i ].app.active;

		       $scope.cases[ i ].app.toggle_configure = function() { app.configure = !app.configure; };
		   } );
		 } ] );
