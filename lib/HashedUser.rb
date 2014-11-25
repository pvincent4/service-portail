# encoding: utf-8

require_relative './annuaire_wrapper'
require_relative './HashIt'

class HashedUser < HashIt
  def is?( profil )
    # FIXME
    profils = AnnuaireWrapper.get_user( @uid )['profils']
    @ENTPersonProfils.include? "#{profil}:#{profils[0]['uai']}"
  end

  def admin?
    # FIXME
    u_a = AnnuaireWrapper.get_user( @uid )
    profil_actif = u_a['profils'].select { |p| p['actif'] }.first
    u_a['roles']
      .select { |r|
      r['etablissement_code_uai'] == profil_actif['etablissement_code_uai'] &&
        ( r['role_id'] == 'TECH' ||
          r['role_id'].match('ADM.*') )
    }
      .length > 0
  end

  def profils
    user_annuaire = AnnuaireWrapper.get_user( uid )
    user_annuaire['profils']
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
    end
  end

  def profil_actif
    profils.select { |p| p['actif'] }.first
  end

  def full( env )
    utilisateur = env['rack.session'][:current_user]

    user_annuaire = AnnuaireWrapper.get_user( utilisateur[:uid] )
    utilisateur[ 'profils' ] = user_annuaire['profils']
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
    end
    utilisateur[ 'profil_actif' ] = utilisateur[ 'profils' ].select { |p| p['actif'] }.first

    utilisateur
  end
end
