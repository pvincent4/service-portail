# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))

# require 'redis'
# require 'faye'
# require 'faye/redis'

require './config/init'
require 'app'

# Faye::WebSocket.load_adapter('thin')

use Rack::Rewrite do
  rewrite %r{^#{APP_PATH}(/app/(pages|js|css|vendor)/.*(html|map|css|js|ttf|woff|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '$1'
  rewrite %r{^/#{APP_PATH}(/(pages|js|css|vendor)/.*(html|map|css|js|ttf|woff|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '/app$1'
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

#use Faye::RackAdapter, NOTIFICATIONS

#bayeux = Faye::RackAdapter.new(:mount => "#{APP_PATH}/faye",
#                                  :timeout => 25,
#                                  :engine => { :type => Faye::Redis, :host => 'localhost', :port => 6379 })
#run bayeux
#bayeux.on(:subscribe) { | client_id, channel |
#        puts client_id.to_s + " has subscribed to channel '" + channel.to_s + "'"
#    }

run SinatraApp
