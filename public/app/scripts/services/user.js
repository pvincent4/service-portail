'use strict';

angular.module( 'portailApp.services.user', [  ] );

angular.module('portailApp.services.user')
    .factory('User',
	     [ '$resource', 'APP_PATH',
	       function( $resource, APP_PATH ) {
		   return $resource( APP_PATH + '/api/user',
				     {  },
				     { update: { method: 'PUT',
						 params: { login: '@login',
							   password: '@password',
							   nom: '@nom',
							   prenom: '@prenom',
							   sexe: '@sexe',
							   date_naissance: '@date_naissance',
							   adresse: '@adresse',
							   code_postal: '@code_postal',
							   ville: '@ville',
							   bloque: '@bloque' } },
				       change_profil_actif: { method: 'PUT',
							      url: APP_PATH + '/api/user/profil_actif/:index',
							      params: { profil_id: '@profil_id' } }
				     } );
	       } ] );

angular.module('portailApp.services.user')
    .factory('UserApps',
	     [ '$resource', 'APP_PATH',
	       function( $resource, APP_PATH ) {
		   return $resource( APP_PATH + '/api/apps' );
	       } ] );

angular.module( 'portailApp.services.user' )
    .service('currentUser',
	     [ 'User', 'UserApps',
	       function( User, UserApps ) {
		   this.get = _.memoize ( function() { return User.get().$promise; } );
		   this.apps = function() { return UserApps.query().$promise; };
	       } ] );
