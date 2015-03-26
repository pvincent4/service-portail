# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Status
      def self.registered( app )
        app.get "#{APP_PATH}/status/?" do
          content_type :json

          status = 'OK'
          reason = 'L\'application fonctionne.'

          app_status = app_infos

          app_status[:status] = status
          app_status[:reason] = reason

          app_status.to_json
        end
      end
    end
  end
end
