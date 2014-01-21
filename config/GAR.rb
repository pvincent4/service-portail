# coding: utf-8

GAR = { wsdl: 'https://demonstrateur-gar-1.orion.education.fr/gar/ws/listeRessource?wsdl',
       endpoint: 'https://demonstrateur-gar-1.orion.education.fr:443/gar/ws/listeRessource',
       namespace: 'http://ws.gar.demogar.com/',
       soap_version: 1,
       convert_request_keys_to: :none,
       env_namespace: :soapenv,
       strip_namespaces: false,
       log: true,
       log_level: :debug,
       pretty_print_xml: true,
       ssl_verify_mode: :none  }
FS_ENTITYID = 'laclasse-ent'
