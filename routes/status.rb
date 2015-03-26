# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Status
      def self.registered( app )
        app.get "#{APP_PATH}/status/?" do
          content_type :json

          status = 'OK'
          reason = 'L\'application fonctionne.'

          { app_id: ANNUAIRE[:app_id],
            status: status,
            reason: reason
          }.to_json
        end
      end
    end
  end
end
