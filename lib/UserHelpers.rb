# -*- encoding: utf-8 -*-

require_relative './HashedUser'

module UserHelpers
  def user
    HashedUser.new session[:current_user]
  end
end
