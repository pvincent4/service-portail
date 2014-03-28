# -*- encoding: utf-8 -*-

module AppsHelpers
   attr_reader :apps
   attr_reader :apps_tiles

   def apps
      @apps = YAML.load_file './config/apps.yaml' if @apps.nil?

      @apps
   end

   def apps_tiles
      @apps_tiles = YAML.load_file './config/apps_tiles.yaml' if @apps_tiles.nil?

      @apps_tiles
   end

end
