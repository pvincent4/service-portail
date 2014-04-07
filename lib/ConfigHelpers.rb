# -*- encoding: utf-8 -*-

module ConfigHelpers
   attr_accessor :config

   def config
      @config = YAML.load_file './config/portail.yaml' if @config.nil?

      @config
   end

end
