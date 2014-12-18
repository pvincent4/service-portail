# -*- coding: utf-8 -*-

module Sinatra
  module Portail
    module Api
      module Version
        def self.registered( app )

          #
          # renvoi la version du portail
          #
          app.get "#{APP_PATH}/api/version/?" do
            content_type :text

            APP_VERSION
          end
        end
      end
    end
  end
end
