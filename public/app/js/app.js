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
				'ngFitText' ] )
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
					 controller: 'PortailAppsDamierCtrl'
				     }
				 }
			       } )
		       .state( 'portail.user',
			       { parent: 'portail',
				 url: '/user',
				 views: {
				     'main': {
					 templateUrl: 'views/user.html',
					 controller: 'PortailUserCtrl'
				     }
				 }
			       } )
		       .state( 'trombinoscope',
			       { url: '/trombinoscope',
				 templateUrl: 'views/trombinoscope.html',
				 controller: 'PortailTrombiCtrl'
			       } )
		       .state( 'ressources-numeriques',
			       { url: '/ressources-numeriques',
				 templateUrl: 'views/ressources_numeriques.html',
				 controller: 'RessourcesNumeriquesCtrl'
			       } )
		       .state( 'app-wrapper',
			       { url: '/show-app?app?static',
				 templateUrl: 'views/show-app.html',
				 controller: 'AppWrapperCtrl'
			       } );
	       }
	     ] );
