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
		       .state( 'trombinoscope',
			       { url: '/trombinoscope',
				 templateUrl: 'views/trombinoscope.html',
				 controller: 'TrombinoscopeCtrl'
			       } )
		       .state( 'ressources-numeriques',
			       { url: '/ressources-numeriques',
				 templateUrl: 'views/ressources_numeriques.html',
				 controller: 'RessourcesNumeriquesCtrl'
			       } )
		       .state( 'classes-culturelles-numeriques',
			       { url: '/classes-culturelles-numeriques',
				 templateUrl: 'views/ccn.html',
				 controller: 'CCNCtrl'
			       } )
		       .state( 'classes-culturelles-numeriques-archivees',
			       { url: '/classes-culturelles-numeriques-archivees',
				 templateUrl: 'views/archives-ccn.html',
				 controller: 'CCNCtrl'
			       } )
		       .state( 'app-wrapper',
			       { url: '/show-app?app?static',
				 templateUrl: 'views/show-app.html',
				 controller: 'AppWrapperCtrl'
			       } );
	       }
	     ] );
