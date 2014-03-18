'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'portailApp',
		[ 'portailApp.controllers',
		  'portailApp.services.constants',
		  'portailApp.services.authentication',
		  'ui.router' ] )
    .config( [ '$stateProvider', '$urlRouterProvider', 'APPLICATION_PREFIX',
	       function( $stateProvider, $urlRouterProvider, APPLICATION_PREFIX ) {
		   $stateProvider
		       .state( 'portail',
			       { url: '/',
				 templateUrl: APPLICATION_PREFIX + '/views/portail.html',
				 controller: 'PortailCtrl' } )
		       .state( 'app-wrapper',
			       { url: '/show-app',
				 templateUrl: APPLICATION_PREFIX + '/views/show-app.html',
				 controller: 'AppWrapperCtrl' } );

		   $urlRouterProvider.otherwise( '/' );
	       } ] )
    .run( [ '$rootScope', '$location',
	    function( $rootScope, $location ) {
		$rootScope.$location = $location;
		window.scope = $rootScope;
	    } ] );

// $(document).ready( function() {
//     var client = new Faye.Client( '/portail/faye', {
//	timeout: 120
//     });

//     var subscription = client.subscribe('/foo', function(msg) {
//	console.log("message received on /foo : " + msg) ;
//	$.growl.notice({ duration: 6400, size: "large", title: "Hey there", message: "New message" });
//	$.growl({ message: msg.text });
//	// handle message
//     });

//     client.publish('/foo', {text: 'Hi there'});
// });
