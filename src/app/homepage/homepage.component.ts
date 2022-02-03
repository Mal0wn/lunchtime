import { Meal } from './../shared/meal.interface';
import { Component, OnInit } from '@angular/core';
import { MenuService } from '../service/menu.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Menu } from '../shared/menu.interface';
import { MealService } from '../service/meal.service';
import { ConstraintService } from '../service/constraint.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  days: any = [
    {
      'id' : 0,
      'name' : "Lundi",
      'date': "",
      'plats': [],
      'image64' : [
        {
          'idPlats': 0,
          'image64': ""
        },
        {
          'idPlats': 0,
          'image64': ""
        }
      ]
    },
    {
      'id' : 1,
      'name' : "Mardi",
      'date': "",
      'plats': [],
      'image64' : [
        {
          'idPlats': 0,
          'image64': ""
        },
        {
          'idPlats': 0,
          'image64': ""
        }
      ]
    },
    {
      'id' : 2,
      'name' : "Mercredi",
      'date': "",
      'plats': [],
      'image64' : [
        {
          'idPlats': 0,
          'image64': ""
        },
        {
          'idPlats': 0,
          'image64': ""
        }
      ]
    },
    {
      'id' : 3,
      'name' : "Jeudi",
      'date': "",
      'plats': [],
      'image64' : [
        {
          'idPlats': 0,
          'image64': ""
        },
        {
          'idPlats': 0,
          'image64': ""
        }
      ]
    },
    {
      'id' : 4,
      'name' : "Vendredi",
      'date': "",
      'plats': [],
      'image64' : [
        {
          'idPlats': 0,
          'image64': ""
        },
        {
          'idPlats': 0,
          'image64': ""
        }
      ]
    }
  ]
  categories:any = [] ;
  isInsert:boolean = false ;
  category0:any = [

    {
      id: 0,
      name: 'Autres',
      items: [],
    },
  ];

  category1: any = [
    {
      id: 1,
      name: 'Apéritif',
      items: [],
    },
  ];

  category2: any = [
    {
      id: 2,
      name: 'Entrée',
      items: [],
    },
  ];

  category3: any = [
    {
      id: 3,
      name: 'Plats Principaux',
      items: [],
    },
  ];

  category4: any = [
    {
      id: 4,
      name: 'Les A-Cotés',
      items: [],
    },
  ];

  category5: any = [
    {
      id: 5,
      name: 'Les Desserts',
      items: [],
    },
  ];

  category6: any = [
    {
      id: 6,
      name: 'Brunchs et Dejeuners',
      items: [],
    },
  ];

  category7: any = [
    {
      id: 7,
      name: 'Soupes et Potages',
      items: [],
    },
  ];

  category8: any = [
    {
      id: 8,
      name: 'Sauce et Vinaigrettes',
      items: [],
    },
  ];

  category9: any = [
    {
      id: 9,
      name: 'Boissons et Cocktails',
      items: [],
    },
  ];

  category10: any = [
    {
      id: 10,
      name: 'Sandwichs',
      items: [],
    },
  ];

  category11: any = [
    {
      id: 11,
      name: 'Snacks',
      items: [],
    },
  ];
  Meal!: Meal;
  Menu!: Menu;
  Menus: any;
  getCarte: any;
  getAllItem: any;
  msgError: string = '';
  bucket: any = [];
  platsTemp: any = [];
  plats: any = [];
  meal: any;
  today:any = "" ;
  todayHours:any = "" ;
  todayMinutes:any = "";
  maxMinutes: number = -1;
  maxHours: number = -1;

//-------------------- CONSTRUCTEUR ------------------------
  constructor(private menuService: MenuService, private router: Router, private toastr: ToastrService, private mealService: MealService, private constraintService: ConstraintService) {}
//-------------------- ON INIT ------------------------
  ngOnInit(): void {
    //Calcul de l'heure toute les 5 minutes
    setInterval(()=>{
      this.getTime() ;
    }, 60000);
    
    this.getTime();
    this.today = new Date().toISOString().substring(0, 10);

    //CHARGEMENT DES PLATS DU JOUR POUR LA SEMAINE
    this.onChargeWeekMenu();
    //CHARGEMENT DE LA CARTE POUR LA SEMAINE
    this.onChargeCarte() ;
    //RÉCUPERATION DES DATES DE LA SEMAINE ACTUELLE
    this.getDatesOfAllWeek();
  }

  async getTime(){
    this.todayHours = new Date().getHours();
    this.todayMinutes = new Date().getMinutes();
    this.today = new Date().toISOString().substring(0, 10);
    let cons: any = await this.constraintService.getConstraint(1);
    this.maxMinutes = parseInt(cons.orderTimeLimit.substring(3, 5));
    this.maxHours = parseInt(cons.orderTimeLimit.substring(0, 2));
    console.log( "h = "+this.maxHours+" vs "+this.todayHours)
    console.log(this.todayHours) ;
    console.log(this.todayMinutes);
  }
//-------------------- Recuperation des date des jours de la semaine actuelle ------------------------
  getDatesOfAllWeek() {
    let today = new Date();
    let day = today.getDay();
    let diff = today.getDate() - day + (day == 0 ? -6:1); // Ajustement si le jour J est un samedi
    //Pour tout les jours de la semaine, calcul de la date
    for(let i = 0; i < 5; i++){
      let tmpDate = new Date();
      let dateOut = new Date(tmpDate.setDate(diff + i));
      this.days[i].date = dateOut.toISOString().substring(0, 10);
    }

  }
//----------------------- CHARGEMENT DES PLATS DU JOUR POUR LA SEMAINE ACTUELLE ------------------------
  async onChargeWeekMenu() {
    //RECUPERATION DE LA DATE ACTUELLE
    let dateActuelle: any = new Date();

    //CALCUL DU NUMÉRO DE LA SEMAINE ACTUELLE
    let premierJanvier: any = new Date(dateActuelle.getFullYear(), 0, 1);
    let nombreDeJourDifference = Math.floor(
      (dateActuelle - premierJanvier) / (24 * 60 * 60 * 1000)
    );
    let numSemaineActuelle = Math.ceil(
      (dateActuelle.getDay() + 1 + nombreDeJourDifference) / 7
    );

    //REQUETE ASYNCHRONE DE RECUPERATION DES PLATS DU JOUR POUR LA SEMAINE ACTUELLE
    try {
      //REQUETE AU SERVICE MENU
      this.Menus = await this.menuService.getWeekMenu(numSemaineActuelle);

      //Pour tout les menus de la semaine recuperés si le menu est un meal
      this.Menus.forEach((Menu: any) => {
        if (Menu.meals) {
          //Alors on tris et on reforme un array
          Menu.meals.forEach((meal: any) => {
            if (meal) {
              let tmp = meal;
              // ON PUSH TOUT LES PLATS RELIES AU MENU DANS UN TABLEAU TEMPORAIRE
              this.platsTemp.push(tmp);
            }
          });
        }
      });

      // TRIER LES DOUBLONS
      let cache: any = {};

      this.plats = this.platsTemp.filter(function (
        elem: { id: string | number },
        index: any,
        array: any
      ) {
        return cache[elem.id] ? 0 : (cache[elem.id] = 1);
      });

      // REPARTIR LES PLATS CHOISIS DANS LE TABLEAU DES JOURS
      this.plats.forEach((meal: any) => {
        if (meal.description) {
          if (meal.description.includes('0')) {
            this.getImageMeal(meal.id, 0) ;
            this.days[0].plats.push(meal);
          }
          if (meal.description.includes('1')) {
            this.getImageMeal(meal.id, 1) ;
            this.days[1].plats.push(meal);
          }
          if (meal.description.includes('2')) {
            this.getImageMeal(meal.id, 2) ;
            this.days[2].plats.push(meal);
          }
          if (meal.description.includes('3')) {
            this.getImageMeal(meal.id, 3) ;
            this.days[3].plats.push(meal);
          }
          if (meal.description.includes('4')) {
            this.getImageMeal(meal.id, 4) ;
            this.days[4].plats.push(meal);
          }
        }
      });

    } catch (error: any) {
      //GESTION DES ERREURS ET MESSAGES D'ERREURS
      if (error['status'] == 401) {
        this.showBadToaster("Mais Chef ! T'es plus connecté :( ... Reviens :D ! ");
      } else {
        this.showBadToaster('Chef, chef ! On a un problème :( ' + error['status'] + ' ' + error.error['exceptionMessage']);
      }
    }
  }

 async getImageMeal(mealId: number, day: number){
    const mealImage: any = await this.mealService.findMealImage(mealId) ;

    if(this.days[day].image64[0].image64 === ""){
      this.days[day].image64[0].idPlats = mealId ;
      this.days[day].image64[0].image64 = mealImage.image64 ;
    }else{
      this.days[day].image64[1].idPlats = mealId ;
      this.days[day].image64[1].image64 = mealImage.image64 ;
    }
  }

//--------------------------- CHARGEMENT DE LA CARTE DES MEALS AVAILABLE FOR TODAY ----------------------
  async onChargeCarte() {
    //REQUETE ASYNCHRONE DE RECUPERATION DE LA CARTE DISPONIBLE POUR CE JOUR
    try {
      //REQUETE AU SERVICE MENU
      this.getCarte = await this.menuService.getCarte();
      //FOREACH DU RESULTAT POUR TRIER LES ELEMENTS DE LA CARTE PAR CATEGORIE
      this.getCarte.forEach((element: any) => {
        switch (element.category) {
          case 0:
            this.category0[0]['items'].push(element);
            break;
          case 1:
            this.category1[0]['items'].push(element);
            break;
          case 2:
            this.category2[0]['items'].push(element);
            break;
          case 3:
            this.category3[0]['items'].push(element);
            break;
          case 4:
            this.category4[0]['items'].push(element);
            break;
          case 5:
            this.category5[0]['items'].push(element);
            break;
          case 6:
            this.category6[0]['items'].push(element);
            break;
          case 7:
            this.category7[0]['items'].push(element);
            break;
          case 8:
            this.category8[0]['items'].push(element);
            break;
          case 9:
            this.category9[0]['items'].push(element);
            break;
          case 10:
            this.category10[0]['items'].push(element);
            break;
          case 11:
            this.category11[0]['items'].push(element);
            break;
        }
      });
      //AJOUT DES CATEGORIES DANS UN TABLEAU SI ELLES NE SONT PAS VIDES
      if (this.category0[0]['items'].length >= 1) {
        this.categories.push(this.category0);
      }
      if (this.category1[0]['items'].length >= 1) {
        this.categories.push(this.category1);
      }
      if (this.category2[0]['items'].length >= 1) {
        this.categories.push(this.category2);
      }
      if (this.category3[0]['items'].length >= 1) {
        this.categories.push(this.category3);
      }
      if (this.category4[0]['items'].length >= 1) {
        this.categories.push(this.category4);
      }
      if (this.category5[0]['items'].length >= 1) {
        this.categories.push(this.category5);
      }
      if (this.category6[0]['items'].length >= 1) {
        this.categories.push(this.category6);
      }
      if (this.category7[0]['items'].length >= 1) {
        this.categories.push(this.category7);
      }
      if (this.category8[0]['items'].length >= 1) {
        this.categories.push(this.category8);
      }
      if (this.category9[0]['items'].length >= 1) {
        this.categories.push(this.category9);
      }
      if (this.category10[0]['items'].length >= 1) {
        this.categories.push(this.category10);
      }
      if (this.category11[0]['items'].length >= 1) {
        this.categories.push(this.category11);
      }
    }
    catch (error: any) {
      //GESTION DES ERREURS ET MESSAGES D'ERREURS
      if (error['status'] == 401) {
        this.showBadToaster(
          "Mais Chef ! T'es plus connecté :( ... Reviens :D ! "
        );
      } else {
        this.showBadToaster(
          'Chef, chef ! On a un problème :( ' +
            error['status'] +
            ' ' +
            error.error['exceptionMessage']
        );
      }
    }
  }
//------------------------ AJOUTER UN MENU AU PANIER ----------------------------------------------
  onAddMenuToBucket(plat:any, date: string) {
    // onAddMenuToBucket(menuId:number)
    console.log(plat)
    //FOREACH ELEMENT DU PANIER, SI L'ELEMENT == L'ELEMENT RECU EN PARAMETRE ALORS AJOUT AU PANIER
    let bucketLocalStorage: any = localStorage.getItem('bucket');
    this.bucket = JSON.parse(bucketLocalStorage);
    this.isInsert = false;

    //Si le panier est vide alors on crée un objet meal et on le push directement
    if (this.bucket == null) {
      this.bucket = [];
      let quantite = 1;
      let ObjetItemToAdd = [{ name: "plat du jour", quantite: quantite}, plat];
      this.bucket.push(ObjetItemToAdd);
    } else {
      //sinon, chercher dans le panier si l'element existe deja
      this.bucket.forEach((meal: any) => {
        //Si oui, on ajoute seulement 1 à la quantite
        if (meal[1].id == plat.id) {
          this.isInsert = true;
          meal[0].quantite = meal[0].quantite + 1;
        }
      });

      //Si l'element n'a pas été trouvé alors on le crée et on le push
      if (!this.isInsert) {
        let quantite = 1;
        let ObjetItemToAdd = [{ name: "plat du jour", quantite: quantite}, plat];
        this.bucket.push(ObjetItemToAdd);
      }
    }

    //Suppression du panier déjà enregistré dans la local storage et enregistrement du nouveau panier
    localStorage.removeItem('bucket');
    let bucket = JSON.stringify(this.bucket);
    localStorage.setItem('bucket', bucket);
    this.showGoodToaster('Article ajouté au panier Chef ! ( Super choix , entre nous ) ;)');
  }
//--------------------------- AJOUTER UN ELEMENT DE LA CARTE AU PANIER -----------------------------------
  addItemToBucket(categoryName: any, item: any, itemId: number) {
    //FOREACH ELEMENT DU PANIER, SI L'ELEMENT == L'ELEMENT RECU EN PARAMETRE ALORS AJOUT AU PANIER
    let bucketLocalStorage: any = localStorage.getItem('bucket');
    this.bucket = JSON.parse(bucketLocalStorage);
    this.isInsert = false;
    console.log(item)
    //Si le panier est vide alors on crée un objet meal et on le push directement
    if (this.bucket == null) {
      this.bucket = [];
      let quantite = 1;
      let ObjetItemToAdd = [{ name: categoryName, quantite: quantite }, item];
      this.bucket.push(ObjetItemToAdd);
    } else {
      //sinon, chercher dans le panier si l'element existe deja
      this.bucket.forEach((meal: any) => {
        //Si oui, on ajoute seulement 1 à la quantite
        if (meal[1].id == itemId) {
          this.isInsert = true;
          meal[0].quantite = meal[0].quantite + 1;
        }
      });

      //Si l'element n'a pas été trouvé alors on le crée et on le push
      if (!this.isInsert) {
        let quantite = 1;
        let ObjetItemToAdd = [{ name: categoryName, quantite: quantite }, item];
        this.bucket.push(ObjetItemToAdd);
      }
    }

    //Suppression du panier déjà enregistré dans la local storage et enregistrement du nouveau panier
    localStorage.removeItem('bucket');
    let bucket = JSON.stringify(this.bucket);
    localStorage.setItem('bucket', bucket);
    this.showGoodToaster('Article ajouté au panier Chef ! ;)');
  }
//---------------------------- REDIRECTION SUR LE BUCKET -------------------------------------------------
  onGoToBucket() {
    this.router.navigate(['bucket']);
  }
//----------------------------- FONCTIONS DES TOASTER ---------------------------------------------------
  showGoodToaster(message: string) {
    this.toastr.success(message);
  }
  showBadToaster(message: string) {
    this.toastr.error(message);
  }
  showCleverToaster(message: string) {
    this.toastr.info(message);
  }
}
