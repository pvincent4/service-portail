# coding: utf-8

require 'rubygems'
require 'bundler'
require 'sinatra/reloader'
require 'open-uri'
require 'uri'
require 'json'
require 'yaml'
require 'date'

Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

require_relative './lib/annuaire_wrapper'

require_relative './lib/AuthenticationHelpers'
require_relative './lib/ConfigHelpers'
require_relative './lib/UserHelpers'

require_relative './routes/auth'
require_relative './routes/api/user'
require_relative './routes/api/apps'
require_relative './routes/api/news'
require_relative './routes/api/version'
require_relative './routes/api/ressources_numeriques'

# https://gist.github.com/chastell/1196800
class Hash
  def to_html
    [ '<ul>',
      map { |k, v|
        [ "<li><strong>#{k}</strong> : ", v.respond_to?(:to_html) ? v.to_html : "<span>#{v}</span></li>" ]
      },
      '</ul>' ].join
  end
end

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base
  @ent_notifs = []

  configure do
    set :app_file, __FILE__
    set :root, APP_ROOT
    set :public_folder, proc { File.join( root, 'public' ) }
    set :inline_templates, true
    set :protection, true
  end

  configure :development do
    register Sinatra::Reloader
    # also_reload '/path/to/some/file'
    # dont_reload '/path/to/other/file'
  end

  helpers Sinatra::Param

  helpers AuthenticationHelpers
  helpers ConfigHelpers
  helpers UserHelpers

  ##### routes #################################################################
  get "#{APP_PATH}/?" do
    erb :app
  end

  register Sinatra::Portail::Auth

  register Sinatra::Portail::Api::User
  register Sinatra::Portail::Api::Apps
  register Sinatra::Portail::Api::News
  register Sinatra::Portail::Api::RessourcesNumeriques
  register Sinatra::Portail::Api::Version
end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
