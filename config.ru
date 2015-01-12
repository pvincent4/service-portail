# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))

require './config/init'
require 'app'

# Faye::WebSocket.load_adapter('thin')

use Rack::Rewrite do
  rewrite %r{^#{APP_PATH}(/app/(pages|js|css|vendor|images)/.*(html|map|css|js|ttf|woff|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '$1'
             rewrite %r{^/?#{APP_PATH}(/(pages|js|css|vendor|images)/.*(html|map|css|js|ttf|woff|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '/app$1'
end

use Rack::Session::Cookie,
    key: 'rack.session',
    path: APP_PATH,
    expire_after: 3600, # In seconds
    secret: '#{SESSION_KEY}'

use OmniAuth::Builder do
  configure do |config|
    config.path_prefix = "#{APP_PATH}/auth"
    config.full_host = CASAUTH::CONFIG[:full_host]

  end
  provider :cas, CASAUTH::CONFIG
end

run SinatraApp
