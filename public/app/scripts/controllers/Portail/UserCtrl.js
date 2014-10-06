'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailUserCtrl',
		 [ '$scope', '$state', 'current_user', 'currentUser', 'APP_PATH',
		   function( $scope, $state, current_user, currentUser, APP_PATH ) {
		       $scope.prefix = APP_PATH;
		       $scope.groups = [ { ouvert: true,
					   enabled: true },
					 { ouvert: false,
					   enabled: false },
					 { ouvert: false,
					   enabled: false },
					 { ouvert: false,
					   enabled: false } ];

		       $scope.current_user = current_user;
		       $scope.current_user.editable = _($scope.current_user.id_jointure_aaf).isNull();

		       $scope.new_avatar = function( flowFile ) {
			   $scope.current_user.new_avatar = flowFile.file;
		       };

		       $scope.fermer = function( sauvegarder ) {
			   if ( sauvegarder ) {
			       if ( !_($scope.current_user.new_avatar).isNull() ) {
				   currentUser.avatar.upload( $scope.current_user.new_avatar );
			       }

			       $scope.current_user.$update();
			   }

			   $state.go( 'portail.logged' );
		       };
		   } ] );
