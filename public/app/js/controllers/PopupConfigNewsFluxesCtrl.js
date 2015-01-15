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

		       // $scope.ok = function () {
		       //	   _($scope.current_flux).each( function( flux ) {
		       //	       console.log(flux)
		       //	       if ( _(flux).has( 'id' ) ) {
		       //		   flux.$update();
		       //	       } {
		       //		   // le flux de notification de l'utilisateur a un champs titre
		       //		   if ( !_(flux).has( 'titre' ) && !_(flux.flux).isEmpty() && !_(flux.title).isEmpty() ) {
		       //		       flux.$save();
		       //		   }
		       //	       }
		       //	   } );
		       //	   $modalInstance.close();
		       // };
		   } ] );
