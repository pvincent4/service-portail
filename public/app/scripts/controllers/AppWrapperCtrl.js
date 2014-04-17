'use strict';

angular.module('portailApp.controllers')
        .controller('AppWrapperCtrl',
                ['$scope', '$http', '$stateParams', '$sce', 'currentUser', 'APPLICATION_PREFIX',
                    function($scope, $http, $stateParams, $sce, currentUser, APPLICATION_PREFIX) {
                           $scope.prefix = APPLICATION_PREFIX;
			   $scope.menu = [{icone: 'logolaclasse.svg',
                                texte: 'retour au portail',
                                lien: APPLICATION_PREFIX + '/'},
                            {icone: '12_aide.svg',
                                texte: 'aide',
                                lien: APPLICATION_PREFIX + '/'},
                            {icone: '12_aide.svg',
                                texte: 'se déconnecter',
                                lien: APPLICATION_PREFIX + '/logout'}];

                        currentUser.get().then(function(response) {
                            $scope.current_user = response;

                            currentUser.apps().then(function(response) {
                                var app = _(response).findWhere({id: $stateParams.app});
                                $scope.app = {nom: app.nom,
                                    url: $sce.trustAsResourceUrl(app.url)};
                            });
                        });
                    }]);
