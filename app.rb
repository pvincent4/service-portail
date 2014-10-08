# coding: utf-8

require 'rubygems'
require 'bundler'
require 'sinatra/reloader'
require 'open-uri'
require 'uri'
require 'json'
require 'yaml'

Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

require_relative './lib/AuthenticationHelpers'
require_relative './lib/ConfigHelpers'
require_relative './lib/annuaire'

# https://gist.github.com/chastell/1196800
class Hash
  def to_html
    ['<ul>',
     map { |k, v|
       [ "<li><strong>#{k}</strong> : ", v.respond_to?(:to_html) ? v.to_html : "<span>#{v}</span></li>" ]
     },
     '</ul>'
    ].join
  end
end

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base
  @ent_notifs = []

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

  helpers Sinatra::Param

  helpers AuthenticationHelpers
  helpers ConfigHelpers

  # routes
  get "#{APP_PATH}/?" do
    erb :app
  end

  # {{{ API
  #
  # Gestion de session côtế client
  #
  get "#{APP_PATH}/api/user" do
    content_type :json

    return { user: '',
             info: {},
             is_logged: false }.to_json unless is_logged?

    set_current_user( env )
    session[:current_user].to_json
  end

  put "#{APP_PATH}/api/user" do
    content_type :json

    # param :login,          String,  required: false
    # param :password,       String,  required: false
    # param :bloque,         Boolean, required: false
    param :nom,            String,  required: false
    param :prenom,         String,  required: false
    param :sexe,           String,  required: false, in: [ 'F', 'M' ]
    param :date_naissance, Date,    required: false
    param :adresse,        String,  required: false
    param :code_postal,    Integer, required: false, within: 0..999_999
    param :ville,          String,  required: false

    Annuaire.put_user( session[:current_user][:info][:uid],
                       params )

    set_current_user( env )

    session[:current_user].to_json
  end

  post "#{APP_PATH}/api/user/avatar/?" do
    content_type :json

    Annuaire.put_user_avatar( session[:current_user][:info][:uid],
                              File.read( params[:image][:tempfile] ) )

    set_current_user( env )

    session[:current_user].to_json
  end

  delete "#{APP_PATH}/api/user/avatar/?" do
    content_type :json

    Annuaire.delete_user_avatar( session[:current_user][:info][:uid] )

    set_current_user( env )

    session[:current_user].to_json
  end

  put "#{APP_PATH}/api/user/profil_actif/?" do
    content_type :json

    param :profil_id, String, required: true
    param :uai, String, required: true

    Annuaire.put_user_profil_actif( session[:current_user][:info][:uid],
                                    params[:profil_id],
                                    params[:uai] )

    set_current_user( env )

    session[:current_user].to_json
  end

  #
  # Agrégateur RSS
  #
  get "#{APP_PATH}/api/news" do
    content_type :json

    # THINK : Comment mettre des priorités sur les différents flux ?
    news = []
    config[:news_feed].each do |feed|
      begin
        SimpleRSS.parse( open( feed[:flux] ) )
                 .items
                 .first( feed[:nb] )
                 .each do |article|
          article.each do |k, _|
            if article[k].is_a? String
              article[k] = URI.unescape( article[k] ).to_s.force_encoding( 'UTF-8' ).encode!
              article[k] = HTMLEntities.new.decode article[k]
            end
          end
          article[:description] = article[:content_encoded] if article.has? :content_encoded
          article[:image] = article[:content]
          article[:orderby] =  article[:pubDate].to_i
          article[:pubDate] = article[:pubDate].strftime '%d/%m/%Y'
          news << article
        end
      rescue
        puts "impossible d'ouvrir #{feed[:flux]}"
      end
    end

    news.uniq! { |article| article[:description] }

    # Tri anté-chronologique
    news.sort! { |n1, n2| n2.orderby <=> n1.orderby }

    news.to_json
  end

  # get "#{APP_PATH}/api/notifications" do
  #   content_type :json

  #   # redirect login! unless is_logged?
  #   if is_logged?
  #     profil = session[:current_user][:profil_actif][ 0 ]['type']
  #     uai = session[:current_user][:profil_actif][ 0 ]['uai']
  #     etb = Annuaire.get_etablissement(uai)
  #     opts = { serveur: "#{APP_PATH}/faye",
  #              profil: profil,
  #              uai: uai,
  #              uid: session[:current_user][:info].uid,
  #              classes: etb['classes'].map { |c| c['libelle'] },
  #              groupes: etb['groupes_eleves'].map { |g| g['libelle'] },
  #              groupes_libres: etb['groupes_libres'].map { |g| g['libelle'] }
  #            }
  #     @ent_notifs = EntNotifs.new opts
  #     #### @ent_notifs.notifier(:moi, "Salut tous le monde !")
  #     @ent_notifs.my_channels.to_json
  #   end
  # end

  #
  # Service liste des applications
  #
  get "#{APP_PATH}/api/apps" do
    content_type :json

    return config[ :apps_publiques ].to_json unless is_logged? && !session[:current_user][:profil_actif].first.nil?

    user_applications = Annuaire.get_user( session[:current_user][:info][:uid] )['applications']
    uai_courant = session[:current_user][:profil_actif].first['uai']

    # traitement des apps renvoyées par l'annuaire
    user_applications
      .reject { |a| a[ 'etablissement_code_uai' ] != uai_courant }
      .each { |application|
      config_apps = config[ :apps_tiles ][ application[ 'id' ].to_sym ]
      unless config_apps.nil?
        # On regarde si le profils actif de l'utilisateur comporte le code détablissement pour lequel l'application est activée
        config_apps[ :active ] = application[ 'active' ] || ( application[ 'id' ] == 'ADMIN' && session[:current_user][:profil_actif][0]['admin'] )
        config_apps[ :nom ] = application[ 'libelle' ]
        config_apps[ :survol ] = application[ 'description' ]
        config_apps[ :lien ] = "#{APP_PATH}/#/show-app?app=#{application[ 'id' ]}"
        config_apps[ :url ] = application[ 'url' ].to_s.start_with?( 'http' ) ? application[ 'url' ] : "#{URL_ENT}#{application[ 'url' ]}"

        # Gérer les notifications sur chaque application
        config_apps[ :notifications ] = 0
        # THINK : Peut-être qu'il faut faire ce travail côté client AngularJS, afin de le rendre asynchrone et non bloquant.
        unless config_apps[ :url_notif ].empty?
          resp = Net::HTTP.get_response(URI.parse config_apps[ :url_notif ])
          config_apps[ :notifications ] = resp.body if resp.body.is_a? Numeric
        end
      end
    }

    config[:apps_tiles].map { |id, app|
      app[ :id ] = id
      app
    }.to_json
  end

  get "#{APP_PATH}/api/version" do
    content_type :text

    APP_VERSION
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
    throw( :halt, [ 401, "Not authorized\n" ] ) unless is_logged?
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
