'use strict';

angular.module( 'portailApp.services.user', [  ] );

angular.module( 'portailApp.services.user' )
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

// Services pour les applications
angular.module( 'portailApp.services.user' )
    .factory( 'UserApps',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/apps' );
		} ] );

// Services pour les ressources numériques
angular.module( 'portailApp.services.user' )
    .factory( 'UserRessources',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/resources_numeriques' );
		} ] );

// Services pour la gestion de l'avatar.
angular.module( 'portailApp.services.user' )
    .service( 'currentUser',
	      [ '$http', '$upload', 'APP_PATH', 'User', 'UserApps',
		function( $http, $upload, APP_PATH, User, UserApps ) {
		    this.get = function() { return User.get().$promise; };
		    this.apps = function() { return UserApps.query().$promise; };
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
