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
  def set_current_user( env )
    session[:current_user] = { user: nil,
                               info: nil,
                               is_logged: false }

    user_annuaire = Annuaire.get_user( session[:extra][:uid] )

    if session[:user] && !user_annuaire.nil?
      session[:current_user][:user] ||= session[:user]
      session[:current_user][:info] ||= session[:extra]
      session[:current_user][:info][:ENTStructureNomCourant] ||= session[:current_user][:ENTPersonStructRattachRNE]

      session[:current_user][:is_logged] = true
      session[:current_user][:sexe] = user_annuaire['sexe']
      session[:current_user][:avatar] = ANNUAIRE[:url].gsub(/\/api\/app/, '') + user_annuaire['avatar']
      # session[:current_user][:avatar] = ANNUAIRE[:url].gsub( %{/\/api\/app/}, '' ) + user_annuaire['avatar']
      # session[:current_user][:ENTStructureNomCourant] = user_annuaire['ENTStructureNomCourant']
      session[:current_user][:profils] = user_annuaire['profils'].map.with_index do
        |profil, i|
        # renommage de champs
        profil['index'] = i
        profil['type'] = profil['profil_id']
        profil['uai'] = profil['etablissement_code_uai']
        profil['etablissement'] = profil['etablissement_nom']
        profil['nom'] = profil['profil_nom']

        # calcule du droit d'admin, true pour les TECH et les ADM
        profil['admin'] = user_annuaire['roles'].select { |r| r['etablissement_code_uai'] == profil['etablissement_code_uai'] && ( r['role_id'] == 'TECH' || r['role_id'].match('ADM.*') ) }.length > 0

        profil
      end
      session[:current_user][:profil_actif] = session[:current_user][:profils].select { |p| p['actif'] }

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
