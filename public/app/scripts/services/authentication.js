'use strict';
/* service authentication */
angular.module('services.authentication', []);
angular.module('services.authentication').factory('currentUser', function(){
    var currentUser = {} ; 
    currentUser.user = null; 
    currentUser.info = {};
    currentUser.etablissement = null; 
    return currentUser; 
});
