'use strict';

angular.module( 'portailApp' )
    .controller( 'ModificationUserCtrl',
		 [ '$scope', '$state', '$q', 'toastr', 'current_user', 'currentUser', 'Apps', 'APP_PATH',
		   function( $scope, $state, $q, toastr, current_user, currentUser, Apps, APP_PATH ) {
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
					   new2: '',
					   changeable: false };
		       Apps.query()
			   .$promise
			   .then( function( response ) {
			       $scope.password.changeable = _.chain(response).find({application_id: 'TELESRV'}).isUndefined().value();
			   } );
		       $scope.new_avatar = null;

		       $scope.current_user = current_user;
		       $scope.reset_avatar = false;
		       $scope.current_user.editable = _($scope.current_user.id_jointure_aaf).isNull();

		       $scope.current_user.date_naissance = new Date( $scope.current_user.date_naissance );

		       $scope.new_avatar = function( flowFile ) {
			   $scope.reset_avatar = false;
			   $scope.current_user.new_avatar = flowFile.file;
			   $scope.new_avatar = flowFile.file;
		       };

		       $scope.reset_avatar = function() {
			   $scope.reset_avatar = true;
		       };

		       $scope.check_password = function( password ) {
			   currentUser.check_password( password ).then( function( response ) {
			       return response.valid;
			   } );
		       };

		       $scope.fermer = function( sauvegarder ) {
			   var leave = true;
			   if ( sauvegarder ) {
			       var password_confirmed = true;
			       if ( !_($scope.password.old).isEmpty() && !_($scope.password.new1).isEmpty() ) {
				   if ( $scope.password.new1 == $scope.password.new2 ) {
				       $scope.current_user.previous_password = $scope.password.old;
				       $scope.current_user.new_password = $scope.password.new1;
				   } else {
				       password_confirmed = false;
				       toastr.error( 'Confirmation de mot de passe incorrecte.',
						     'Erreur',
						     { timeout: 100000 } );
				       leave = false;
				   }
			       }

			       if ( password_confirmed ) {
				   $scope.current_user.$update().then( function() {
				       if ( !_($scope.new_avatar).isNull() ) {
					   currentUser.avatar.upload( $scope.new_avatar )
					       .then( function( response ) {
						   $scope.current_user = response.data;
					       } );
				       } else if ( $scope.reset_avatar ) {
					   currentUser.avatar.delete()
					       .then( function( response ) {
						   $scope.current_user = response.data;
					       } );
				       }
				   } );
			       }
			   }

			   if ( leave ) {
			       $state.go( 'portail.logged' );
			   }
		       };
		   } ] );
