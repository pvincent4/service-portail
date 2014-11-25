# -*- encoding: utf-8 -*-
require 'pry'
module AuthenticationHelpers

  def is_logged?
    session[:authenticated]
  end

  #
  # Log l'utilisateur puis redirige vers 'auth/:provider/callback' qui se charge
  #   d'initialiser la session et de rediriger vers l'url passée en paramètre
  #
  def login!( route )
    unless route.empty?
      route += '?' + env['QUERY_STRING'] unless env['QUERY_STRING'].empty?
      route = URI.escape(request.scheme + '://' + env['HTTP_HOST'] + route)
      redirect  APP_PATH + "/auth/cas?url=#{URI.encode( route )}"
    end
    redirect APP_PATH + '/auth/cas'
  end

  #
  # Délogue l'utilisateur du serveur CAS et de l'application
  #
  def logout!( url )
    session[:authenticated] = false
    session[:current_user] = nil
    CASAUTH::CONFIG[:ssl] ? protocol = 'https://' : protocol = 'http://'

    puts protocol + CASAUTH::CONFIG[:host] + CASAUTH::CONFIG[:logout_url] + '?url=' + URI.encode( url )
    redirect protocol + CASAUTH::CONFIG[:host] + CASAUTH::CONFIG[:logout_url] + '?destination=' + URI.encode( url )
  end

  #
  # récupération des données envoyée par CAS
  #
  def set_current_user( uid )
    session[:current_user] = { user: nil,
                               info: nil,
                               is_logged: false }

    user_annuaire = AnnuaireWrapper.get_user( uid )

    if session[:user] && !user_annuaire.nil?
      session[:current_user] = { user: session[:user],
                                 uid: user_annuaire['id_ent'],
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
                                 is_logged: true,
                                 avatar: ANNUAIRE[:url].gsub( %r{/api}, '/' ) + user_annuaire['avatar']
                               }
    end

    session[:current_user].each do |key, _value|
      session[:current_user][ key ] = URI.unescape( session[:current_user][ key ] ) if session[:current_user][ key ].is_a? String
    end

    session[:current_user]
  end

  #
  # Initialisation de la session après l'authentification
  #
  def init_session( env )
    session['init'] = true
    session[:user] ||= env['omniauth.auth']['extra']['user']
    session[:authenticated] = true

    set_current_user( env['omniauth.auth']['extra']['uid'] )
  end
end
