# -*- encoding: utf-8 -*-

module ConfigHelpers
  attr_accessor :config

  def config
    @config = JSON.parse( File.read( './config/portail.json' ), symbolize_names: true ) if @config.nil?

    @config
  end

  # Renvoie le tableau des cases avec leurs couleurs
  def damier
    @config[:apps][:default]
      .sort_by { |app| app[:index] }
      .map { |app| app[:couleur] }
  end

  # Ajouter les couleurs du damier à un tableau de choses
  # s'il y a moins de 16 éléments dans le tableau de choses, on complète avec des carrés de couleur vide.
  def colorize( a )
    d = damier
    a.each_with_index { |e, i|
      e['couleur'] = d[i.modulo(d.length)]
    }
    # Completer le damier jusqu'à 16
    if a.length < d.length
      (d.length - a.length).times {
        # a grandit d'1 à chaque passage
        a.push('couleur' => d[a.length])
      }
    end
    a
  end
end
