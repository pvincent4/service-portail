# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))
require './config/init'
require 'app'

use Rack::Rewrite do
  #rewrite %r{/app/.*(css|js)/(.*)}, '/$1/$2'
  #rewrite %{/app/app/.*/.*}, '/app/$1/$2'
end

use Rack::Session::Cookie,
    key: 'rack.session',
    path: APP_PATH,
    expire_after: 3600, # In seconds
    secret: '379460892c261bfa7df6a6e466dd98bbd7883a57' # Digest::SHA1.hexdigest( SecureRandom.base64 ) # test only

use OmniAuth::Builder do
    configure do |config|
      config.path_prefix =  APP_PATH + '/auth'
    end
    provider :cas,  CASLaclasseCom::OPTIONS
end

run SinatraApp
