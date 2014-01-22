# coding: utf-8

require 'rubygems'
require 'bundler'
require "sinatra/reloader"

Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

require_relative './lib/AuthenticationHelpers'

# https://gist.github.com/chastell/1196800
class Hash
   def to_html
      [ '<ul>',
       map { |k, v| ["<li><strong>#{k}</strong> : ", v.respond_to?(:to_html) ? v.to_html : "<span>#{v}</span></li>"] },
       '</ul>'
      ].join
   end
end

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base

   configure do
    set :app_file, __FILE__
    set :root, APP_ROOT
    set :public_folder, Proc.new { File.join(root, "public") }
    set :inline_templates, true
    set :protection, true
   end

   configure :development do
    register Sinatra::Reloader
    #also_reload '/path/to/some/file'
    #dont_reload '/path/to/other/file'
   end

   helpers AuthenticationHelpers

   get APP_PATH + '/' do
    if is_logged?
      erb "<h1>Connected !</h1><pre>#{env['rack.session'][:current_user].to_html}</pre><hr>" 
    else
      erb "<div class='jumbotron'>
            <h1>Public page</h1>
            <p class='lead'>This starter app is an example of Omniauth-cas and sinatra integration based on rack system.<br />
            Please try to connect with CAS sso...
            </p>
            </div>"
    end  
   end

   get APP_PATH + '/auth/:provider/callback' do
      init_session( request.env )
      redirect params[:url] if params[:url] !=  env['rack.url_scheme'] + "://" + env['HTTP_HOST'] + APP_PATH + '/'
      redirect APP_PATH + '/'
      #erb "<h1>Connected !</h1><pre>#{request.env['omniauth.auth'].to_html}</pre><hr>"
   end

   get APP_PATH + '/auth/failure' do
      erb "<h1>Authentication Failed:</h1><h3>message:<h3> <pre>#{params}</pre>"
   end

   get APP_PATH + '/auth/:provider/deauthorized' do
      erb "#{params[:provider]} has deauthorized this app."
   end

   get APP_PATH + '/protected' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authenticated]
      erb "<pre>#{request.env['omniauth.auth'].to_json}</pre><hr>
         <a href='<%= APP_PATH %>/logout'>Logout</a>"
   end

   get APP_PATH + '/login' do
      login! APP_PATH + '/'
   end

   get APP_PATH + '/logout' do
      logout! (env['rack.url_scheme'] + "://" + env['HTTP_HOST'] + APP_PATH + '/')
   end

end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
