'use strict';

angular.module( 'portailApp' )
    .service( 'ForcePasswordChange',
	      [ '$state', 'currentUser', 'Apps',
		function( $state, currentUser, Apps ) {
		    this.check = function() {
			if ( ! $state.is( 'change_password' ) ) {
			    Apps.query()
				.$promise
				.then( function( response ) {
				    var changeable_password = _.chain(response).find({application_id: 'TELESRV'}).isUndefined().value();

				    if ( changeable_password ) {
					currentUser.get()
					    .then( function( response ) {
						if ( response.default_password ) {
						    $state.go( 'change_password', $state.params, { reload: true, inherit: true, notify: true } );
						}
					    } );
				    }
				} );
			}
		    };
		}
	      ] );
