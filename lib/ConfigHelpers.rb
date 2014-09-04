# -*- encoding: utf-8 -*-

module ConfigHelpers
  attr_accessor :config

  def config
    @config = JSON.parse( File.read( './config/portail.json' ), symbolize_names: true ) if @config.nil?

    @config
  end
end
