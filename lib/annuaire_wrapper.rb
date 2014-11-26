# encoding: utf-8
# -*- coding: utf-8 -*-

require 'base64'
require 'cgi'
require 'openssl'

require_relative '../config/options'

# Module d'interfaçage avec l'annuaire
# Ce module s'appuye sur la gem de signature et de communicationavec l'annuaire.
#
module AnnuaireWrapper
  module_function

  # Service classes et groupes d'élèves
  def get_regroupement( id )
    Annuaire.send_request_signed( :service_annuaire_regroupement, "#{id}", 'expand' => 'true' )
  end

  # Service Utilisateur : init de la session et de son environnement
  def get_user( uid )
    Annuaire.send_request_signed( :service_annuaire_user, "#{uid}", 'expand' => 'true' )
  end

  # Service Utilisateur : récupération des ressources numériques de l'utilisateur
  def get_user_resources( uid )
    Annuaire.send_request_signed( :service_annuaire_user, "#{uid}/ressources", 'expand' => 'true' )
  end

  # Liste des regroupements de l'utilisateur connecté
  def get_user_regroupements( uid )
    Annuaire.send_request_signed( :service_annuaire_user, "#{uid}/regroupements", 'expand' => 'true' )
  end

  # Modification des données de l'utilisateur connecté
  def put_user( uid, params )
    uid = URI.escape( uid )
    params.each do |key, _value|
      if params[ key ].is_a? String
        params[ key ] = URI.escape( params[ key ] )
      elsif params[ key ].is_a? Date
        params[ key ] = URI.escape( params[ key ].iso8601 )
      else
        params[ key ] = URI.escape( params[ key ].to_s )
      end
    end
    Annuaire.put_request_signed(:service_annuaire_user, "#{uid}", params )
  end

  # Modification avatar
  def put_user_avatar( uid, image )
    uid = URI.escape( uid )

    new_filename = "#{image[:tempfile].path}_#{image[:filename]}"
    File.rename image[:tempfile], new_filename

    Annuaire.post_raw_request_signed( :service_annuaire_user, "#{uid}/upload/avatar",
                                      {},
                                      image: File.open( new_filename ) )
  end

  # Suppression avatar
  def delete_user_avatar( uid )
    uid = URI.escape( uid )
    Annuaire.delete_request_signed( :service_annuaire_user, "#{uid}/avatar", {} )
  end

  # Modification du profil actif de l'utilisateur connecté
  def put_user_profil_actif( uid, profil_id, code_uai )
    uid = URI.escape( uid )
    profil_id = URI.escape( profil_id )
    code_uai = URI.escape( code_uai )
    Annuaire.put_request_signed( :service_annuaire_user, "#{uid}/profil_actif", uai: code_uai, profil_id: profil_id )
  end

  # Liste des personnels d'un etablissement
  def get_etablissement( uai )
    Annuaire.send_request_signed( :service_annuaire_personnel, "#{uai}", 'expand' => 'true' )
  end

  # Liste des regroupements d'un établissement
  def get_etablissement_regroupements( uai )
    Annuaire.send_request_signed( :service_annuaire_personnel, "#{uai}/users", 'expand' => 'true' )
  end

  # Module d'interfaçage Annuaire relatif aux applications affichées sur le portail
  module Apps
    module_function

    # Liste des apps d'un établissement
    def query_etablissement( uai )
      Annuaire.send_request_signed( :service_annuaire_portail_entree, "/etablissement/#{uai}", {} )
    end

    def query
      Annuaire.send_request_signed( :service_annuaire_portail_entree, '', {} )
    end

    def get( id )
      Annuaire.send_request_signed( :service_annuaire_portail_entree, "/#{id}", {} )
    end

    def create( uai, definition )
      definition[ 'etab_code_uai' ] = uai
      Annuaire.post_request_signed( :service_annuaire_portail_entree, '', {}, definition )
    end

    def update( id, definition )
      Annuaire.put_request_signed( :service_annuaire_portail_entree, "/#{id}", definition )
    end

    def delete( id )
      Annuaire.delete_request_signed( :service_annuaire_portail_entree, "/#{id}" )
    end
  end
end
