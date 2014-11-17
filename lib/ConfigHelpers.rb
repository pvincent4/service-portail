# -*- encoding: utf-8 -*-

module ConfigHelpers
  attr_accessor :config

  def config
    @config = JSON.parse( File.read( './config/portail.json' ), symbolize_names: true ) if @config.nil?

    @config
  end
  
  # Renvoie le tableau des cases avec leurs couleurs
  def damier
    c = []
    self.config[:apps_tiles].flatten
    .reject { |app| app.class == Symbol }
    .each { |a| c.push a[:couleur] }
    c
  end
  
  # Ajouter les couleurs du damier à un tableau de choses
  # s'il y a moins de 16 éléments danas le tableau de choses, on complète avec des carrés de couleur vide.
  def colorize (a)
    a.each_with_index { |e, i|
      e['couleur'] = damier[i.modulo(damier.length)]
    }     
    # Completer le dameir jusqu'à 16
    if a.length < damier.length
      (damier.length - a.length).times { |i|
        a.push('couleur' => damier[i])
      }
    end
    a
  end
end
