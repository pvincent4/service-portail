# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module User
        def self.registered( app )
          #
          # Gestion de session côtế client
          #
          app.get "#{APP_PATH}/api/user" do
            content_type :json

            return { user: '',
                     info: {},
                     is_logged: false }.to_json unless logged?

            user_verbose.to_json
          end

          app.put "#{APP_PATH}/api/user" do
            content_type :json
            param :nom,            String,  required: false
            param :prenom,         String,  required: false
            param :sexe,           String,  required: false, in: %w(F M)
            param :date_naissance, Date,    required: false
            param :adresse,        String,  required: false
            param :code_postal,    Integer, required: false, within: 0..999_999
            param :ville,          String,  required: false
            # param :login,          String,  required: false
            param :previous_password,       String,  required: false
            param :new_password,       String,  required: false
            # param :bloque,         TrueClass, required: false

            if params[:previous_password] && AnnuaireWrapper::User.check_password( params[:previous_password] )
              params['password'] = params[:new_password]
            end

            AnnuaireWrapper::User.put( user[:uid],
                                       params )

            init_current_user( user[:uid] )

            user_verbose.to_json
          end

          app.post "#{APP_PATH}/api/user/avatar/?" do
            content_type :json

            AnnuaireWrapper::User.put_avatar( user[:uid],
                                              params[:image] ) if params[:image]

            init_current_user( user[:uid] )

            user_verbose.to_json
          end

          app.delete "#{APP_PATH}/api/user/avatar/?" do
            content_type :json

            AnnuaireWrapper::User.delete_avatar( user[:uid] )

            init_current_user( user[:uid] )

            user_verbose.to_json
          end

          app.put "#{APP_PATH}/api/user/profil_actif/?" do
            content_type :json
            param :profil_id, String, required: true
            param :uai, String, required: true

            AnnuaireWrapper::User.put_profil_actif( user[:uid],
                                                    params[:profil_id],
                                                    params[:uai] )

            init_current_user( user[:uid] )

            user_verbose.to_json
          end

          #
          # Classes et groupes de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/regroupements/?" do
            content_type :json

            regroupements = AnnuaireWrapper::User.get_regroupements( user[:uid] )
            regroupements = [ regroupements[ 'classes' ],
                              regroupements[ 'groupes_eleves' ] ]
                            .flatten
                            .reject do |regroupement|
              regroupement[ 'etablissement_code' ] != user[:user_detailed]['profil_actif']['etablissement_code_uai']
            end
                            .each do |regroupement|
              regroupement[ 'id' ] =  regroupement.key?( 'classe_id' ) ? regroupement['classe_id'] : regroupement['groupe_id'] # rubocop:disable Metrics/LineLength
              regroupement[ 'libelle' ] =  regroupement.key?( 'classe_libelle' ) ? regroupement['classe_libelle'] : regroupement['groupe_libelle'] # rubocop:disable Metrics/LineLength
              regroupement[ 'type' ] = regroupement.key?( 'classe_id' ) ? 'classe' : 'groupe_eleve'
            end
                            .uniq { |regroupement| regroupement['id'] }
                            .sort_by { |regroupement| regroupement['libelle'].to_s }.reverse
                            .map do |regroupement|
              { libelle: regroupement['libelle'],
                id: regroupement['id'],
                etablissement_nom: regroupement['etablissement_nom'],
                type: regroupement['type'] }
            end

            # Associer les couleurs des carrés
            colorize( regroupements ).to_json
          end

          #
          # Élèves des Classes et groupes de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/regroupements/:id/eleves" do
            content_type :json

            eleves = AnnuaireWrapper::Etablissement.regroupement_detail( params[:id] )['eleves']
                                                   .map do |eleve|
              eleve[ 'avatar' ] = ANNUAIRE[:url].gsub( %r{/api}, '/' ) + eleve[ 'avatar' ]
              eleve
            end

            colorize( eleves ).to_json
          end

          #
          # Ressources numériques de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/ressources_numeriques/?" do
            content_type :json

            # Ne prendre que les ressources de l'établissement courant.
            # Qui sont dans la fenêtre d'abonnement
            # Triées sur les types de ressources desc pour avoir 'MANUEL' en premier, puis 'DICO', puis 'AUTRES'
            ressources = AnnuaireWrapper::User.get_resources( user[:uid] )
                                              .reject do |ressource|
              ressource[ 'etablissement_code_uai' ] != user[:user_detailed]['profil_actif']['etablissement_code_uai'] ||
                Date.parse( ressource['date_deb_abon'] ) >= Date.today ||
                Date.parse( ressource['date_fin_abon'] ) <= Date.today
            end
                                              .sort_by { |ressource| ressource['type_ressource'].to_s }
                                              .reverse_each do |ressource|
              ressource['icone'] = '08_ressources.svg'
              ressource['icone'] = '05_validationcompetences.svg'  if ressource['type_ressource'] == 'MANUEL'
              ressource['icone'] = '07_blogs.svg'                  if ressource['type_ressource'] == 'AUTRE'
            end

            # Associer les couleurs des carrés
            colorize( ressources ).to_json
          end
        end
      end
    end
  end
end
