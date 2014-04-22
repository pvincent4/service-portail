'use strict';

angular.module( 'portailApp.services.authentication', [  ] );

angular.module('portailApp.services.authentication')
    .factory('User',
	     [ '$resource', 'APPLICATION_PREFIX',
	       function( $resource, APPLICATION_PREFIX ) {
		   return $resource( APPLICATION_PREFIX + '/api/user',
				     {},
				     { change_profil_actif: { method: 'PUT',
							      url: APPLICATION_PREFIX + '/api/user/profil_actif/:index',
							      params: { index: '@index' } 
                                                            } 
                                     });
	       } ] );

angular.module('portailApp.services.authentication')
    .factory('UserApps',
	     [ '$resource', 'APPLICATION_PREFIX',
	       function( $resource, APPLICATION_PREFIX ) {
		   return $resource( APPLICATION_PREFIX + '/api/apps' );
	       } ] );

angular.module( 'portailApp.services.authentication' )
    .service('currentUser',
	     [ 'User', 'UserApps',
	       function( User, UserApps ) {
		   this.get = _.memoize( function() {
		       return User.get().$promise;
		   } );
		   this.apps = _.memoize( function() {
		       return UserApps.query().$promise;
		   } );
	       } ] );
