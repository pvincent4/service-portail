# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module RessourcesNumeriques
        def self.registered( app )

          #
          # Ressources numériques de l'utilisateur
          #
          app.get "#{APP_PATH}/api/ressources_numeriques/?" do
            content_type :json

            ress_temp = AnnuaireWrapper::User.app.get_resources( user.uid )
            uai_courant = user.profil_actif['uai']
            # Ne prendre que les ressources de l'établissement courant.
            # Qui sont dans la fenêtre d'abonnement
            # Triées sur les types de ressources desc pour avoir 'MANUEL' en premier, puis 'DICO', puis 'AUTRES'
            ress_temp = ress_temp.reject { |r| r[ 'etablissement_code_uai' ] != uai_courant }
                                 .reject { |r|  Date.parse( r['date_deb_abon'] ) >= Date.today }
                                 .reject { |r|  Date.parse( r['date_fin_abon'] ) <= Date.today }
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
