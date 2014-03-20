'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'AppWrapperCtrl',
		 [ '$scope',
		   function( $scope ) {
		     $scope.menu = ['danser', 'jouer'];
		 } ] );
