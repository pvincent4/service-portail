# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module Index
        def self.registered( app )
          app.get "#{APP_PATH}/?" do
            erb :app
          end
        end
      end
    end
  end
end
