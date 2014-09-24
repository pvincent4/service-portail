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

    if session[:user] && !user_annuaire.nil? && user_annuaire['profils'].select do |profil| profil['bloque'].nil? end.length > 0
      session[:current_user] = {
        user: session[:user],
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
        info: session[:extra],
        is_logged: true,
        avatar: ANNUAIRE[:url].gsub( %r{/api/app/}, '' ) + user_annuaire['avatar'],
        profils: user_annuaire['profils']
          .select do |profil| profil['bloque'].nil? end
          .map.with_index do |profil, i|
          # renommage de champs
          profil['index'] = i
          profil['type'] = profil['profil_id']
          profil['uai'] = profil['etablissement_code_uai']
          profil['etablissement'] = profil['etablissement_nom']
          profil['nom'] = profil['profil_nom']
          # calcule du droit d'admin, true pour les TECH et les ADM
          profil['admin'] = user_annuaire['roles'].select { |r| r['etablissement_code_uai'] == profil['etablissement_code_uai'] && ( r['role_id'] == 'TECH' || r['role_id'].match('ADM.*') ) }.length > 0
          profil
        end,
        profil_actif: user_annuaire['profils'].select { |p| p['actif'] }
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
    session[:user] = env['omniauth.auth'].extra.user
    session[:extra] = env['omniauth.auth'].extra
    session[:authenticated] = true

    set_current_user( env )
  end
end
