'use strict';
angular.module( 'portailApp' )
  .run( [ '$templateCache',
    function( $templateCache ) {
      $templateCache.put( 'views/apps.html',
                          '<div class="row damier gris4"     data-ng-class="{\'modification\': modification}">    <hero konami-code="tetris()" konami-keys="[37, 38, 39, 40]"></hero>    <ul ui-sortable="sortable_options" data-ng-model="cases">	<li data-ng-repeat="case in cases | orderBy:\'index\'"	    class="col-xs-6 col-sm-4 col-md-3 col-lg-3 petite case"	    data-ng-class="{\'flip\': case.app.configure, \'empty hidden-xs hidden-sm\': !case.app || !case.app.id || !case.app.active}"	    data-ng-if="current_user.is_logged">	    <div class="front"		 data-ng-class="{ {{case.couleur}}: !case.app.id || ( !case.app.color && !case.app.new_color ) }"		 data-ng-style="case.app.colorize()">		<button class="btn btn-lg toggle-configure open-configure"			data-ng-if="modification && case.app && case.app.active"			data-ng-click="case.app.toggle_configure()">		    <span class="icone parametrer"></span>		</button>		<ng-color-picker class="couleurs"				 data-ng-click="case.app.is_dirty()"				 data-ng-if="modification && case.app && case.app.active"				 selected="case.app.color"				 colors="couleurs"></ng-color-picker>		<!-- Affichage normal -->		<!-- Lien vers app interne portail -->		<a data-ng-if="case.app.active && case.app.portail && !modification"		   data-ui-sref="{{ case.app.url }}"		   title="{{ case.app.description }}">		    <div data-ng-include="\'views/app-tile-content.html\'"></div>		</a>		<!-- Lien vers app laclasse.com -->		<a data-ng-if="case.app.active && !case.app.external && !case.app.portail && !modification"		   data-ui-sref="app.external({ app: case.app.application_id ? case.app.application_id : case.app.libelle })"		   title="{{ case.app.description }}">		    <div data-ng-include="\'views/app-tile-content.html\'"></div>		</a>		<!-- Lien vers site externe -->		<a data-ng-if="case.app.active && case.app.external && !modification"		   data-ng-href="{{ case.app.url }}"		   target="_blank"		   title="{{ case.app.description }}">		    <div data-ng-include="\'views/app-tile-content.html\'"></div>		</a>		<!-- Mode modification -->		<a data-ng-if="case.app.active && modification"		   title="{{ case.app.description }}">		    <div data-ng-include="\'views/app-tile-content.html\'"></div>		</a>	    </div>	    <div class="configure back blanc">		<button class="btn btn-lg toggle-configure close-configure"			data-ng-if="modification && case.app"			data-ng-click="case.app.toggle_configure()">		    <span class="icone visualiser"></span>		</button>		<button class="btn btn-xs btn-link remove glyphicon glyphicon-trash"			data-ng-click="case.app.remove()"></button>		<label>nom : <input type="text" class="form-control"				    data-ng-model="case.app.libelle"				    data-ng-change="case.app.is_dirty()" />		</label>		<label>description : <input type="text" class="form-control"					    data-ng-model="case.app.description"					    data-ng-change="case.app.is_dirty()" />		</label>		<label>url : <input type="text" class="form-control"				    data-ng-model="case.app.url"				    data-ng-change="case.app.is_dirty()" />		</label>	    </div>	</li>    </ul>    <!-- Mode normal -->    <span class="hidden-xs hidden-sm floating-button toggle big off blanc"	  data-ng-if="current_user.profil_actif.admin && !modification"	  data-ng-click="toggle_modification( !modification )"></span>    <!-- Mode modification -->    <span class="hidden-xs hidden-sm floating-button toggle big on gris4"	  data-ng-if="modification"></span>    <span class="floating-button small cancel gris3"	  data-ng-if="modification"	  data-ng-click="toggle_modification( false )"></span>    <span class="floating-button small save gris1"	  data-ng-if="modification"	  data-ng-click="toggle_modification( true )"></span>    <span class="floating-button small action1 add-app gris1"	  data-ng-if="modification"	  data-ng-click="add_tile()"></span></div>' );     } ] );