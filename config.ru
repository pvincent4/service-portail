# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))
require './config/env'
require './config/CASLaclasseCom'
require 'app'

use Rack::Rewrite do
  rewrite %r{/app/.*(css|js)/(.*)}, '/$1/$2'
end

use Rack::Session::Cookie,
    key: 'rack.session',
    path: APP_PATH,
    expire_after: 3600, # In seconds
    secret: 'as6df874asd65fg4sd6fg54asd6gf54' # Digest::SHA1.hexdigest( SecureRandom.base64 ) # test only

use OmniAuth::Builder do
    configure do |config|
      config.path_prefix =  APP_PATH + '/auth'
    end
    provider :cas,  CASLaclasseCom::OPTIONS
end

run SinatraApp
