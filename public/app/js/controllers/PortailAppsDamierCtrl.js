'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailAppsDamierCtrl',
		 [ '$scope', '$modal', '$log', '$q', 'current_user', 'Apps', 'APP_PATH', 'CASES',
		   function( $scope, $modal, $log, $q, current_user, Apps, APP_PATH, CASES ) {
		       $scope.prefix = APP_PATH;
		       $scope.current_user = current_user;
		       var apps_indexes_changed = false;

		       $scope.modification = false;
		       $scope.sortable_options = {
			   disabled: !$scope.modification,
			   containment: '.damier',
			   'ui-floating': true,
			   stop: function( e, ui ) {
			       apps_indexes_changed = true;

			       _($scope.cases).each( function( c, i ) {
				   c.index = i;
			       } );
			   }
		       };

		       var tool_app = function( app ) {
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

		       $scope.add_tile = function() {
			   $modal.open( {
			       templateUrl: 'views/popup_ajout_app.html',
			       controller: 'PopupAjoutAppCtrl',
			       resolve: {
				   current_apps: function () {
				       return _.chain($scope.cases)
					   .select( function( c ) {
					       return _(c).has('app');
					   } )
					   .map( function( c ) {
					       return c.app.application_id;
					   } )
					   .compact()
					   .value();
				   }
			       }
			   } )
			       .result.then( function( new_app ) {
				   new_app = tool_app( new_app );
				   new_app.active = true;

				   var recipient = _.chain($scope.cases)
					   .select( function( c ) { return !_(c.app).has( 'libelle' ); } )
					   .first()
					   .value();
				   new_app.index = recipient.index;
				   recipient.app = new_app;

				   if ( new_app.creation ) {
				       new_app.$save();

				       new_app.dirty = true;
				       new_app.configure = true;
				   }
			       } );
		       };

		       $scope.toggle_modification = function( save ) {
			   $scope.modification = !$scope.modification;
			   $scope.sortable_options.disabled = !$scope.sortable_options.disabled;
			   if ( !$scope.modification ) {
			       var promesses = [];

			       _($scope.cases).each( function( c ) {
				   if ( _(c).has( 'app' ) ) {
				       c.app.configure = false;
				       if ( save && c.app.dirty ) {
					   c.app.color = c.app.new_color;
					   promesses.push( c.app.$update() );
					   c.app = tool_app( c.app );
				       }
				   }
			       } );

			       if ( save && apps_indexes_changed ) {
				   // mise à jour de l'annuaire avec les nouveaux index des apps suite au déplacement
				   _($scope.cases).each( function( c, i ) {
				       if ( _(c).has( 'app' ) ) {
					   c.app.index = i;
					   promesses.push( c.app.$update() );
				       }
				   } );
			       }

			       $q.all( promesses ).then( retrieve_apps );
			   }
		       };

		       var retrieve_apps = function() {
			   $scope.cases = _( angular.copy( CASES ) ).map( function( c, i ) {
			       c.index = i;

			       return c;
			   } );

			   Apps.query()
			       .$promise
			       .then( function( response ) {
				   $scope.current_apps = response;

				   $scope.current_apps.$promise.then( function() {
				       _.chain($scope.current_apps)
					   .sortBy( function( app ) { return !app.active; } )
					   .each( function( app, i ) {
					       $scope.cases[ i ].app = tool_app( app );
					   } );
				   } );
			       } );
		       };

		       retrieve_apps();
		   } ] );
