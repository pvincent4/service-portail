# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift(File.dirname(__FILE__))

require './config/init'

require 'laclasse/helpers/rack'
require 'laclasse/laclasse_logger'
require 'laclasse/utils/health_check'

require 'app'

LOGGER = Laclasse::LoggerFactory.get_logger
LOGGER.info "Démarrage du Portail avec #{LOGGER.loggers_count} logger#{LOGGER.loggers_count > 1 ? 's' : ''}"

Laclasse::Utils::HealthChecker.check

LOGGER.info 'Portail prêt à servir'

Laclasse::Helpers::Rack.configure_rake self

# rubocop:disable Metrics/LineLength
use Rack::Rewrite do
  rewrite %r{^#{APP_PATH}(/app/(pages|js|css|vendor|images)/.*(html|map|css|js|ttf|woff|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '$1'
  rewrite %r{^/?#{APP_PATH}(/(pages|js|css|vendor|images)/.*(html|map|css|js|ttf|woff|png|jpg|jpeg|gif|svg)[?v=0-9a-zA-Z\-.]*$)}, '/app$1'
end
# rubocop:enable Metrics/LineLength

use OmniAuth::Builder do
  configure do |config|
    config.path_prefix = "#{APP_PATH}/auth"
    # config.full_host = CASAUTH::CONFIG[:full_host]
  end
  provider :cas, CASAUTH::CONFIG
end

LOGGER.debug "#{ENV['RACK_ENV']} environment"

run SinatraApp
