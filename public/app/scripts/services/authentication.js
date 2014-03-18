'use strict';

angular.module( 'portailApp.services.authentication', [  ] );
angular.module( 'portailApp.services.authentication' )
    .factory( 'currentUser',
	      function(  ){
		  var currentUser = {  } ;
		  currentUser.user = null;
		  currentUser.info = {  };
		  currentUser.etablissement = null;
		  return currentUser;
	      } );
