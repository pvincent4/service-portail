'use strict';

angular.module( 'portailApp' )
    .controller( 'ModificationUserCtrl',
		 [ '$scope', '$state', '$q', 'current_user', 'currentUser', 'APP_PATH',
		   function( $scope, $state, $q, current_user, currentUser, APP_PATH ) {
		       $scope.prefix = APP_PATH;
		       $scope.groups = [ { ouvert: true,
					   enabled: true },
					 { ouvert: true,
					   enabled: true },
					 { ouvert: false,
					   enabled: false },
					 { ouvert: false,
					   enabled: false } ];

		       $scope.open_datepicker = function( $event ) {
			   $event.preventDefault();
			   $event.stopPropagation();

			   $scope.opened = true;
		       };

		       $scope.password = { old: '',
					   new1: '',
					   new2: '' };

		       $scope.current_user = current_user;
		       $scope.current_user.reset_avatar = false;
		       $scope.current_user.editable = _($scope.current_user.id_jointure_aaf).isNull();

		       $scope.current_user.date_naissance = new Date( $scope.current_user.date_naissance );

		       $scope.new_avatar = function( flowFile ) {
			   $scope.current_user.reset_avatar = false;
			   $scope.current_user.new_avatar = flowFile.file;
		       };

		       $scope.reset_avatar = function() {
			   $scope.current_user.reset_avatar = true;
		       };

		       $scope.check_password = function( password ) {
			   currentUser.check_password( password ).then( function( response ) {
			       return response.valid;
			   } );
		       };

		       $scope.fermer = function( sauvegarder ) {
			   if ( sauvegarder ) {
			       var prom = $q.defer();
			       prom.resolve();

			       if ( _($scope.current_user).has( 'new_avatar' ) ) {
				   prom = currentUser.avatar.upload( $scope.current_user.new_avatar );
			       } else if ( $scope.current_user.reset_avatar ) {
				   prom = currentUser.avatar.delete();
			       }

			       $scope.current_user.wrong_password = false;
			       if ( $scope.password.old != '' && $scope.password.new1 != '' && $scope.password.new1 == $scope.password.new2 ) {
				   if ( currentUser.check_password( $scope.password.old ).valid ) {
				       $scope.current_user.password = $scope.password.new2;
				   } else {
				       $scope.current_user.wrong_password = true;
				   }
			       }

			       if ( ! $scope.current_user.wrong_password ) {
				   prom.then( function() {
				       $scope.current_user.$update();

				       $state.go( 'portail.logged' );
				   } );
			       }
			   } else {
			       $state.go( 'portail.logged' );
			   }
		       };
		   } ] );
