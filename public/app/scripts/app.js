'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'portailApp',
		[ 'portailApp.controllers', 'ngRoute', 'services.constants'] )
    .config( ['$routeProvider', 'APPLICATION_PREFIX',
	      function( $routeProvider, APPLICATION_PREFIX ) {
		  $routeProvider.when( '/view1',
				       { templateUrl: APPLICATION_PREFIX+'/views/partial1.html',
					 controller: 'PortailCtrl1' } );
		  $routeProvider.when( '/view2',
				       { templateUrl: APPLICATION_PREFIX+'/views/partial2.html',
					 controller: 'PortailCtrl2' } );
		  $routeProvider.otherwise( {redirectTo: '/view1'} );
	      } ] )
    .run( [ '$rootScope', '$location',
	    function( $rootScope, $location ) {
		$rootScope.$location = $location;
		window.scope = $rootScope;
	    } ] );
