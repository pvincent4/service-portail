'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'portailApp',
		[ 'portailApp.controllers',
		  'ui.router',
		  'services.constants' ] )
    .config( [ '$stateProvider', '$urlRouterProvider', 'APPLICATION_PREFIX',
	       function( $stateProvider, $urlRouterProvider, APPLICATION_PREFIX ) {
		   $stateProvider
		       .state( 'view1',
			       { url: '/view1',
				 templateUrl: APPLICATION_PREFIX + '/views/partials/partial1.html',
				 controller: 'PortailCtrl1' } )
		       .state( 'view2',
			       { url: '/view2',
				 templateUrl: APPLICATION_PREFIX + '/views/partials/partial2.html',
				 controller: 'PortailCtrl2' } );

		   $urlRouterProvider.otherwise( '/view1' );
	       } ] )
    .run( [ '$rootScope', '$location',
	    function( $rootScope, $location ) {
		$rootScope.$location = $location;
		window.scope = $rootScope;
	    } ] );

$(document).ready( function() {
    var client = new Faye.Client( '/portail/faye', {
	timeout: 120
    });

    var subscription = client.subscribe('/foo', function(msg) {
	console.log("message received on /foo : " + msg) ;
	$.growl.notice({ duration: 6400, size: "large", title: "Hey there", message: "New message" });
	$.growl({ message: msg.text });
	// handle message
    });

    client.publish('/foo', {text: 'Hi there'});
});
