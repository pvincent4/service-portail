# encoding: utf-8
# -*- coding: utf-8 -*-

require 'base64'
require 'cgi'
require 'openssl'

require 'laclasse/cross_app/sender'

require_relative '../config/options'

# Module d'interfaçage avec l'annuaire
# Ce module s'appuye sur la gem de signature et de communicationavec l'annuaire.
#
module AnnuaireWrapper
  module_function

  def normalize( params )
    params.each do |key, _value|
      if params[ key ].is_a? String
        params[ key ] = URI.escape( params[ key ] )
      elsif params[ key ].is_a? Date
        params[ key ] = URI.escape( params[ key ].iso8601 )
      else
        params[ key ] = URI.escape( params[ key ].to_s )
      end
    end
  end

  # fonctions relatives au profil utilisateur
  module User
    module_function

    # Service Utilisateur : init de la session et de son environnement
    def get( uid )
      Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_user, "#{uid}", 'expand' => 'true' )
    end

    def check_password( login, password )
      correct = false
      begin
        Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_sso, '', login: login,
                                                                                   password: password )

        correct = true
      rescue RuntimeError
        LOGGER.info 'Wrong password'
      end

      correct
    end

    # Modification des données de l'utilisateur connecté
    def put( uid, params )
      uid = URI.escape( uid )
      params = normalize( params )
      Laclasse::CrossApp::Sender.put_request_signed(:service_annuaire_user, "#{uid}", params )
    end

    # Modification du profil actif de l'utilisateur connecté
    def put_profil_actif( uid, profil_id, code_uai )
      uid = URI.escape( uid )
      profil_id = URI.escape( profil_id )
      code_uai = URI.escape( code_uai )
      Laclasse::CrossApp::Sender.put_request_signed( :service_annuaire_user,
                                                     "#{uid}/profil_actif",
                                                     uai: code_uai,
                                                     profil_id: profil_id )
    end

    module Ressources
      # Service Utilisateur : récupération des ressources numériques de l'utilisateur
      def query( uid )
        Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_user, "#{uid}/ressources", 'expand' => 'true' )
      end
    end

    module Regroupements
      # Liste des regroupements de l'utilisateur connecté
      def query( uid )
        Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_user, "#{uid}/regroupements", 'expand' => 'true' )
      end
    end

    module Avatar
      module_function

      # Modification avatar
      def update( uid, image )
        uid = URI.escape( uid )

        new_filename = "#{image[:tempfile].path}_#{image[:filename]}"
        File.rename image[:tempfile], new_filename

        Laclasse::CrossApp::Sender.post_raw_request_signed( :service_annuaire_user, "#{uid}/upload/avatar",
                                                            {},
                                                            image: File.open( new_filename ) )

        File.delete new_filename
      end

      # Suppression avatar
      def delete( uid )
        uid = URI.escape( uid )
        Laclasse::CrossApp::Sender.delete_request_signed( :service_annuaire_user, "#{uid}/avatar", {} )
      end
    end

    # Generate signed user's news url
    module News
      module_function

      def query( uid )
        Laclasse::CrossApp::Sender.sign( :service_annuaire_portail_news, '/' + uid, {} )
      end
    end

    # Emails
    module Emails
      module_function

      def query( uid )
        Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_user, "#{uid}/emails/", {} )
      end

      def new( uid, params )
        params = normalize( params )
        Laclasse::CrossApp::Sender.put_request_signed( :service_annuaire_user, "#{uid}/emails", params )
      end

      def update( uid, id, params )
        params = normalize( params )
        Laclasse::CrossApp::Sender.post_request_signed( :service_annuaire_user, "#{uid}/emails/#{id}", {}, params )
      end

      def delete( uid, id )
        Laclasse::CrossApp::Sender.delete_request_signed( :service_annuaire_user, "#{uid}/emails/#{id}", {} )
      end
    end
  end

  # fonctions relatives à l'établissement
  module Etablissement
    module_function

    # Liste des personnels d'un etablissement
    def get( uai )
      Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_personnel, "#{uai}", 'expand' => 'true' )
    end

    # Liste des regroupements d'un établissement
    def get_regroupements( uai )
      Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_personnel, "#{uai}/users", 'expand' => 'true' )
    end

    # detail d'un regroupement
    def regroupement_detail( uid )
      Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_regroupement, "#{uid}", 'expand' => 'true' )
    end

    # Module d'interfaçage Annuaire relatif aux flux RSS affichés sur le portail
    module Flux
      module_function

      def query_etablissement( uai )
        Laclasse::CrossApp::Sender.send_request_signed :service_annuaire_portail_flux, "/etablissement/#{uai}", {}
      end

      def get( id )
        Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_portail_flux, "/#{id}", {} )
      end

      def create( uai, definition )
        definition[ 'etab_code_uai' ] = uai
        Laclasse::CrossApp::Sender.post_request_signed( :service_annuaire_portail_flux, '', {}, definition )
      end

      def update( id, definition )
        definition.delete( 'splat' ) # WTF
        definition.delete( 'captures' ) # WTF
        Laclasse::CrossApp::Sender.put_request_signed( :service_annuaire_portail_flux, "/#{id}", definition )
      end

      def delete( id )
        Laclasse::CrossApp::Sender.delete_request_signed( :service_annuaire_portail_flux, "/#{id}", {} )
      end
    end

    # Module d'interfaçage Annuaire relatif aux applications affichées sur le portail
    module Apps
      module_function

      # Liste des apps d'un établissement
      def query_etablissement( uai )
        Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_portail_entree, "/etablissement/#{uai}", {} )
      end

      def get( id )
        Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_portail_entree, "/#{id}", {} )
      end

      def create( uai, definition )
        definition[ 'etab_code_uai' ] = uai
        Laclasse::CrossApp::Sender.post_request_signed( :service_annuaire_portail_entree, '', {}, definition )
      end

      def update( id, definition )
        definition.delete( 'splat' ) # WTF
        definition.delete( 'captures' ) # WTF
        Laclasse::CrossApp::Sender.put_request_signed( :service_annuaire_portail_entree, "/#{id}", definition )
      end

      def delete( id )
        Laclasse::CrossApp::Sender.delete_request_signed( :service_annuaire_portail_entree, "/#{id}", {} )
      end
    end
  end

  # Module d'interfaçage Annuaire relatif aux applications affichées sur le portail
  module Apps
    module_function

    def query_defaults
      Laclasse::CrossApp::Sender.send_request_signed( :service_annuaire_portail_entree, '/applications', {} )
    end
  end
end
