# coding: utf-8

require 'rubygems'
require 'bundler'
require 'sinatra/reloader'
require 'open-uri'
require 'uri'
require 'json'
require 'yaml'
require 'date'

Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

require_relative './lib/annuaire_wrapper'

require_relative './lib/AuthenticationHelpers'
require_relative './lib/ConfigHelpers'
require_relative './lib/UserHelpers'

# https://gist.github.com/chastell/1196800
class Hash
  def to_html
    [ '<ul>',
      map { |k, v|
        [ "<li><strong>#{k}</strong> : ", v.respond_to?(:to_html) ? v.to_html : "<span>#{v}</span></li>" ]
      },
      '</ul>' ].join
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
  helpers UserHelpers

  ##### routes #################################################################
  get "#{APP_PATH}/?" do
    erb :app
  end

  ##### API ####################################################################
  # {{{ API
  #
  # Gestion de session côtế client
  #
  get "#{APP_PATH}/api/user" do
    content_type :json

    return { user: '',
             info: {},
             is_logged: false }.to_json unless is_logged?

    user.full( env ).to_json
  end

  put "#{APP_PATH}/api/user" do
    content_type :json
    param :nom,            String,  required: false
    param :prenom,         String,  required: false
    param :sexe,           String,  required: false, in: %w(F M)
    param :date_naissance, Date,    required: false
    param :adresse,        String,  required: false
    param :code_postal,    Integer, required: false, within: 0..999_999
    param :ville,          String,  required: false
    # param :login,          String,  required: false
    # param :password,       String,  required: false
    # param :bloque,         Boolean, required: false

    AnnuaireWrapper::User.put( user.uid,
                               params )

    set_current_user( user.uid )

    user.full( env ).to_json
  end

  post "#{APP_PATH}/api/user/avatar/?" do
    content_type :json

    AnnuaireWrapper::User.put_avatar( user.uid,
                                     params[:image] ) if params[:image]

    set_current_user( user.uid )

    user.full( env ).to_json
  end

  delete "#{APP_PATH}/api/user/avatar/?" do
    content_type :json

    AnnuaireWrapper::User.delete_avatar( user.uid )

    set_current_user( user.uid )

    user.full( env ).to_json
  end

  put "#{APP_PATH}/api/user/profil_actif/?" do
    content_type :json
    param :profil_id, String, required: true
    param :uai, String, required: true

    AnnuaireWrapper::User.put_profil_actif( user.uid,
                                            params[:profil_id],
                                            params[:uai] )

    set_current_user( user.uid )

    user.full( env ).to_json
  end

  #
  # Classes et groupes de l'utilisateur
  #
  get "#{APP_PATH}/api/user/regroupements/?" do
    content_type :json
    mes_regpts = []

    rgpts = AnnuaireWrapper::User.get_regroupements( user.uid )
    uai_courant = user.profil_actif['uai']
    # Pour les classes
    # filtrer sur les regroupements de l'établissement courant.
    rgpts['classes']
      .reject { |r| r[ 'etablissement_code' ] != uai_courant }
      .uniq { |x| x['classe_id']}
      .sort_by { |r| r['classe_libelle'].to_s }
      .reverse # Pour avoir les 6eme avant les 3eme
      .each { |c|
        obj_cls = { nom: c['classe_libelle'], cls_id: c['classe_id'], uai: uai_courant, etablissement_nom: c['etablissement_nom']}
        mes_regpts.push obj_cls
      }.uniq! # supprime les doublons dûs aux matieres enseaignées qui peuvent être plusieurs pour une classe

      rgpts['groupes_eleves']
        .reject { |r| r[ 'etablissement_code' ] != uai_courant }
        .uniq { |x| x['groupe_id']}
        .sort_by { |r| r['groupe_libelle'].to_s }
        .each { |c|
        obj_grp = { nom: c['groupe_libelle'], cls_id: c['groupe_id'], uai: uai_courant, etablissement_nom: c['etablissement_nom'] }
        mes_regpts.push obj_grp
      }.uniq!
      # rgpts = ress_temp[groupes_libres].reject { |r| r[ 'etablissement_code' ] != uai_courant }

      # Associer les couleurs des carrés
      colorize( mes_regpts ).to_json
  end

  #
  # Service liste des applications
  #
  get "#{APP_PATH}/api/apps/default/?" do
    content_type :json

    return [] unless is_logged? && !user.profil_actif.nil?

    AnnuaireWrapper::Apps.query_defaults
                         .map do |app|
      default = config[:apps][:default][ app['id'].to_sym ]

      app.merge! default unless default.nil?

      app[ 'application_id' ] = app[ 'id' ]
      app.delete( 'id' )
      app[ 'type' ] = 'INTERNAL'

      app
    end.to_json
  end

  get "#{APP_PATH}/api/apps/?" do
    content_type :json

    STDERR.puts '/!\ FIXME WITH THE FORCE OF A THOUSAND SUNS!!!!'
    STDERR.puts '/!\ OH HAI!'
    STDERR.puts '/!\ U CAN HAZ APPS!'
    STDERR.puts '/!\ SO AWESOME!'
    STDERR.puts '/!\ Trève de plaisanterie ce pourrissage de log n\'a pour but'
    STDERR.puts '/!\ que de donner le temps aux bits d\'arriver à destination.'
    STDERR.puts '/!\ Dijkstra, pardonnez-leurs, ils ne savent pas ce qu\'ils font.'
    STDERR.puts '/!\ (désolé)'
    STDERR.puts '/!\ KTHXBYE.'

    return [] unless is_logged? && !user.profil_actif.nil?

    apps = AnnuaireWrapper::Etablissement::Apps.query_etablissement( user.profil_actif['uai'] )
                                               .map do |app|
      default = config[:apps][:default][ app['application_id'].to_sym ] unless app['application_id'].nil?

      unless default.nil?
        app[ 'icon' ] = default[ :icon ] if app[ 'icon' ].nil?
        app[ 'color' ] = default[ :color ] if app[ 'color' ].nil?
        app[ 'index' ] = default[ :index ] if app[ 'index' ] == -1
      end

      app
    end

    indexes = apps.map { |a| a['index'] }.sort
    duplicates = indexes.select { |e| indexes.count( e ) > 1 }.uniq
    free_indexes = (0..15).to_a - indexes

    duplicates.each do |i|
      unless free_indexes.empty?
        app = apps.select { |a| a['index'] == i }.last
        STDERR.puts "From #{app['index']}... "
        app['index'] = free_indexes.pop
        STDERR.puts "... to #{app['index']}"

        AnnuaireWrapper::Etablissement::Apps.update( app['id'], app )
      end
    end

    apps.to_json
  end

  get "#{APP_PATH}/api/apps/:id" do
    content_type :json
    param :id, Integer, required: true

    return [] unless is_logged? && !user.profil_actif.nil?

    AnnuaireWrapper::Etablissement::Apps.get( params[:id] ).to_json
  end

  post "#{APP_PATH}/api/apps/?" do
    content_type :json
    param :index, Integer, required: true
    param :type, String, required: true, in: %w(INTERNAL EXTERNAL)
    param :application_id, String, required: false
    param :libelle, String, required: false
    param :description, String, required: false
    param :url, String, required: false
    param :active, Boolean, required: false
    param :icon, String, required: false
    param :color, String, required: false

    AnnuaireWrapper::Etablissement::Apps.create( user.profil_actif['uai'], params ).to_json
  end

  put "#{APP_PATH}/api/apps/:id" do
    content_type :json
    param :id, Integer, required: true
    param :index, Integer, required: true
    param :active, Boolean, required: false
    param :url, String, required: false
    param :libelle, String, required: false
    param :description, String, required: false
    param :icon, String, required: false
    param :color, String, required: false

    AnnuaireWrapper::Etablissement::Apps.update( params[:id], params ).to_json
  end

  delete "#{APP_PATH}/api/apps/:id" do
    content_type :json
    param :id, Integer, required: true

    AnnuaireWrapper::Etablissement::Apps.delete( params[:id] ).to_json
  end

  #
  # Classes et groupes de l'utilisateur
  #
  get "#{APP_PATH}/api/regroupement_detail/:id" do
    content_type :json

    mes_amis = AnnuaireWrapper::Etablissement.regroupement_detail( params[:id] )
    mes_amis['eleves'] = mes_amis['eleves'].map { |e|
      e[ 'avatar' ] = ANNUAIRE[:url].gsub( %r{/api}, '/' ) + e[ 'avatar' ]

      e
    }

    colorize( mes_amis['eleves'] ).to_json
  end

  #
  # Agrégateur RSS
  #
  get "#{APP_PATH}/api/news/?" do
    content_type :json

    # THINK : Comment mettre des priorités sur les différents flux ?
    news = []

    fluxes = AnnuaireWrapper::Etablissement::Flux.query_etablissement( user.profil_actif['uai'] )
    fluxes = config[:news_feed] if fluxes.empty? || fluxes.nil?

    fluxes.each do |feed|
      feed = Hash[ feed.map { |k, v| [k.to_sym, v] } ]

      begin
        SimpleRSS.parse( open( feed[:flux] ) )
                 .items
                 .first( feed[:nb] )
                 .each do |article|
          article.each do |k, _|
            if article[k].is_a? String
              article[k] = URI.unescape( article[k] ).to_s.force_encoding( 'UTF-8' ).encode!
              article[k] = HTMLEntities.new.decode article[k]
            else
              next
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

  # get "#{APP_PATH}/api/notifications/?" do
  #   content_type :json

  #   # redirect login! unless is_logged?
  #   if is_logged?
  #     profil = user.profil_actif['type']
  #     uai = user.profil_actif['uai']
  #     etb = AnnuaireWrapper::Etablissement.get(uai)
  #     opts = { serveur: "#{APP_PATH}/faye",
  #              profil: profil,
  #              uai: uai,
  #              uid: user[:info].uid,
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
  # renvoi la version du portail
  #
  get "#{APP_PATH}/api/version/?" do
    content_type :text

    APP_VERSION
  end

  #
  # Ressources numériques de l'utilisateur
  #
  get "#{APP_PATH}/api/ressources_numeriques/?" do
    content_type :json

    ress_temp = AnnuaireWrapper::User.get_resources( user.uid )
    uai_courant = user.profil_actif['uai']
    # Ne prendre que les ressources de l'établissement courant.
    # Qui sont dans la fenêtre d'abonnement
    # Triées sur les types de ressources desc pour avoir 'MANUEL' en premier, puis 'DICO', puis 'AUTRES'
    ress_temp = ress_temp.reject { |r| r[ 'etablissement_code_uai' ] != uai_courant }
                         .reject { |r|  Date.parse( r['date_deb_abon'] ) >= Date.today }
                         .reject { |r|  Date.parse( r['date_fin_abon'] ) <= Date.today }
                         .sort_by { |r| r['type_ressource'].to_s }
                         .reverse
                         .each { |r|
      r['icone'] = '08_ressources.svg'
      r['icone'] = '05_validationcompetences.svg'  if r['type_ressource'] == 'MANUEL'
      r['icone'] = '07_blogs.svg'                  if r['type_ressource'] == 'AUTRE'
    }
    # Associer les couleurs des carrés
    colorize(ress_temp).to_json
  end
  # }}

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
