'use strict';

angular.module( 'portailApp' )
    .controller( 'DamierAppsCtrl',
		 [ '$scope', '$modal', '$log', '$q', '$http', 'current_user', 'Apps', 'APP_PATH', 'CASES', 'COULEURS',
		   function( $scope, $modal, $log, $q, $http, current_user, Apps, APP_PATH, CASES, COULEURS ) {
		       $scope.prefix = APP_PATH;
		       $scope.current_user = current_user;
		       $scope.modification = false;
		       var apps_indexes_changed = false;
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
		       $scope.couleurs = COULEURS;

		       var tool_app = function( app ) {
			   app.configure = false;
			   app.dirty = false;
			   app.to_delete = false;
			   app.portail = app.url.match( /^app\..*/ ) !== null;
			   app.external = ( app.type == 'EXTERNAL' ) || app.url.match( /^http.*/ ) !== null;

			   if ( app.external || app.portail || app.application_id == 'MAIL') {
			       app.status = { status: 'OK',
					      available: true };
			   } else {
			       var save_response = function( response ) {
				   switch ( response.status ) {
				   case 200:
				       app.status = response.data;
				       break;
				   case 404:
				       app.status = { status: 'KO',
							    code: response.status,
							    reason: 'Serveur de l\'application introuvable.' };
				       break;
				   case 500:
				       app.status = { status: 'KO',
							    code: response.status,
							    reason: 'Serveur de l\'application en erreur.' };
				       break;
				   default:
				       app.status = { status: 'KO',
							   code: response.status,
							   reason: 'Erreur non qualifiée.' };
				   }
				   app.status.available = app.status.status == 'OK';
			       };
			       $http.get( app.url + 'status' ).then( save_response,
								     save_response );
			   }

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
			       app.is_dirty();
			       app.to_delete = true;
			   };
			   app.colorize = function() {
			       if ( app.color ) {
				   return { 'background-color': app.color };
			       } else {
				   return {};
			       }
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
					   .map( function( c ) {
					       return c.app;
					   } )
					   .compact()
					   .value();
				   }
			       }
			   } )
			       .result.then( function( new_app ) {
				   var recipient = _.chain($scope.cases)
					   .select( function( c ) { return !_(c.app).has( 'libelle' ); } )
					   .first()
					   .value();
				   new_app.index = recipient.index;

				   new_app.dirty = true;
				   new_app.configure = true;
				   new_app.active = true;
				   new_app.to_delete = false;

				   new_app.$save().then( function() {
				       recipient.app = tool_app( new_app );
				   } );
			       } );
		       };

		       $scope.toggle_modification = function( save ) {
			   $scope.modification = !$scope.modification;
			   $scope.sortable_options.disabled = !$scope.sortable_options.disabled;
			   if ( !$scope.modification ) {
			       var promesses = [];

			       if ( save && apps_indexes_changed ) {
				   // mise à jour de l'annuaire avec les nouveaux index des apps suite au déplacement
				   _($scope.cases).each( function( c, i ) {
				       if ( _(c.app).has( 'id' ) ) {
					   c.app.index = i;
					   promesses.push( c.app.$update() );
				       }
				   } );
			       }

			       _($scope.cases).each( function( c ) {
				   if ( _(c).has( 'app' ) ) {
				       c.app.configure = false;
				       if ( save && c.app.dirty ) {
					   if ( c.app.to_delete ) {
					       promesses.push( c.app.$delete() );
					   } else {
					       promesses.push( c.app.$update() );
					   }
					   c.app = tool_app( c.app );
				       }
				   }
			       } );

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
					   .each( function( app ) {
					       $scope.cases[ app.index ].app = tool_app( app );
					   } );
				   } );
			       } );
		       };

		       retrieve_apps();

		       $scope.tetris = function() {
			   $( '.empty' ).blockrain({ autoplay: true, autoplayRestart: true });
		       };
		   } ] );
