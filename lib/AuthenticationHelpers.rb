# -*- encoding: utf-8 -*-

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
      route = URI.escape(env['rack.url_scheme'] + '://' + env['HTTP_HOST'] + route)
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
    CasAuth::OPTIONS[:ssl] ? protocol = 'https://' : protocol = 'http://'

    puts protocol + CasAuth::OPTIONS[:host] + CasAuth::OPTIONS[:logout_url] + '?url=' + URI.encode( url )
    redirect protocol + CasAuth::OPTIONS[:host] + CasAuth::OPTIONS[:logout_url] + '?destination=' + URI.encode( url )
  end

  #
  # récupération des données envoyée par CAS
  #
  def set_current_user( env )
    session[:current_user] = { user: nil, info: nil }
    if session[:user]
      session[:current_user][:user] ||= session[:user]
      session[:current_user][:info] ||= session[:extra]
      session[:current_user][:info][:ENTStructureNomCourant] ||= session[:current_user][:ENTPersonStructRattachRNE]

      session[:current_user][:is_logged] = true
      user_annuaire = Annuaire.get_user( session[:current_user][:info][:uid] )
      session[:current_user][:sexe] = user_annuaire[:sexe]
      session[:current_user][:ENTStructureNomCourant] = user_annuaire[:ENTStructureNomCourant]
      session[:current_user][:profils] = user_annuaire['profils'].map.with_index {
        |profil, i|
        { index: i,
          type: profil['profil_id'],
          uai: profil['etablissement_code_uai'],
          etablissement: profil['etablissement_nom'],
          nom: profil['profil_nom'] }
      }
      session[:current_user][:profil_actif] = 0

    end
    session[:current_user]
  end

  #
  # Initialisation de la session après l'authentification
  #
  def init_session( env )
    session['init'] = true
    if session
      session[:user] = env['omniauth.auth'].extra.user
      session[:extra] = env['omniauth.auth'].extra
      session[:authenticated] = true
    end
    set_current_user env
  end

end
