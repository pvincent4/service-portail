'use strict';

angular.module( 'portailApp' )
    .controller( 'CCNCtrl',
		 [ '$scope', 'APP_PATH',
		   function( $scope, APP_PATH ) {
		       $scope.prefix = APP_PATH;
		       $scope.display_archives = true;

		       $scope.thematiques_actuelles = [
			   { nom: '14-18',
			     description: '14-18',
			     url: 'http://14-18.laclasse.com/?url=spip.php%3Fpage%3Dsommaire&cicas=oui',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_14-18.svg',
			     couleur: 'jaune' },
			   { nom: 'Zérogaspi',
			     description: 'Zérogaspi',
			     url: 'http://zerogaspi.laclasse.com/?url=spip.php%3Fpage%3Dsommaire&cicas=oui',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_zero-gaspi.svg',
			     couleur: 'bleu' },
			   { nom: 'Philo',
			     description: 'Philo',
			     url: 'http://philo.laclasse.com/?url=spip.php%3Fpage%3Dsommaire&cicas=oui',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_philo.svg',
			     couleur: 'violet' },
			   { nom: 'Théatre',
			     description: 'Théatre',
			     url: 'http://theatre.laclasse.com/?url=spip.php%3Fpage%3Dsommaire&cicas=oui',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_theatre.svg',
			     couleur: 'rouge' },
			   { nom: 'AIR 2014',
			     description: 'Assises du Roman',
			     url: 'http://air.laclasse.com/?url=spip.php%3Fpage%3Dsommaire&cicas=oui',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_air-2014.svg',
			     couleur: 'vert' }
		       ];

		       $scope.thematiques_archivees = [
			   { couleur: 'gris2',
			     url: 'http://miam.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_miam.svg',
			     nom: 'Miam',
			     titre: ''
			   },
			   { couleur: 'bleu',
			     url: 'http://novaterra.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_odysseespatiale.svg',
			     nom: 'Odyssée spatiale',
			     titre: ''
			   },
			   { couleur: 'jaune',
			     url: 'http://archeologies.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_archeologie.svg',
			     nom: 'Archéologie',
			     titre: ''
			   },
			   { couleur: 'orange',
			     url: 'http://bd.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_bd.svg',
			     nom: 'BD',
			     titre: ''
			   },
			   { couleur: 'violet',
			     url: 'http://cine.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_cine.svg',
			     nom: 'Ciné',
			     titre: ''
			   },
			   { couleur: 'vert',
			     url: 'http://cluemo.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_cluemo.svg',
			     nom: 'Cluémo',
			     titre: ''
			   },
			   { couleur: 'rouge',
			     url: 'http://etudiantsvoyageurs.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_etudiantsvoyageurs.svg',
			     nom: 'Etudiants voyageurs',
			     titre: ''
			   },
			   { couleur: 'vert',
			     url: 'http://finisterrae.laclasse.com',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_finisterrae.svg',
			     nom: 'Finisterrae',
			     titre: ''
			   },
			   { couleur: 'gris4',
			     url: 'http://ledechetmatiere.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_dechetmatiere.svg',
			     nom: 'Le déchet matière',
			     titre: ''
			   },
			   { couleur: 'violet',
			     url: 'http://maisondeladanse.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_maisondeladanse.svg',
			     nom: 'Maison de la danse',
			     titre: ''
			   },
			   { couleur: 'bleu',
			     url: 'http://musique.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_musique.svg',
			     nom: 'Musique',
			     titre: ''
			   },
			   { couleur: 'jaune',
			     url: 'http://science.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_science.svg',
			     nom: 'Science',
			     titre: ''
			   },
			   { couleur: 'orange',
			     url: 'http://picture.laclasse.com/',
			     icon: '/app/vendor/charte-graphique-laclasse-com/images/thematiques/icon_picture.svg',
			     nom: 'Picture',
			     titre: ''
			   }
		       ];

		       $scope.toggle_archives = function() {
			   $scope.display_archives = !$scope.display_archives;
			   $scope.thematiques = $scope.display_archives ? $scope.thematiques_archivees : $scope.thematiques_actuelles;
		       };

		       $scope.toggle_archives();
		   }
		 ]
	       );
