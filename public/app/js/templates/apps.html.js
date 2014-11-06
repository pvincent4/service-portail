'use strict';
angular.module( 'portailApp' )
  .run( [ '$templateCache',
    function( $templateCache ) {
      $templateCache.put( 'views/apps.html',
                          '<div class="row damier gris4">  <div data-ng-repeat="case in cases"       class="col-xs-12 col-sm-6 col-md-3 col-lg-3 petite case {{ case.couleur }}"       data-ng-if="current_user.is_logged">    <a class="animate rotate-in"       data-ng-if="case.app.active && !case.app.configure"       data-ui-sref="app-wrapper({ app: case.app.id })"       title="{{ case.app.survol }}">      <span class="compteur-notification orange-brillant"	    data-ng-if="case.app.notifications > 0">{{case.app.notifications}}</span>      <img data-ng-src="{{prefix}}/{{case.app.icone}}"	   data-ng-if="case.app.icone"/>      <span class="app-name">{{ case.app.nom }}</span>    </a>    <div class="configure animate rotate-in" data-ng-if="case.app.active && case.app.configure">      <label>nom : <input type="text" class="form-control" data-ng-model="case.app.nom" /></label>      <label>description : <input type="text" class="form-control" data-ng-model="case.app.survol" /></label>      <label>lien : <input type="text" class="form-control" data-ng-model="case.app.lien" /></label>      <div class="activation"	   ng-switcher	   ng-model="case.app.tmp_active"></div>    </div>    <button class="btn btn-lg toggle-configure"	    data-ng-class="{\'open-configure\': !case.app.configure, \'close-configure\': case.app.configure}"	    data-ng-if="case.app.active && current_user.profil_actif.admin && case.app.id != \'AIDE\' && case.app.id != \'ADMIN\'"	    data-ng-click="case.app.toggle_configure()">      <span class="glyphicon glyphicon-cog"	    data-ng-if="!case.app.configure"></span>      <i class="fa fa-reply"	 data-ng-if="case.app.configure"></i>    </button>  </div></div>' );     } ] );