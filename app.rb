# coding: utf-8

require 'rubygems'
require 'bundler'
require 'sinatra/reloader'
require 'open-uri'
require 'json'
require 'yaml'

Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

require_relative './config/options'

require_relative './lib/AuthenticationHelpers'
require_relative './lib/ConfigHelpers'
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
   helpers ConfigHelpers

   # routes
   get "#{APP_PATH}/" do
      erb :app
   end

   # {{{ API
   get "#{APP_PATH}/api/user" do
     return { user: '',
              info: { },
              is_logged: false }.to_json unless session[:authenticated]

      session[:current_user][:is_logged] = true
      session[:current_user][:extra] = Annuaire.get_user( session[:current_user][:info][:uid] )
      session[:current_user][:profils] = session[:current_user][:extra]['profils']
                                                     .map.with_index { |profil, i|
        { index: i,
          type: profil['profil_id'],
          uai: profil['etablissement_code_uai'],
          etablissement: profil['etablissement_nom'],
          nom: profil['profil_nom'] }
      }
      session[:current_user][:profil_actif] = 0

      # traitement des apps renvoyées par l'annuaire
      session[:current_user][:extra]['applications'].each {
         |application|
         config[ :apps ][ application[ 'id' ] ] = { nom: application[ 'description' ],
                                                      url: application[ 'url' ] }
         unless config[ :apps_tiles ][ application[ 'id' ] ].nil?
            config[ :apps_tiles ][ application[ 'id' ] ][ :active ] = application[ 'active' ] && application[ 'etablissement_code_uai' ] == session[:current_user][:profils][ session[:current_user][:profil_actif] ][ 'etablissement_code_uai' ]
            config[ :apps_tiles ][ application[ 'id' ] ][ :nom ] = application[ 'description' ]
            config[ :apps_tiles ][ application[ 'id' ] ][ :lien ] = "/portail/#/show-app?app=#{application[ 'id' ]}"
         end
      }
      session[:current_user][:apps] = config[:apps_tiles].map { |id, app|
         app[ :id ] = id
         app
      }

      session[:current_user].to_json
   end

   put "#{APP_PATH}/api/user/profil_actif/:index" do
     session[:current_user][:profil_actif] = params[ :index ].to_i

     session[:current_user].to_json
   end

   get "#{APP_PATH}/api/news" do
     rss = SimpleRSS.parse open( config[:url_news] )

      rss.items
      .first( 5 )
      .map { |news|
         news[:description] = news[:content] if news.has? :content
         news[:image] = news[:description].match( /http.*png/ )
         # news[:description] = HTML_Truncator.truncate( news[:description], 30 )

         news
      }.to_json
   end

   get "#{APP_PATH}/api/apps/:id" do
      config[ :apps ][ params[:id] ].to_json
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
      news[:description] = news[:description].to_s.encode( 'UTF-8', { invalid: :replace, undef: :replace, replace: '?' } )
      news[:description] = HTML_Truncator.truncate( news[:description], 30 )

end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
