'use strict';

angular.module( 'portailApp' )
    .controller( 'PopupConfigNewsFluxesCtrl',
		 [ '$scope', '$modalInstance', 'Flux',
		   function( $scope, $modalInstance, Flux ) {
		       $scope.current_flux = Flux.query();

		       $scope.delete = function( flux ) {
			   flux.$delete();
		       };

		       $scope.add_flux = function() {
			   $scope.current_flux.push( new Flux( {
			       nb: 1,
			       title: '',
			       flux: '',
			       icon: ''
			   } ) );
		       };

		       $scope.cancel = function () {
			   $modalInstance.close();
		       };

		       $scope.ok = function () {
			   _($scope.current_flux).each( function( flux ) {
			       if ( _(flux).has( 'id' ) ) {
				   flux.$update();
			       } {
				   // le flux de notification de l'utilisateur a un champs titre
				   if ( !_(flux).has( 'titre' ) && !_(flux.flux).isEmpty() && !_(flux.title).isEmpty() ) {
				       flux.$save();
				   }
			       }
			   } );
			   $modalInstance.close();
		       };
		   } ] );
