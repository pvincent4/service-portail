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
    .run( [ '$rootScope', '$location', 'currentUser', 'notifications', 'APPLICATION_PREFIX', 
	    function( $rootScope, $location, currentUser, notifications, APPLICATION_PREFIX) {
		$rootScope.$location = $location;
		window.scope = $rootScope;

                var client = new Faye.Client(APPLICATION_PREFIX + '/faye', {
                    timeout: 120
                });
                notifications.get().then(function(response) {
                   var channels = _(response.data).each(function(channel) {
                        client.subscribe(channel, function(msg) {
                            $.gritter.add({
                                // (string | mandatory) the heading of the notification
                                title: msg.title,
                                // (string | mandatory) the text inside the notification
                                text: msg.text,
                                // (string | optional) the image to display on the left
                                image: msg.image,
                                // (bool | optional) if you want it to fade out on its own or just sit there
                                sticky: false,
                                // (int | optional) the time you want it to be alive for before fading out (milliseconds)
                                time: 8000,
                                // (string | optional) the class name you want to apply directly to the notification for custom styling
                                class_name: msg.class_name,
                                // (function | optional) function called before it opens
                                before_open: function() {
                                },
                                // (function | optional) function called after it opens
                                after_open: function(e) {
                                },
                                // (function | optional) function called before it closes
                                before_close: function(e, manual_close) {
                                    // the manual_close param determined if they closed it by clicking the "x"
                                },
                                // (function | optional) function called after it closes
                                after_close: function() {
                                }
                            });
                       });
                    });
                    _(channels).each(function(ch) {
                    });
                    // Notif de bienvenu à la nouvelle connexion
                    client.publish('/etablissement/0692520p/ens/vaa61315', {
                        title: 'Service du portail',
                        image: '/app/bower_components/charte-graphique-laclasse-com/images/logolaclasse.svg',
                        class_name: 'gritter-light',
                        text: 'Bienvenue sur le portail de votre ENT.'
                    });
                    // Notif pour les autres utilisateurs de l'établissement
                    client.publish('/etablissement/0692520p/ens/*', {
                        title: 'Service du portail',
                        image: '/app/bower_components/charte-graphique-laclasse-com/images/logolaclasse.svg',
                        class_name: 'gritter-light',
                        text: 'vaa61315 vient de se connecter.'
                    });
                    

                });


            }]);