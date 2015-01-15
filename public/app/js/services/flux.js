'use strict';

angular.module( 'portailApp' )
    .factory( 'Flux',
	      [ '$resource', 'APP_PATH',
		function( $resource, APP_PATH ) {
		    return $resource( APP_PATH + '/api/flux/:id',
				      { id      : '@id',
					nb	: '@nb',
					icon	: '@icon',
					flux	: '@flux',
					title	: '@title' },
				      { update: { method: 'PUT' } } );
		} ] );
