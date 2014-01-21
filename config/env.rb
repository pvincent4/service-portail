# -*- encoding: utf-8 -*-

ENV[ 'RACK_ENV' ] = 'development'
APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..'))

# Configurer ici le virtual path de l'application/
# /!\ Il est obligatoire de mettre l'application sous un virtual path du fait de notre architecture HAProxy.
APP_PATH = '/app/'