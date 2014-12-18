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
							    ville: '@ville' //,
							    // login: '@login',
							    // password: '@password',
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
		    return $resource( APP_PATH + '/api/ressources_numeriques' );
		} ] );

angular.module( 'portailApp' )
    .factory( 'UserMesRegroupements',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/user/regroupements' );
		} ] );

angular.module( 'portailApp' )
    .factory( 'RegroupementDetail',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/user/regroupements/:id' );
		} ] );

angular.module( 'portailApp' )
    .service( 'currentUser',
	      [ '$http', '$upload', 'APP_PATH', 'User', 'UserRessources', 'UserMesRegroupements',
		function( $http, $upload, APP_PATH, User, UserRessources, UserMesRegroupements ) {
		    this.get = function() { return User.get().$promise; };
		    this.ressources = function() { return UserRessources.query().$promise; };
		    this.regroupements = function() { return UserMesRegroupements.query().$promise; };
		    this.avatar = { upload: function( fichier ) {
			$upload.upload( {
			    url: APP_PATH + '/api/user/avatar',
			    method: 'POST',
			    file: fichier,
			    fileFormDataName: 'image'
			} );
		    },
				    delete: function() {
					$http.delete( APP_PATH + '/api/user/avatar' );
				    }
				  };
		} ] );
