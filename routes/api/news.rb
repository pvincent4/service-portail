# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module News
        def self.registered( app )
          #
          # Agrégateur RSS
          #
          app.get "#{APP_PATH}/api/news/?" do
            content_type :json

            # THINK : Comment mettre des priorités sur les différents flux ?
            news = []

            fluxes = AnnuaireWrapper::Etablissement::Flux.query_etablissement( user[:user_detailed]['profil_actif']['etablissement_code_uai'] ) # rubocop:disable Metrics/LineLength
            fluxes = config[:news_feed] if fluxes.empty? || fluxes.nil?

            # Add user news
            fluxes << { nb: 5,
                        icon: '',
                        flux: AnnuaireWrapper::User.get_news( user[:uid] ),
                        title: 'News de l\'utilisateur' }

            fluxes.each do |feed|
              feed = Hash[ feed.map { |k, v| [k.to_sym, v] } ]

              begin
                news << SimpleRSS.parse( open( feed[:flux] ) )
                                 .items
                                 .first( feed[:nb] )
                                 .map do |article|
                  article.each do |k, _|
                    if article[ k ].is_a? String
                      article[ k ] = URI.unescape( article[ k ] ).to_s.force_encoding( 'UTF-8' ).encode!
                      article[ k ] = HTMLEntities.new.decode( article[ k ] )
                    else
                      next
                    end
                  end

                  article[:description] = article[:content_encoded] if article.has? :content_encoded
                  article[:image] = article[:content]

                  if article[:image].nil?
                    images = article[:description].match( /(https?:\/\/.*\.(?:png|jpg))/i )
                    article[:image] = images[0] unless images.nil?
                  end

                  article
                end
              rescue
                LOGGER.info "impossible d'ouvrir #{feed[:flux]}"
              end
            end

            news
              .flatten
              .uniq { |article| article[:description] }
              .to_json
          end
        end
      end
    end
  end
end
