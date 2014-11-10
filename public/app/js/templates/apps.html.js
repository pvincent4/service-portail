'use strict';
angular.module( 'portailApp' )
  .run( [ '$templateCache',
    function( $templateCache ) {
      $templateCache.put( 'views/apps.html',
                          '<div class="row damier gris4"     data-ng-class="{\'modification\': modification}">    <ul ui-sortable="sortable_options" data-ng-model="cases">      <li data-ng-repeat="case in cases"	  class="col-xs-12 col-sm-6 col-md-3 col-lg-3 petite case {{ case.couleur }}"	  data-ng-if="current_user.is_logged">	<a class="animate toggle"	   data-ng-if="( case.app.active || modification ) && !case.app.configure"	   data-ng-class="{\'active\': case.app.active, \'inactive\': !case.app.active}"	   data-ui-sref="app-wrapper({ app: case.app.id })"	   title="{{ case.app.survol }}">	  <span class="compteur-notification orange-brillant"		data-ng-if="case.app.notifications > 0">{{case.app.notifications}}</span>	  <img data-ng-src="{{prefix}}/{{case.app.icone}}"	       data-ng-if="case.app.icone"/>	  <span class="app-name">{{ case.app.nom }}</span>	</a>	<div class="configure animate rotate-in" data-ng-if="modification && case.app.configure">	  <label>nom : <input type="text" class="form-control"			      data-ng-model="case.app.nom"			      data-ng-change="case.app.$update()"			      data-ng-delay="500"/>	  </label>	  <label>description : <input type="text" class="form-control"				      data-ng-model="case.app.survol"				      data-ng-change="case.app.$update()"				      data-ng-delay="500" />	  </label>	  <label>lien : <input type="text" class="form-control"			       data-ng-model="case.app.lien"			       data-ng-change="case.app.$update()"			       data-ng-delay="500" />	  </label>	  <div class="activation"	       data-ng-switcher	       data-ng-model="case.app.active"	       data-ng-change="case.app.$update()"></div>	</div>	<span class="glyphicon glyphicon-transfer btn-lg handle"	      data-ng-if="modification && !case.app.configure"></span>	<button class="btn btn-lg toggle-configure"		data-ng-class="{\'open-configure\': !case.app.configure, \'close-configure\': case.app.configure}"		data-ng-if="modification && case.app && case.app.id != \'AIDE\' && case.app.id != \'ADMIN\'"		data-ng-click="case.app.toggle_configure()">	  <span class="glyphicon glyphicon-cog"		data-ng-if="!case.app.configure"></span>	  <i class="fa fa-reply"	     data-ng-if="case.app.configure"></i>	</button>      </li>    </ul>    <span class="glyphicon glyphicon-wrench toggle-modification"	  data-ng-if="current_user.profil_actif.admin"	  data-ng-click="toggle_modification()"></span></div>' );     } ] );