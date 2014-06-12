# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))

require './config/init'
require 'redis'
require 'faye'
require 'app'

Faye::WebSocket.load_adapter('thin')

use Rack::Rewrite do
  rewrite %r{#{APP_PATH}/(.*(css|js|html|png|jpg|gif|jpeg|eot|svg|ttf|woff))}, '/app/$1'
end

use Rack::Session::Cookie,
    key: 'rack.session',
    path: APP_PATH,
    expire_after: 3600, # In seconds
    secret: '379460892c261bfa7df6a6e466dd98bbd7883a57' # Digest::SHA1.hexdigest( SecureRandom.base64 ) # test only

use OmniAuth::Builder do
    configure do |config|
      config.path_prefix = "#{APP_PATH}/auth"
    end
    provider :cas, CasAuth::OPTIONS
end

use Faye::RackAdapter,
    mount: "#{APP_PATH}/faye",
    timeout: 25,
    engine:  {
                type: Faye::Redis,
                host: 'localhost',
                port: 6379
             }

#bayeux = Faye::RackAdapter.new(:mount => "#{APP_PATH}/faye", 
#                                  :timeout => 25, 
#                                  :engine => { :type => Faye::Redis, :host => 'localhost', :port => 6379 })
#run bayeux
#bayeux.on(:subscribe) { | client_id, channel | 
#        puts client_id.to_s + " has subscribed to channel '" + channel.to_s + "'" 
#    }


run SinatraApp
