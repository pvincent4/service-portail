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

            fluxes = AnnuaireWrapper::Etablissement::Flux.query_etablissement( user.profil_actif['uai'] )
            fluxes = config[:news_feed] if fluxes.empty? || fluxes.nil?

            # Add user news
            fluxes << {
              nb: 5,
              icon: '',
              flux: AnnuaireWrapper::User.get_signed_news_url( user.uid ),
              title: 'News de l\'utilisateur'
            }

            fluxes.each do |feed|
              feed = Hash[ feed.map { |k, v| [k.to_sym, v] } ]

              begin
                SimpleRSS.parse( open( feed[:flux] ) )
                         .items
                         .first( feed[:nb] )
                         .each do |article|
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
                  article[:orderby] =  article[:pubDate].to_i
                  article[:pubDate] = article[:pubDate].strftime( '%d/%m/%Y' )

                  news << article
                end
              rescue
                puts "impossible d'ouvrir #{feed[:flux]}"
              end
            end

            news.uniq! { |article| article[:description] }

            # Tri anté-chronologique
            news.sort! { |n1, n2| n2.orderby <=> n1.orderby }

            news.to_json
          end
        end
      end
    end
  end
end
