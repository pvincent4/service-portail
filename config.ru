# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))

# require 'redis'
# require 'faye'
# require 'faye/redis'

require './config/init'
require 'app'

require './lib/uglify'

# Faye::WebSocket.load_adapter('thin')

# Compile à la volée les templates en fichiers javascripts
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

if ENV['RACK_ENV'] == 'production'
  # Minifie les CSS
  STDERR.puts 'Sassification of vendor CSS'
  uglified = Sass.compile( [ 'public/app/vendor/bootstrap/dist/css/bootstrap.min.css',
                             'public/app/vendor/bootstrap/dist/css/bootstrap-theme.min.css',
                             'public/app/vendor/angular-carousel/dist/angular-carousel.min.css',
                             'public/app/vendor/ngAnimate/css/ng-animation.css',
                             'public/app/vendor/charte-graphique-laclasse-com/css/main.css' ]
                           .map { |fichier| File.read( fichier ) }.join,
                           syntax: :scss,
                           style: :compressed )
  File.open( './public/app/vendor/vendor.min.css', 'w' )
      .write( uglified )

  STDERR.puts 'Sassification of application CSS'
  uglified = Sass.compile( [ 'public/app/css/main.css',
                             'public/app/css/other-devices.css']
                           .map { |fichier| File.read( fichier ) }.join,
                           syntax: :scss,
                           style: :compressed )
  File.open( './public/app/css/portail.min.css', 'w' )
      .write( uglified )

  #Minifie les JS
  STDERR.puts 'Uglification of vendor Javascript'
  uglified, source_map = Uglify.those_files_with_map( [ 'public/app/vendor/jquery/dist/jquery.js',
                                                        'public/app/vendor/jquery-ui/jquery-ui.js',
                                                        'public/app/vendor/underscore/underscore.js',
                                                        'public/app/vendor/ng-file-upload/angular-file-upload-shim.js',
                                                        'public/app/vendor/angular/angular.js',
                                                        'public/app/vendor/angular-i18n/angular-locale_fr-fr.js',
                                                        'public/app/vendor/angular-resource/angular-resource.js',
                                                        'public/app/vendor/angular-touch/angular-touch.js',
                                                        'public/app/vendor/angular-ui-router/release/angular-ui-router.js',
                                                        'public/app/vendor/angular-carousel/dist/angular-carousel.js',
                                                        'public/app/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
                                                        'public/app/vendor/angular-animate/angular-animate.js',
                                                        'public/app/vendor/angular-ui-date/src/date.js',
                                                        'public/app/vendor/ng-file-upload/angular-file-upload.js',
                                                        'public/app/vendor/ng-flow/dist/ng-flow-standalone.js' ] )
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

use Rack::Rewrite do
  rewrite %r{^#{APP_PATH}(/app/(js|css|vendor)/.*(map|css|js|ttf|woff|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '$1'
end

use Rack::Session::Cookie,
    key: 'rack.session',
    path: APP_PATH,
    expire_after: 3600, # In seconds
    secret: '#{SESSION_KEY}'

use OmniAuth::Builder do
  configure do |config|
    config.path_prefix = "#{APP_PATH}/auth"
    config.full_host = CASAUTH::CONFIG[:full_host]

  end
  provider :cas, CASAUTH::CONFIG
end

#use Faye::RackAdapter, NOTIFICATIONS

#bayeux = Faye::RackAdapter.new(:mount => "#{APP_PATH}/faye",
#                                  :timeout => 25,
#                                  :engine => { :type => Faye::Redis, :host => 'localhost', :port => 6379 })
#run bayeux
#bayeux.on(:subscribe) { | client_id, channel |
#        puts client_id.to_s + " has subscribed to channel '" + channel.to_s + "'"
#    }

run SinatraApp
