# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module Flux
        def self.registered( app )
          #
          # Service liste des applications
          #
          app.get "#{APP_PATH}/api/flux/?" do
            content_type :json

            return [] unless logged?

            fluxes = AnnuaireWrapper::Etablissement::Flux.query_etablissement( user[:user_detailed]['profil_actif']['etablissement_code_uai'] )
            fluxes = config[:news_feed] if fluxes.empty? || fluxes.nil?

            fluxes.to_json
          end

          app.get "#{APP_PATH}/api/flux/:id" do
            content_type :json
            param :id, Integer, required: true

            return [] unless logged?

            AnnuaireWrapper::Etablissement::Flux.get( params[:id] ).to_json
          end

          app.post "#{APP_PATH}/api/flux/?" do
            content_type :json
            param :nb, Integer, required: true
            param :icon, String, required: true
            param :flux, String, required: true
            param :title, String, required: true

            AnnuaireWrapper::Etablissement::Flux.create( user[:user_detailed]['profil_actif']['etablissement_code_uai'], params ).to_json
          end

          app.put "#{APP_PATH}/api/flux/:id" do
            content_type :json
            param :id, Integer, required: true
            param :nb, Integer, required: true
            param :icon, String, required: true
            param :flux, String, required: true
            param :title, String, required: true

            AnnuaireWrapper::Etablissement::Flux.update( params[:id], params ).to_json
          end

          app.delete "#{APP_PATH}/api/flux/:id" do
            content_type :json
            param :id, Integer, required: true

            AnnuaireWrapper::Etablissement::Flux.delete( params[:id] ).to_json
          end
        end
      end
    end
  end
end
