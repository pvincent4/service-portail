# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module Apps
        def self.registered( app )
          #
          # Service liste des applications
          #
          app.get "#{APP_PATH}/api/apps/default/?" do
            content_type :json

            return [] unless logged?

            AnnuaireWrapper::Apps.query_defaults
              .map do |appli|
              default = config[:apps][:default][ appli['id'].to_sym ]

              appli.merge! default unless default.nil?

              appli[ 'application_id' ] = appli[ 'id' ]
              appli.delete( 'id' )
              appli[ 'type' ] = 'INTERNAL'

              appli
            end.to_json
          end

          app.get "#{APP_PATH}/api/apps/?" do
            content_type :json

            STDERR.puts '/!\ FIXME WITH THE FORCE OF A THOUSAND SUNS!!!!'
            STDERR.puts '/!\ OH HAI!'
            STDERR.puts '/!\ U CAN HAZ APPS!'
            STDERR.puts '/!\ SO AWESOME!'
            STDERR.puts '/!\ Trève de plaisanterie ce pourrissage de log n\'a pour but'
            STDERR.puts '/!\ que de donner le temps aux bits d\'arriver à destination.'
            STDERR.puts '/!\ Dijkstra, pardonnez-leurs, ils ne savent pas ce qu\'ils font.'
            STDERR.puts '/!\ (désolé)'
            STDERR.puts '/!\ KTHXBYE.'

            return [] unless logged?

            apps = AnnuaireWrapper::Etablissement::Apps.query_etablissement( user[:user_detailed]['profil_actif']['etablissement_code_uai'] )
                   .map do |application|
              default = config[:apps][:default][ application['application_id'].to_sym ] unless application['application_id'].nil?

              unless default.nil?
                application[ 'icon' ] = default[ :icon ] if application[ 'icon' ].nil?
                application[ 'color' ] = default[ :color ] if application[ 'color' ].nil?
                application[ 'index' ] = default[ :index ] if application[ 'index' ] == -1
              end

              # FIXME: if only there was a way to fix this in the Annuaire's DB
              application[ 'icon' ].gsub!( 'charte-graphique-laclasse-com', 'laclasse-common-client' ) unless application[ 'icon' ].nil?

              application
            end

            indexes = apps.map { |a| a['index'] }.sort
            duplicates = indexes.select { |e| indexes.count( e ) > 1 }.uniq
            free_indexes = (0..15).to_a - indexes

            duplicates.each do |i|
              unless free_indexes.empty?
                app = apps.select { |a| a['index'] == i }.last
                app['index'] = free_indexes.pop

                AnnuaireWrapper::Etablissement::Apps.update( app['id'], app )
              end
            end

            apps.to_json
          end

          app.get "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true

            return [] unless logged?

            AnnuaireWrapper::Etablissement::Apps.app.get( params[:id] ).to_json
          end

          app.post "#{APP_PATH}/api/apps/?" do
            content_type :json
            param :index, Integer, required: true
            param :type, String, required: true, in: %w(INTERNAL EXTERNAL)
            param :application_id, String, required: false
            param :libelle, String, required: false
            param :description, String, required: false
            param :url, String, required: false
            param :active, TrueClass, required: false
            param :icon, String, required: false
            param :color, String, required: false

            AnnuaireWrapper::Etablissement::Apps.create( user[:user_detailed]['profil_actif']['etablissement_code_uai'], params ).to_json
          end

          app.put "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true
            param :index, Integer, required: true
            param :active, TrueClass, required: false
            param :url, String, required: false
            param :libelle, String, required: false
            param :description, String, required: false
            param :icon, String, required: false
            param :color, String, required: false

            AnnuaireWrapper::Etablissement::Apps.update( params[:id], params ).to_json
          end

          app.delete "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true

            AnnuaireWrapper::Etablissement::Apps.delete( params[:id] ).to_json
          end
        end
      end
    end
  end
end
