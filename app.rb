# coding: utf-8

require 'rubygems'
require 'bundler'
require 'sinatra/reloader'
require 'open-uri'
require 'json'

Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

require_relative './config/options'

require_relative './lib/AuthenticationHelpers'
require_relative './lib/annuaire'

# https://gist.github.com/chastell/1196800
class Hash
   def to_html
      [ '<ul>',
          map { |k, v|
             [ "<li><strong>#{k}</strong> : ", v.respond_to?(:to_html) ? v.to_html : "<span>#{v}</span></li>" ]
          },
          '</ul>'
      ].join
   end
end

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base

   configure do
      set :app_file, __FILE__
      set :root, APP_ROOT
      set :public_folder, proc { File.join( root, 'public' ) }
      set :inline_templates, true
      set :protection, true
   end

   configure :development do
      register Sinatra::Reloader
      # also_reload '/path/to/some/file'
      # dont_reload '/path/to/other/file'
   end

   helpers AuthenticationHelpers

   get "#{APP_PATH}/" do
      erb :app
   end

   # {{{ API
   get "#{APP_PATH}/api/user" do
      return { user: '',
                 info: { },
             is_logged: false }.to_json unless session[:authenticated]

      env['rack.session'][:current_user][:is_logged] = true
      env['rack.session'][:current_user][:extra] = Annuaire.get_user( env['rack.session'][:current_user][:info][:uid] )
      env['rack.session'][:current_user][:profils] = env['rack.session'][:current_user][:extra]['profils'].map {
         |profil|
         { type: profil['profil_id'],
             uai: profil['etablissement_code_uai'],
             etablissement: profil['etablissement_nom'],
             nom: profil['profil_nom'] }
      }
      env['rack.session'][:current_user][:profil_actif] = env['rack.session'][:current_user][:profils][0]

      env['rack.session'][:current_user].to_json
   end

   get "#{APP_PATH}/api/news" do
      rss = SimpleRSS.parse open('http://xkcd.com/rss.xml')

      rss.items
      .map {
         |news|

         news[:image] = news.description.match( /http.*png/ )[0]
         news
      }.to_json
   end

   get "#{APP_PATH}/api/apps/:id" do
      apps = { 'messagerie' => { nom: 'messagerie',
                                   url: 'http://www.perdu.com' },
                 'validationcompetences' => { nom: 'validation de competences',
                                                url: 'http://www.perdu.com' },
                 'trombi' => { nom: 'trombinoscope',
                                 url: 'http://www.perdu.com' },
                 'admin' => { nom: 'administration',
                                url: 'http://www.perdu.com' },
                 'documents' => { nom: 'documents',
                                    url: 'http://www.perdu.com' },
                 'thematiques' => { nom: 'thématiques',
                                      url: 'http://www.perdu.com' },
                 'suivi' => { nom: 'suivi des élèves',
                                url: 'http://www.perdu.com' },
                 'cahierdetextes' => { nom: 'cahier de textes',
                                         url: 'http://www.perdu.com' },
                 'blogs' => { nom: 'blogs',
                                url: 'http://www.perdu.com' },
                 'publipostage' => { nom: 'info familles',
                                       url: 'http://www.perdu.com' },
                 'notesabsences' => { nom: 'notes et absences',
                                        url: 'http://www.perdu.com' },
                 'ressources' => { nom: 'ressources numériques',
                                     url: 'http://www.perdu.com' },
                 'aide' => { nom: 'aide',
                               url: 'http://www.perdu.com' }
             }

      p params[:id]
      apps[ params[:id] ].to_json
   end
   # }}}

   # {{{ auth
   get "#{APP_PATH}/auth/:provider/callback" do
      init_session( request.env )
      redirect params[:url] if params[:url] !=  "#{env['rack.url_scheme']}://env['HTTP_HOST']#{APP_PATH}/"
      redirect APP_PATH + '/'
   end

   get "#{APP_PATH}/auth/failure" do
      erb :auth_failure
   end

   get "#{APP_PATH}/auth/:provider/deauthorized" do
      erb :auth_deauthorized
   end

   get "#{APP_PATH}/protected" do
      throw( :halt, [ 401, "Not authorized\n" ] ) unless session[:authenticated]
      erb :auth_protected
   end

   get "#{APP_PATH}/login" do
      login! "#{APP_PATH}/"
   end

   get "#{APP_PATH}/logout" do
      logout! "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{APP_PATH}/"
   end
   # }}}

end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
