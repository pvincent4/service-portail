# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Index
      def self.registered( app )
        app.get "#{APP_PATH}/?" do
          LOGGER.debug( logged? ? 'utilisateur authentifié' : 'utilisateur anonyme' )
          if logged?
            erb :app
          else
            erb :public, layout: nil
          end
        end
      end
    end
  end
end
