# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Auth
      def self.registered( app )
        app.get "#{APP_PATH}/auth/:provider/callback" do
          init_session( request.env )
          redirect params[:url] if params[:url] != "#{env['rack.url_scheme']}://env['HTTP_HOST']#{APP_PATH}/"
          redirect APP_PATH + '/'
        end

        app.get "#{APP_PATH}/auth/failure" do
          erb :auth_failure
        end

        app.get "#{APP_PATH}/auth/:provider/deauthorized" do
          erb :auth_deauthorized
        end

        app.get "#{APP_PATH}/protected" do
          throw( :halt, [ 401, "Not authorized\n" ] ) unless logged?
          erb :auth_protected
        end

        app.get "#{APP_PATH}/login" do
          login! "#{APP_PATH}/"
        end

        app.get "#{APP_PATH}/logout" do
          logout! "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{APP_PATH}/"
        end
      end
    end
  end
end
