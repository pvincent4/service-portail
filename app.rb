# coding: utf-8

require 'rubygems'
require 'bundler'

Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

require_relative './lib/AuthenticationHelpers'
require_relative './lib/GARHelpers'

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
   helpers GARHelpers

   get '/gar/' do
      erb "<a href='/gar/listResources'>Lister les ressources</a>"
   end

   get '/gar/auth/:provider/callback' do
      init_session( request.env )

      if params[:url] != 'http://localhost:9292/gar/'
         redirect params[:url]
      else
         erb "<h2><a href='/gar/listResources'>Lister les ressources</a></h2>"
      end
   end

   get '/gar/auth/failure' do
      erb "<h1>Authentication Failed:</h1><h3>message:<h3> <pre>#{params}</pre>"
   end

   get '/gar/auth/:provider/deauthorized' do
      erb "#{params[:provider]} has deauthorized this app."
   end

   get '/gar/protected' do
      throw(:halt, [401, "Not authorized\n"]) unless session[:authenticated]
      erb "<pre>#{request.env['omniauth.auth'].to_json}</pre><hr>
         <a href='/gar/logout'>Logout</a>"
   end

   get '/gar/login' do
      login! '/gar/'
   end

   get '/gar/logout' do
      logout! 'http://localhost:9292/gar/'
   end

   get '/gar/listResources' do
      login!( '/gar/listResources' ) unless is_logged?

      response = get_list_resources(session[:current_user][:info]['ENTPersonStructRattachRNE'],
                                    session[:current_user][:info]['uid'] )      

      # trier les ressources par typologie
      ressources = response[:ressources].sort_by { |ressource| ressource[:typologieRessource].to_s.downcase }
      typo_prec = "" 
      class_affichage = ['primary','success','info', 'warning','danger']
      #html = '<h3>Vos ressources :</h3>'
      html = '<table class=\"table table-striped\"><tbody>'
      ressources.each_with_index { |ressource, i|
         if typo_prec != ressource[:typologieRessource].to_s 
           html += "<tr><td><span class=\"label label-#{class_affichage[i.modulo(class_affichage.length)]}\">#{ressource[:typologieRessource].to_s.capitalize}</span></td><td></td><td></td></tr>\n"
           typo_prec = ressource[:typologieRessource].to_s
         end
         html += "<tr><td></td><td><a href=\"#{ressource[:urlAccesGar]}\"><img src=\"#{ressource[:vignette]}\" width=\"48px\" /></a>&nbsp;&nbsp;<a href=\"#{ressource[:urlAccesGar]}\">#{ressource[:libelle]}</a></td></tr>\n"
         # only Debug purpose : html += "<td><small>#{ressource.to_html}</small></td></tr>"
      }

      html += '</tbody></table>'
      erb html
   end

   get '/gar/showResource/:id' do
      login!( "/gar/showResource/#{params[:id]}" ) unless is_logged?

      erb "<em>Vous avez demand&eacute; le #{params[:id]}, ne quittez pas…</em>"
   end

end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
