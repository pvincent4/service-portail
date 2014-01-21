# coding: utf-8

require 'rubygems'
require 'bundler'

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

   helpers AuthenticationHelpers

   get APP_PATH + '/' do
      erb "<a href='<% APP_PATH %>/listResources'>Lister les ressources</a>"
   end

   get APP_PATH + '/auth/:provider/callback' do
      init_session( request.env )

      if params[:url] != 'http://localhost:9292' + APP_PATH + '/'
         redirect params[:url]
      else
         erb "<h2><a href='<% APP_PATH%>/listResources'>Lister les ressources</a></h2>"
      end
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
         <a href='<% APP_PATH %>/logout'>Logout</a>"
   end

   get APP_PATH + '/login' do
      login! APP_PATH + '/'
   end

   get APP_PATH + '/logout' do
      logout! 'http://localhost:9292/gar/'
   end

end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
