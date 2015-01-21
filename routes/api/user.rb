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

            user.full( env ).to_json
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
            # param :password,       String,  required: false
            # param :bloque,         TrueClass, required: false

            AnnuaireWrapper::User.put( user.uid,
                                       params )

            set_current_user( user.uid )

            user.full( env ).to_json
          end

          app.post "#{APP_PATH}/api/user/avatar/?" do
            content_type :json

            AnnuaireWrapper::User.put_avatar( user.uid,
                                              params[:image] ) if params[:image]

            set_current_user( user.uid )

            user.full( env ).to_json
          end

          app.delete "#{APP_PATH}/api/user/avatar/?" do
            content_type :json

            AnnuaireWrapper::User.delete_avatar( user.uid )

            set_current_user( user.uid )

            user.full( env ).to_json
          end

          app.put "#{APP_PATH}/api/user/profil_actif/?" do
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
          app.get "#{APP_PATH}/api/user/regroupements/?" do
            content_type :json
            mes_regpts = []

            rgpts = AnnuaireWrapper::User.get_regroupements( user.uid )
            uai_courant = user.profil_actif['uai']
            # Pour les classes
            # filtrer sur les regroupements de l'établissement courant.
            rgpts['classes']
              .reject { |r| r[ 'etablissement_code' ] != uai_courant }
              .uniq { |x| x['classe_id'] }
              .sort_by { |r| r['classe_libelle'].to_s }
              .reverse # Pour avoir les 6eme avant les 3eme
              .each { |c|
                obj_cls = { nom: c['classe_libelle'], cls_id: c['classe_id'], uai: uai_courant, etablissement_nom: c['etablissement_nom'] }
                mes_regpts.push obj_cls
              }.uniq! # supprime les doublons dûs aux matieres enseaignées qui peuvent être plusieurs pour une classe

              rgpts['groupes_eleves']
                .reject { |r| r[ 'etablissement_code' ] != uai_courant }
                .uniq { |x| x['groupe_id'] }
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
          # Élèves des Classes et groupes de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/regroupements/:id/eleves" do
            content_type :json

            mes_amis = AnnuaireWrapper::Etablissement.regroupement_detail( params[:id] )
            mes_amis['eleves'] = mes_amis['eleves'].map { |e|
              e[ 'avatar' ] = ANNUAIRE[:url].gsub( %r{/api}, '/' ) + e[ 'avatar' ]

              e
            }

            colorize( mes_amis['eleves'] ).to_json
          end

          #
          # Ressources numériques de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/ressources_numeriques/?" do
            content_type :json

            ress_temp = AnnuaireWrapper::User.get_resources( user.uid )
            uai_courant = user.profil_actif['uai']
            # Ne prendre que les ressources de l'établissement courant.
            # Qui sont dans la fenêtre d'abonnement
            # Triées sur les types de ressources desc pour avoir 'MANUEL' en premier, puis 'DICO', puis 'AUTRES'
            ress_temp = ress_temp.reject { |r| r[ 'etablissement_code_uai' ] != uai_courant }
                                 .reject { |r| Date.parse( r['date_deb_abon'] ) >= Date.today }
                                 .reject { |r| Date.parse( r['date_fin_abon'] ) <= Date.today }
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
        end
      end
    end
  end
end
