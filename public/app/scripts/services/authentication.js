'use strict';

angular.module( 'portailApp.services.authentication', [  ] );
angular.module( 'portailApp.services.authentication' )
    .service('currentUser',
	     [ '$http', 'APPLICATION_PREFIX',
	       function( $http, APPLICATION_PREFIX ) {
		   var user = null;
		   this.get = function() {
		       if ( user == null ) {
			   user = $http.get( APPLICATION_PREFIX + '/api/user' )
			       .success( function( response ) {
				   response.is_logged = response.user !== '';
				   if ( response.is_logged ) {
				       response.profils = _(response.extra.profils).map( function( profil ) {
					   return { 'type': profil['profil_id'],
						    'uai': profil['etablissement_code_uai'],
						    'etablissement': profil['etablissement_nom'],
						    'nom': profil['profil_nom'] };
				       });
				       response.profil_actif = response.profils[ 0 ];
				   }
				   return response;
			       } );
		       }

		       return user;
		   };
	       } ] );
