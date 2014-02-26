'use strict';



// Declare app level module which depends on filters, and services
angular.module( 'portailApp',
		[ 'portailApp.controllers',
		  'ngRoute',
		  'services.constants' ] )
    .config( [ '$routeProvider', 'APPLICATION_PREFIX',
	       function( $routeProvider, APPLICATION_PREFIX ) {
		   $routeProvider.when( '/view1',
					{ templateUrl: APPLICATION_PREFIX + '/views/partials/partial1.html',
					  controller: 'PortailCtrl1' } );
		   $routeProvider.when( '/view2',
					{ templateUrl: APPLICATION_PREFIX + '/views/partials/partial2.html',
					  controller: 'PortailCtrl2' } );
		   $routeProvider.otherwise( { redirectTo: '/view1' } );
	       } ] )
    .run( [ '$rootScope', '$location',
	    function( $rootScope, $location ) {
		$rootScope.$location = $location;
		window.scope = $rootScope;
	    } ] );

$(document).ready( function() {
  var client = new Faye.Client( '/app/faye', {
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
