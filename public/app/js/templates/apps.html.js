'use strict';
angular.module( 'portailApp' )
  .run( [ '$templateCache',
    function( $templateCache ) {
      $templateCache.put( 'views/apps.html',
                          '<div class="row damier gris4"     data-ng-class="{\'modification\': modification}">    <ul ui-sortable="sortable_options" data-ng-model="cases">	<li data-ng-repeat="case in cases | orderBy:\'index\'"	    class="col-xs-6 col-sm-4 col-md-3 col-lg-3 petite case"	    data-ng-class="{\'flip\': case.app.configure, \'empty hidden-xs hidden-sm\': !case.app || !case.app.id || !case.app.active}"	    data-ng-if="current_user.is_logged">	    <div class="front"		 data-ng-class="{ {{case.couleur}}: !case.app.id || ( !case.app.color && !case.app.new_color ) }"		 data-ng-style="case.app.colorize()">		<button class="btn btn-lg toggle-configure open-configure"			data-ng-if="modification && case.app && case.app.active"			data-ng-click="case.app.toggle_configure()">		    <span class="icone parametrer"></span>		</button>		<!-- Affichage normal -->		<a data-ng-if="case.app.active && !modification"		   data-ui-sref="app-wrapper({ app: case.app.application_id })"		   title="{{ case.app.description }}">		    <span class="compteur-notification orange-brillant"			  data-ng-if="case.app.notifications > 0" data-ng-cloak>{{case.app.notifications}}</span>		    <img class="icone" data-ng-src="{{prefix}}/{{case.app.icon}}"			 data-ng-if="case.app.icon"/>		    <div class="icone"			 data-fittext			 data-ng-if="!case.app.icon">			{{case.app.libelle[0]}}		    </div>		    <span class="app-name" data-ng-cloak>{{ case.app.libelle }}</span>		</a>		<!-- Mode modification -->		<a data-ng-if="case.app.active && modification"		   title="{{ case.app.description }}">		    <span class="compteur-notification orange-brillant"			  data-ng-if="case.app.notifications > 0" data-ng-cloak>{{case.app.notifications}}</span>		    <img class="icone" data-ng-src="{{prefix}}/{{case.app.icon}}"			 data-ng-if="case.app.icon"/>		    <div class="icone"			 data-fittext			 data-ng-if="!case.app.icon">			{{case.app.libelle[0]}}		    </div>		    <span class="app-name" data-ng-cloak>{{ case.app.libelle }}</span>		</a>	    </div>	    <div class="configure back blanc">		<button class="btn btn-lg toggle-configure close-configure"			data-ng-if="modification && case.app"			data-ng-click="case.app.toggle_configure()">		    <span class="icone visualiser"></span>		</button>		<label>nom : <input type="text" class="form-control"				    data-ng-model="case.app.libelle"				    data-ng-change="case.app.is_dirty()" />		</label>		<label>description : <input type="text" class="form-control"					    data-ng-model="case.app.description"					    data-ng-change="case.app.is_dirty()" />		</label>		<label data-ng-click="case.app.is_dirty()">		    <ng-color-picker selected="case.app.color"				     colors="couleurs"></ng-color-picker>		</label>		<button class="btn btn-danger remove"			data-ng-click="case.app.remove()">Supprimer</button>	    </div>	</li>    </ul>    <!-- Mode normal -->    <span class="hidden-xs hidden-sm bouton-modification toggle"	  data-ng-class="{\'blanc\': !modification, \'gris4\': modification}"	  data-ng-if="current_user.profil_actif.admin"	  data-ng-click="toggle_modification( !modification )"></span>    <!-- Mode modification -->    <span class="bouton-modification cancel gris3"	  data-ng-if="modification"	  data-ng-click="toggle_modification( false )"></span>    <span class="bouton-modification save gris1"	  data-ng-if="modification"	  data-ng-click="toggle_modification( true )"></span>    <span class="bouton-modification add-app gris1"	  data-ng-if="modification"	  data-ng-click="add_tile()"></span></div>' );     } ] );