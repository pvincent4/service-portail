'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'portailApp',
		[ 'portailApp.controllers',
		  'portailApp.services.constants',
		  'portailApp.services.authentication',
		  'portailApp.services.news',
                  'portailApp.services.notifications',
		  'ngResource',
		  'ui.router',
		  'ui.bootstrap',
		  'angular-carousel',
		  'flow' ] )
    .config( [ '$stateProvider', '$urlRouterProvider', 'APPLICATION_PREFIX',
	       function( $stateProvider, $urlRouterProvider, APPLICATION_PREFIX ) {
		   $stateProvider
		       .state( 'portail',
			       { templateUrl: APPLICATION_PREFIX + '/views/portail/index.html'} )
		       .state( 'portail.apps',
			       { url: '/',
				 views: {
				     'aside': {
					 templateUrl: APPLICATION_PREFIX + '/views/portail/aside.html',
					 controller: 'PortailAsideCtrl'
				     },
				     'main': {
					 templateUrl: APPLICATION_PREFIX + '/views/portail/apps.html',
					 controller: 'PortailAppsDamierCtrl'
				     }
				 }
			       } )
		       .state( 'portail.user',
			       { url: '/user',
				 views: {
				     'aside': {
					 templateUrl: APPLICATION_PREFIX + '/views/portail/aside.html',
					 controller: 'PortailAsideCtrl'
				     },
				     'main': {
					 templateUrl: APPLICATION_PREFIX + '/views/portail/user.html',
					 controller: 'PortailUserCtrl'
				     }
				 }
			       } )
		       .state( 'app-wrapper',
			       { url: '/show-app?app',
				 templateUrl: APPLICATION_PREFIX + '/views/show-app.html',
				 controller: 'AppWrapperCtrl' } );

		   $urlRouterProvider.otherwise( '/' );
	       } ] )
    .run( [ '$rootScope', '$location', 'notifications', 'APPLICATION_PREFIX', 
	    function( $rootScope, $location, notifications, APPLICATION_PREFIX) {
		$rootScope.$location = $location;
		window.scope = $rootScope;

                var client = new Faye.Client(APPLICATION_PREFIX + '/faye', {
                    timeout: 120
                });
                notifications.get().then(function(response) {
                   var channels = _(response.data).each(function(channel) {
                       console.log (channel);
                        client.subscribe(channel, function(msg) {
                            console.log("message received on '" + channel + "' : " + msg.text);
                            $.growl.notice({duration: 6400, size: "large", message: msg.text});
                       });
                    });
                    _(channels).each(function(ch){
                        client.publish(ch, {text: 'Vous êtes abonné au canal :"'+ch+'"'}); 
                    });
                    
                });
             

            }]);