'use strict';

angular.module( 'portailApp' )
    .factory( 'Apps',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/apps/:id',
				      { application_id	: '@application_id',
					etab_code_uai	: '@etab_code_uai',
					index		: '@index',
					type		: '@type',
					libelle		: '@libelle',
					description	: '@description',
					url		: '@url',
					active		: '@active',
					icon		: '@icon',
					color		: '@color' },
				      { update: { method: 'PUT' },
					query_default: { methode: 'GET',
							 url: APP_PATH + '/api/apps/defaults',
							 isArray: true } } );
		} ] );
