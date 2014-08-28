'use strict';

angular.module( 'portailApp.services.authentication', [  ] );

angular.module('portailApp.services.authentication')
    .factory('User',
	     [ '$resource', 'APP_PATH',
	       function( $resource, APP_PATH ) {
		   return $resource( APP_PATH + '/api/user',
				     {},
				     { change_profil_actif: { method: 'PUT',
							      url: APP_PATH + '/api/user/profil_actif/:index',
							      params: { profil_id: '@profil_id' }
							    }
				     });
	       } ] );

angular.module('portailApp.services.authentication')
    .factory('UserApps',
	     [ '$resource', 'APP_PATH',
	       function( $resource, APP_PATH ) {
		   return $resource( APP_PATH + '/api/apps' );
	       } ] );

angular.module( 'portailApp.services.authentication' )
    .service('currentUser',
	     [ 'User', 'UserApps',
	       function( User, UserApps ) {
		   this.get = function() { return User.get().$promise; };
		   this.apps = function() { return UserApps.query().$promise; };
	       } ] );
