# -*- encoding: utf-8 -*-

module Portail
  module Helpers
    module Config
      attr_accessor :config

      def config
        @config = JSON.parse( File.read( './config/portail.json' ), symbolize_names: true ) if @config.nil?

        @config
      end

      # Renvoie le tableau des cases avec leurs colors
      def damier
        config[:apps][:default]
          .to_a
          .map { |app| app[1] }
          .sort_by { |app| app[:index] }
          .map { |app| app[:color] }
      end

      # Ajouter les colors du damier à un tableau de choses
      # s'il y a moins de 16 éléments dans le tableau de choses, on complète avec des carrés de color vide.
      def colorize( a )
        d = damier

        a.each_with_index do |e, i|
          e['color'] = d[i.modulo(d.length)]
        end

        # Completer le damier jusqu'à 16
#        if a.length < d.length
#          (d.length - a.length).times do
#            # a grandit d'1 à chaque passage
#            a.push('color' => d[a.length])
#          end
#        end
        a
      end
    end
  end
end
