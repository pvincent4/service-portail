'use strict';

// Declare app level module which depends on filters, and services
angular.module('portailApp',
	['portailApp.controllers',
	    'portailApp.services.constants',
	    'portailApp.services.authentication',
	    'portailApp.services.news',
	    'portailApp.services.notifications',
	    'ngResource',
	    'ui.router',
	    'ui.bootstrap',
	    'angular-carousel',
	    'flow'])
	.config(['$stateProvider', '$urlRouterProvider', 'APPLICATION_PREFIX',
	    function($stateProvider, $urlRouterProvider, APPLICATION_PREFIX) {
		$stateProvider
			.state('portail',
				{templateUrl: APPLICATION_PREFIX + '/views/portail/index.html'})
			.state('portail.apps',
				{url: '/',
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
				})
			.state('portail.user',
				{url: '/user',
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
				})
			.state('app-wrapper',
				{url: '/show-app?app',
				    templateUrl: APPLICATION_PREFIX + '/views/show-app.html',
				    controller: 'AppWrapperCtrl'});

		$urlRouterProvider.otherwise('/');
	    }])
	.run(['$rootScope', '$location', 'currentUser', 'notifications', 'APPLICATION_PREFIX',
	    function($rootScope, $location, currentUser, notifications, APPLICATION_PREFIX) {
		function subnotif(ch) {
		    client.subscribe(ch, function(msg) {
			$.gritter.add({
			    title: msg.title,
			    text: msg.text,
			    image: msg.image,
			    sticky: false,
			    time: 5000,
			    fade_in_speed: 'medium',
			    fade_out_speed: 1500,
			    class_name: msg.class_name
			});
		    });
		}

		$rootScope.$location = $location;
		window.scope = $rootScope;
		var client = new Faye.Client(APPLICATION_PREFIX + '/faye', {
		    timeout: 120
		});
		notifications.get().then(function(response) {
		    var canal = response.data;

		    subnotif(canal.tech);
		    subnotif(canal.mon_etablissement);
		    subnotif(canal.moi);

		    _(canal.mes_classes).each(function(ch) {
			subnotif(ch);
		    });

		    _(canal.mes_groupes).each(function(ch) {
			subnotif(ch);
		    });

		    _(canal.mes_groupes_libres).each(function(ch) {
			subnotif(ch);
		    });

		    // FIXME : la variable 'client' est-elle utilisable ailleurs ? le .run n'est exécuté qu'une fois.
		    // Ce n'est sans doute pas le bon endroit pour mettre cette déclaration ?

		    // Notif de bienvenu à la nouvelle connexion
		    // Attendre que les connexions avec faye soient initialisées
		    setTimeout(function() {
			client.publish(canal.moi, {
			    type: 'Connexion',
			    title: 'Service du portail',
			    image: APPLICATION_PREFIX + '/bower_components/charte-graphique-laclasse-com/images/logolaclasse.svg',
			    class_name: 'gritter-light',
			    text: 'Bienvenue sur le portail de votre ENT. Pour gérer vos notifications, rendez-vous, <a href="' + APPLICATION_PREFIX + '/notifs">Cliquez par là</a>...'
			});
		    }, 3000);

		});
	    }]);
