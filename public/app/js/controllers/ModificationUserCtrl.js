'use strict';

angular.module( 'portailApp' )
    .controller( 'ModificationUserCtrl',
		 [ '$scope', '$state', '$q', 'toastr', 'current_user', 'currentUser', 'APP_PATH',
		   function( $scope, $state, $q, toastr, current_user, currentUser, APP_PATH ) {
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
			   var leave = true;
			   if ( sauvegarder ) {
			       if ( !_($scope.password.old).isEmpty() && !_($scope.password.new1).isEmpty() ) {
				   if ( $scope.password.new1 == $scope.password.new2 ) {
				       $scope.current_user.previous_password = $scope.password.old;
				       $scope.current_user.new_password = $scope.password.new1;
				   } else {
				       toastr.error( 'Confirmation de mot de passe incorrecte.',
						     'Erreur',
						     { timeout: 100000 } );
				       leave = false;
				   }
			       }

			       $scope.current_user.$update().then( function() {
				   if ( _($scope.current_user).has( 'new_avatar' ) ) {
				       currentUser.avatar.upload( $scope.current_user.new_avatar );
				   } else if ( $scope.current_user.reset_avatar ) {
				       currentUser.avatar.delete();
				   }
			       } );
			   }

			   if ( leave ) {
			       $state.go( 'portail.logged' );
			   }
		       };
		   } ] );
