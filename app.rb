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

require 'laclasse/common/helpers/authentication'
require 'laclasse/helpers/user'

require_relative './lib/annuaire_wrapper'

require_relative './lib/helpers/config'
require_relative './lib/helpers/user'

require_relative './routes/index'
require_relative './routes/auth'
require_relative './routes/api/user'
require_relative './routes/api/apps'
require_relative './routes/api/flux'
require_relative './routes/api/news'
require_relative './routes/api/version'

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

  helpers Laclasse::Helpers::Authentication
  helpers Laclasse::Helpers::User
  helpers Portail::Helpers::Config
  helpers Portail::Helpers::User

  ##### routes #################################################################

  register Portail::Routes::Index

  register Portail::Routes::Auth

  register Portail::Routes::Api::User
  register Portail::Routes::Api::Apps
  register Portail::Routes::Api::Flux
  register Portail::Routes::Api::News
  register Portail::Routes::Api::Version
end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
