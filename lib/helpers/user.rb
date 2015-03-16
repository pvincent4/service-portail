# -*- encoding: utf-8 -*-

require_relative '../HashedUser'

module Portail
  module Helpers
    module User
      def old_user
        HashedUser.new session[:current_user]
      end
    end
  end
end
