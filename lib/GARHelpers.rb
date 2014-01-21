# -*- coding: utf-8 -*-

require 'net/https'
require 'savon'
require 'nokogiri'

require_relative '../config/GAR'

module GARHelpers

  # récupère la liste des ressources disponibles pour l'utilisateur identifié
  # par _uid_ appartenant à l'établissement identifié par _uai_
  def get_list_resources( uai, uid )
    
    client = Savon.client GAR

    response = client.call(:recuperer_liste_etiquettes,
                           message: { idEnt: FS_ENTITYID,
                                     uai: uai,
                                     uid: uid },
                           soap_action: '' )

    xml_body = Nokogiri::XML response.http.raw_body

    ressources = xml_body.search('ressources').map { |r|
      rsrc = {}
      r.children
      .reject { |c| c.class == Nokogiri::XML::Text }
      .each { |e| rsrc[e.name.to_sym] = e.children[0].to_s }
      rsrc
    }

    ressources = [{ urlAccesGar: '#', vignette: '#', libelle: 'Aucune ressource accessible' }] if ressources.empty?

    { statut: xml_body.search('statut').children[0].to_s,
     message: xml_body.search('messageDeRetour').children[0].to_s,
     ressources: ressources }
  end
end
