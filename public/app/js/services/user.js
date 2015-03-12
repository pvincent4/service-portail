'use strict';

angular.module( 'portailApp' )
    .factory( 'User',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/user',
				      {  },
				      { update: { method: 'PUT',
						  params: { nom: '@nom',
							    prenom: '@prenom',
							    sexe: '@sexe',
							    date_naissance: '@date_naissance',
							    adresse: '@adresse',
							    code_postal: '@code_postal',
							    ville: '@ville',
							    // login: '@login',
							    password: '@password' //,
							    // bloque: '@bloque'
							  } },
					change_profil_actif: { method: 'PUT',
							       url: APP_PATH + '/api/user/profil_actif/:index',
							       params: { profil_id: '@profil_id' } }
				      } );
		} ] );

angular.module( 'portailApp' )
    .factory( 'UserRessources',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/user/ressources_numeriques' );;
		} ] );

angular.module( 'portailApp' )
    .factory( 'UserRegroupements',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/user/regroupements/:id',
				      { id: '@id' },
				      { eleves: { method: 'GET',
						  url: APP_PATH + '/api/user/regroupements/:id/eleves',
						  isArray: true } } );
		} ] );

angular.module( 'portailApp' )
    .service( 'currentUser',
	      [ '$http', '$upload', '$resource', 'APP_PATH', 'User', 'UserPassword', 'UserRessources', 'UserRegroupements',
		function( $http, $upload, $resource, APP_PATH, User, UserPassword, UserRessources, UserRegroupements ) {
		    this.get = function() { return User.get().$promise; };
		    // this.check_password = function( password ) { return $http.post( APP_PATH + '/api/user/password/check',
		    //								    { password: '@password' } );
		    //					       };
		    this.ressources = function() { return UserRessources.query().$promise; };
		    this.regroupements = function() { return UserRegroupements.query().$promise; };
		    this.eleves_regroupement = function( id ) { return UserRegroupements.eleves( { id: id } ).$promise; };

		    this.avatar = { upload: function( fichier ) {
			return $upload.upload( { url: APP_PATH + '/api/user/avatar',
						 method: 'POST',
						 file: fichier,
						 fileFormDataName: 'image' } );
		    },
				    delete: function() { return $http.delete( APP_PATH + '/api/user/avatar' ); }
				  };
		} ] );
