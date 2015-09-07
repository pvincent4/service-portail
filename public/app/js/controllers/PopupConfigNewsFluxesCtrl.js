'use strict';

angular.module( 'portailApp' )
    .controller( 'PopupConfigNewsFluxesCtrl',
		 [ '$scope', '$modalInstance', 'Flux',
		   function( $scope, $modalInstance, Flux ) {
		       Flux.query().$promise.then( function( response ) {
			   $scope.current_flux = _(response).map( function( flux ) {
			       flux.dirty = false;

			       return flux;
			   } );
		       } );

		       $scope.minutes = _.range( 1, 11 );

		       $scope.delete = function( flux ) {
			   flux.$delete();
			   $scope.current_flux = _($scope.current_flux).difference( [ flux ] );
		       };

		       $scope.save = function( flux ) {
			   _(flux).has( 'id' ) ? flux.$update() : flux.$save();
		       };

		       $scope.dirtify = function( flux ) {
			   flux.dirty = true;
		       };

		       $scope.add_flux = function() {
			   $scope.current_flux.push( new Flux( {
			       nb: 1,
			       title: '',
			       flux: '',
			       icon: ''
			   } ) );
		       };

		       $scope.close = function () {
			   $modalInstance.close();
		       };
		   } ] );
