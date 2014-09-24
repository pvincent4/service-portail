'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailUserCtrl',
		 [ '$scope', '$state', '$upload', 'currentUser', 'APP_PATH',
		   function( $scope, $state, $upload, currentUser, APP_PATH ) {
		       $scope.prefix = APP_PATH;
		       $scope.groups = [ { ouvert: true,
					   enabled: true },
					 { ouvert: false,
					   enabled: false },
					 { ouvert: false,
					   enabled: false },
					 { ouvert: false,
					   enabled: false } ];

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
			   $scope.current_user.editable = _($scope.current_user.id_jointure_aaf).isNull();
			   $scope.current_user.date_naissance = _($scope.current_user).has('date_naissance') ? new Date( $scope.current_user.date_naissance ) : new Date();

			   $scope.new_avatar = function( files ) {
			       $scope.current_user.new_avatar = files[0];
			   };

			   $scope.enregistrer = function() {
			       if ( !_($scope.current_user.new_avatar).isNull() ) {
				   $upload.upload( {
				       url: APP_PATH + '/api/user/avatar',
				       method: 'POST',
				       file: $scope.current_user.new_avatar
				   } );
			       }

			       $scope.current_user.$update();

			       $state.go( 'portail.logged' );
			   };

			   $scope.annuler = function() {
			       $state.go( 'portail.logged' );
			   };
		       });
		   } ] );
