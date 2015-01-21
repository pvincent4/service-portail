'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'portailApp', [ 'ngResource',
				'ui.router',
				'ui.bootstrap',
				'ui.sortable',
				'ngTouch',
				'ngAnimate',
				'angularFileUpload',
				'flow',
				'angularMoment',
				'theaquaNg',
				'ngDelay',
				'ngColorPicker',
				'angular-carousel',
				'ngFitText',
				'konami' ] )
    .config( [ '$stateProvider', '$urlRouterProvider', 'APP_PATH',
	       function ( $stateProvider, $urlRouterProvider, APP_PATH ) {
		   $urlRouterProvider.otherwise( '/' );

		   $stateProvider
		       .state( 'portail', {
			   resolve: { current_user: [ 'currentUser',
						      function( currentUser ) {
							  return currentUser.get()
							      .then( function( response ) {
								  return response;
							      } );
						      }
						    ]
				    },
			   templateUrl: 'views/index.html',
			   controller: 'PortailCtrl'
		       } )
		       .state( 'portail.logged',
			       { parent: 'portail',
				 url: '/',
				 views: {
				     'main': {
					 templateUrl: 'views/apps.html',
					 controller: 'DamierAppsCtrl'
				     }
				 }
			       } )
		       .state( 'portail.user',
			       { parent: 'portail',
				 url: '/user',
				 views: {
				     'main': {
					 templateUrl: 'views/user.html',
					 controller: 'ModificationUserCtrl'
				     }
				 }
			       } )
		       .state( 'app',
			       { resolve: { current_user: [ 'currentUser',
							    function( currentUser ) {
								return currentUser.get()
								    .then( function( response ) {
									return response;
								    } );
							    }
							  ]
					  },
				 url: '/app',
				 templateUrl: 'views/app-wrapper.html',
				 controller: 'AppWrapperCtrl'
			       } )
		       .state( 'app.external',
			       { parent: 'app',
				 url: '/external?app',
				 views: {
				     'app': {
					 templateUrl: 'views/iframe.html',
					 controller: 'IframeCtrl'
				     }
				 }
			       } )
		       .state( 'app.trombinoscope',
			       { parent: 'app',
				 url: '/trombinoscope',
				 views: {
				     'app': {
					 templateUrl: 'views/trombinoscope.html',
					 controller: 'TrombinoscopeCtrl'
				     }
				 }
			       } )
		       .state( 'app.ressources-numeriques',
			       { parent: 'app',
				 url: '/ressources-numeriques',
				 views: {
				     'app': {
					 templateUrl: 'views/ressources_numeriques.html',
					 controller: 'RessourcesNumeriquesCtrl'
				     }
				 }
			       } )
		       .state( 'app.classes-culturelles-numeriques',
			       { parent: 'app',
				 url: '/classes-culturelles-numeriques',
				 views: {
				     'app': {
					 templateUrl: 'views/ccn.html',
					 controller: 'CCNCtrl'
				     }
				 }
			       } )
		       .state( 'app.classes-culturelles-numeriques-archivees',
			       { parent: 'app',
				 url: '/classes-culturelles-numeriques-archivees',
				 views: {
				     'app': {
					 templateUrl: 'views/archives-ccn.html',
					 controller: 'CCNCtrl'
				     }
				 }
			       } );
	       }
	     ] );
