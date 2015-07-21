# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Index
      def self.registered( app )
        app.get "#{APP_PATH}/?" do
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
