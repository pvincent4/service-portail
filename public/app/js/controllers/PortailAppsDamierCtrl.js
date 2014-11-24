'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailAppsDamierCtrl',
		 [ '$scope', '$modal', '$log', 'current_user', 'currentUser', 'APP_PATH', 'CASES',
		   function( $scope, $modal, $log, current_user, currentUser, APP_PATH, CASES ) {
		       $scope.prefix = APP_PATH;
		       $scope.current_user = current_user;
		       $scope.cases = CASES;
		       var apps_indexes_changed = false;

		       var tool_app = function( app ) {
			   app.draft = angular.copy( app );
			   app.configure = false;
			   app.dirty = false;

			   app.toggle_configure = function() {
			       _.chain($scope.cases)
				   .select( function( c ) { return _(c).has( 'app' ); } )
				   .each( function( c ) {
				       if ( c.app === app ) {
					   app.configure = !app.configure;
				       } else  {
					   c.app.configure = false;
				       }
				   } );
			   };
			   app.is_dirty = function() { app.dirty = true; };
			   app.remove = function() {
			       app.active = false;
			       app.toggle_configure();
			   };

			   return app;
		       };

		       $scope.modification = false;
		       $scope.sortable_options = {
			   disabled: !$scope.modification,
			   containment: '.damier',
			   'ui-floating': true,
			   stop: function( e, ui ) {
			       apps_indexes_changed = true;
			   }
		       };

		       currentUser.apps()
			   .then( function( response ) {
			       $scope.current_apps = response;
			       $scope.add_tile = function() {
				   $modal.open( {
				       templateUrl: 'views/popup_ajout_app.html',
				       controller: 'PopupAjoutAppCtrl',
				       resolve: {
					   apps: function () {
					       return _($scope.current_apps).select( function( app ) { return !app.active; } );
					   }
				       }
				   } )
				       .result.then( function( new_app ) {
					   new_app = tool_app( new_app );

					   if ( new_app.creation ) {
					       new_app.configure = true;
					       _.chain($scope.cases)
						   .select( function( c ) { return !_(c).has( 'app' ); } )
						   .first()
						   .value().app = new_app;
					   }

					   new_app.active = true;
				       } );
			       };

			       $scope.toggle_modification = function( save ) {
				   $scope.modification = !$scope.modification;
				   $scope.sortable_options.disabled = !$scope.sortable_options.disabled;
				   if ( $scope.modification ) {
				       _($scope.current_apps).each( function( app ) {
					   app.draft = angular.copy( app );
				       } );
				   } else {
				       _($scope.cases).each( function( c ) {
					   if ( _(c).has( 'app' ) ) {
					       c.app.configure = false;
					       if ( save && c.app.dirty ) {
						   _.chain(c.app.draft)
						       .keys()
						       .each( function( key ) {
							   c.app[ key ] = angular.copy( c.app.draft[ key ] );
						       } );
						   c.app.$update();
						   c.app = tool_app( c.app );
					       }
					   }
				       } );

				       if ( save && apps_indexes_changed ) {
					   // mise à jour de l'annuaire avec les nouveaux index des apps suite au déplacement
					   _($scope.cases).each( function( c, i ) {
					       if ( _(c).has( 'app' ) ) {
						   c.app.index = i;
						   c.app.$update();
					       }
					   } );
				       }
				   }
			       };

			       $scope.current_apps.$promise.then( function() {
				   _.chain($scope.current_apps)
				       .sortBy( function( app ) { return !app.active; } )
				       .each( function( app, i ) {
					   $scope.cases[ i ].app = tool_app( app );
				       } );
			       } );
			   } );
		   } ] );
