# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))
require './config/env'
require './config/CASLaclasseCom'
require 'app'

use Rack::Rewrite do
  rewrite %r{/gar/.*(css|js)/(.*)}, '/$1/$2'
end

use Rack::Session::Cookie,
    key: 'rack.session',
    path: '/gar',
    expire_after: 3600, # In seconds
    secret: 'as6df874asd65fg4sd6fg54asd6gf54' # Digest::SHA1.hexdigest( SecureRandom.base64 ) # test only

use OmniAuth::Builder do
    configure do |config|
      config.path_prefix =  '/gar/auth'
    end
    provider :cas,  CASLaclasseCom::OPTIONS
end

run SinatraApp
