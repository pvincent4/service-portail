# -*- encoding: utf-8 -*-
require 'annuaire'

module Laclasse
  module Helpers
    module Authentication
      def logged?
        session[:authenticated]
      end

      #
      # Log l'utilisateur puis redirige vers 'auth/:provider/callback' qui se charge
      #   d'initialiser la session et de rediriger vers l'url passée en paramètre
      #
      def login!( route )
        unless route.empty?
          route += "?#{env['QUERY_STRING']}" unless env['QUERY_STRING'].empty?
          route = URI.escape( "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{route}" )
          redirect "#{APP_PATH}/auth/cas?url=#{URI.encode( route )}"
        end

        redirect "#{APP_PATH}/auth/cas"
      end

      #
      # Délogue l'utilisateur du serveur CAS et de l'application
      #
      def logout!( url )
        url += "?#{env['QUERY_STRING']}" unless env['QUERY_STRING'].empty?
        session[:authenticated] = false
        session[:current_user] = nil
        protocol = CASAUTH::CONFIG[:ssl] ? 'https://' : 'http://'

        redirect "#{protocol}#{CASAUTH::CONFIG[:host]}#{CASAUTH::CONFIG[:logout_url]}?destination=#{URI.encode(url)}"
      end

      #
      # Récupération des données de l'annuaire concernant l'utilisateur
      #
      def init_current_user( uid )
        session[:current_user] = { user: session[:user].nil? ? nil : session[:user],
                                   info: session[:extra].nil? ? nil : session[:extra],
                                   is_logged: !session[:user].nil? }

        user_annuaire = Laclasse::Annuaire.send_request_signed( :service_annuaire_user, "#{uid}", 'expand' => 'true' )
        unless user_annuaire.nil?
          session[:current_user].merge!( uid: user_annuaire['id_ent'],
                                         login: user_annuaire['login'],
                                         sexe: user_annuaire['sexe'],
                                         nom: user_annuaire['nom'],
                                         prenom: user_annuaire['prenom'],
                                         date_naissance: user_annuaire['date_naissance'],
                                         adresse: user_annuaire['adresse'],
                                         code_postal: user_annuaire['code_postal'],
                                         ville: user_annuaire['ville'],
                                         bloque: user_annuaire['bloque'],
                                         id_jointure_aaf: user_annuaire['id_jointure_aaf'],
                                         avatar: ANNUAIRE[:url].gsub( %r{/api}, '/' ) + user_annuaire['avatar'],
                                         roles_max_priority_etab_actif: user_annuaire['roles_max_priority_etab_actif'],
                                         user_detailed: user_annuaire
                                       )
        end

        session[:current_user]
      end

      #
      # Initialisation de la session après l'authentification
      #
      def init_session( env )
        session[:user] = env['omniauth.auth'].extra.user
        session[:extra] = env['omniauth.auth'].extra
        session[:authenticated] = true

        init_current_user( env['omniauth.auth']['extra']['uid'] )
      end
    end
  end
end
