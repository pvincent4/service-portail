# coding: utf-8

ENV['RACK_ENV'] = 'development'
namespace :preprocess_assets do
  task :load_config do
    require 'rubygems'
    require 'bundler'

    Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

    require_relative '../lib/uglify'
  end

  desc 'Everything'
  task all: [ :templates, :js, :css ]

  desc 'For development deployement'
  task development: [ :templates, :css ]

  desc 'For production deployement'
  task production: [ :templates, :js, :css ]

  desc 'Javascriptify templates'
  task templates: :load_config do
    STDERR.puts 'Compilation of angular templates into javascript files'
    Dir.glob( 'public/app/views/*.html' )
       .each do |fichier|
      target = "#{fichier.gsub( /views/, 'js/templates' )}.js"
      template_name = fichier.gsub( %r{public/app/}, '' )
      template = File.read( fichier )

      # un peu de travail d'escaping sur le contenu HTML
      # suppression des retour à la ligne
      template.tr!( "\n", '' )
      # escaping des apostrophes
      template.gsub!(/'/){ %q(\') }

      # élimination du précédent template JS si besoin
      File.delete( target ) if File.exist?( target )

      # génération du template JS
      File.open( target, 'w' ) do |target_file|
        target_file.write "'use strict';\n"
        target_file.write "angular.module( 'portailApp' )\n"
        target_file.write "  .run( [ '$templateCache',\n"
        target_file.write "    function( $templateCache ) {\n"
        target_file.write "      $templateCache.put( '#{template_name}',\n"
        target_file.write "                          '#{template}' ); "
        target_file.write '    } ] );'
      end
    end
  end

  desc 'Minify CSS using Sass'
  task css: :load_config do
    STDERR.puts 'Sassification of vendor CSS'
    uglified = Sass.compile( [ 'public/app/vendor/bootstrap/dist/css/bootstrap-theme.min.css',
                               'public/app/vendor/ngAnimate/css/ng-animation.css',
                               'public/app/vendor/ng-switcher/dist/ng-switcher.css',
                               'public/app/vendor/charte-graphique-laclasse-com/css/main.css',
                               'public/app/vendor/charte-graphique-laclasse-com/css/bootstrap-theme.css',
                               'public/app/vendor/ng-color-picker/color-picker.css' ]
                             .map { |fichier| File.read( fichier ) }.join,
                             syntax: :scss,
                             style: :compressed )
    File.open( './public/app/vendor/vendor.min.css', 'w' )
        .write( uglified )

    STDERR.puts 'Sassification of application CSS'
    uglified = Sass.compile( [ 'public/app/css/main.scss' ]
                             .map { |fichier| File.read( fichier ) }.join,
                             syntax: :scss,
                             style: :compressed )
    File.open( './public/app/css/portail.min.css', 'w' )
        .write( uglified )
  end

  desc 'Minify JS using Uglifier'
  task js: :load_config do
    STDERR.puts 'Uglification of vendor Javascript'
    uglified, source_map = Uglify.those_files_with_map( [ 'public/app/vendor/jquery/dist/jquery.js',
                                                          'public/app/vendor/jquery-ui/jquery-ui.js',
                                                          'public/app/vendor/underscore/underscore.js',
                                                          'public/app/vendor/moment/moment.js',
                                                          'public/app/vendor/moment/locale/fr.js',
                                                          'public/app/vendor/ng-file-upload/angular-file-upload-shim.js',
                                                          'public/app/vendor/angular/angular.js',
                                                          'public/app/vendor/angular-i18n/angular-locale_fr-fr.js',
                                                          'public/app/vendor/angular-resource/angular-resource.js',
                                                          'public/app/vendor/angular-moment/angular-moment.js',
                                                          'public/app/vendor/angular-touch/angular-touch.js',
                                                          'public/app/vendor/angular-ui-router/release/angular-ui-router.js',
                                                          'public/app/vendor/angular-ui-sortable/sortable.js',
                                                          'public/app/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
                                                          'public/app/vendor/angular-animate/angular-animate.js',
                                                          'public/app/vendor/angular-delay/build/angular-delay.js',
                                                          'public/app/vendor/ng-file-upload/angular-file-upload.js',
                                                          'public/app/vendor/ng-switcher/dist/ng-switcher.js',
                                                          'public/app/vendor/ng-flow/dist/ng-flow-standalone.js',
                                                          'public/app/vendor/ng-color-picker/color-picker.js',
                                                          'public/app/vendor/angular-carousel/dist/angular-carousel.js',
                                                          'public/app/vendor/ngFitText/src/ng-FitText.js',
                                                          'public/app/vendor/angular-konami/angular-konami.js',
                                                          'public/app/vendor/blockrain/dist/blockrain.jquery.js' ] )
    File.open( './public/app/vendor/vendor.min.js', 'w' )
        .write( uglified )
    File.open( './public/app/vendor/vendor.min.js.map', 'w' )
        .write( source_map )

    STDERR.puts 'Uglification of application Javascript'
    uglified, source_map = Uglify.those_files_with_map( Dir.glob( 'public/app/js/**/*.js' )
                                                           .reject { |fichier| /min\.js$/.match fichier }
                                                           .sort )
    File.open( './public/app/js/portail.min.js', 'w' )
        .write( uglified )
    File.open( './public/app/js/portail.min.js.map', 'w' )
        .write( source_map )
  end
end
