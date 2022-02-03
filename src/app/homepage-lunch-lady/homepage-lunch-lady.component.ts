import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../service/menu.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Meal } from '../shared/meal.interface';
import { Menu } from '../shared/menu.interface';
import { MealService } from '../service/meal.service';
import { ConstraintService } from '../service/constraint.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Constraint } from '../shared/constraint.interface';

@Component({
  selector: 'app-homepage-lunch-lady',
  templateUrl: './homepage-lunch-lady.component.html',
  styleUrls: ['./homepage-lunch-lady.component.css']
})

export class HomepageLunchLadyComponent implements OnInit {

  days:any = [
    {
      'id' : 0,
      'name' : "Lundi"
    },
    {
      'id' : 1,
      'name' : "Mardi"
    },
    {
      'id' : 2,
      'name' : "Mercredi"
    },
    {
      'id' : 3,
      'name' : "Jeudi"
    },
    {
      'id' : 4,
      'name' : "Vendredi"
    }
  ]

  categories:any = [] ;

  category0:any = [
    {
      "id" : 0,
      "name" : "Autres",
      "items" : []
    }
  ]

  category1:any = [
    {
      "id" : 1,
      "name" : "Apéritif",
      "items" : []
    }
  ]

  category2:any = [
    {
      id : 2,
      name : "Entrée",
      items : []
    }
  ];

  category3:any = [
    {
      "id" : 3,
      "name" : "Plats Principaux",
      "items" : []
    }
  ];

  category4:any = [
    {
      "id" : 4,
      "name" : "Les A-Cotés",
      "items" : []
    }
  ];

  category5:any = [
    {
      "id" : 5,
      "name" : "Les Desserts",
      "items" : []
    }
  ];

  category6:any = [
    {
      "id" : 6,
      "name" : "Brunchs et Dejeuners",
      "items" : []
    }
  ];

  category7:any = [
    {
      "id" : 7,
      "name" : "Soupes et Potages",
      "items" : []
    }
  ]

  category8:any = [
    {
      "id" : 8,
      "name" : "Sauce et Vinaigrettes",
      "items" : []
    }
  ];


  category9:any = [
    {
      "id" : 9,
      "name" : "Boissons et Cocktails",
      "items" : []
    }
  ];

  category10:any = [
    {
      "id" : 10,
      "name" : "Sandwichs",
      "items" : []
    }
  ];

  category11:any = [
    {
      "id" : 11,
      "name" : "Snacks",
      "items" : []
    }
  ];

  Menus:any;
  getCarte:any ;
  getAllMeals:any;
  msgError:string = "" ;
  category:any ;
  plats: Array<Meal> = [];
  meal: any;
  Meal!: Meal;
  Menu!: Menu;
  http: any;
  submitted:boolean = false;
  MenuForm: FormGroup;
  maxOrderHour: FormControl = new FormControl('');

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router:Router, private menuService:MenuService, private toastr:ToastrService, private builder:FormBuilder, private mealService:MealService, private constraintService: ConstraintService) {
    //Groupe de select pour choisir les plats de la semaine
    this.MenuForm = this.builder.group({
      lundi: this.builder.group({
        mySelectMenu1: ["", []],
        mySelectMenu2 : ["", []],
      }),
      mardi: this.builder.group({
        mySelectMenu1: ["", []],
        mySelectMenu2 : ["", []],
      }),
      mercredi: this.builder.group({
        mySelectMenu1: ["", []],
        mySelectMenu2 : ["", []],
      }),
      jeudi: this.builder.group({
        mySelectMenu1: ["", []],
        mySelectMenu2 : ["", []],
      }),
      vendredi: this.builder.group({
        mySelectMenu1: ["", []],
        mySelectMenu2 : ["", []],
      })
    });
  }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
    //Chargement des plats du jour de la semaine
    this.onChargeWeekMenu() ;
    //Chargement de la carte disponible actuellement
    this.onChargeCarte();
    this.onLoadConstraint();
  }
//-------------------- Select des plats du jour ----------------------------------------------
  async selectMealsOfWeek() {
    this.submitted = true ;

    //création de tableaux avec key et value
      const array = Object.entries(this.MenuForm.value);
      const arrayMap = new Map();

    // i = index du jour
      let i = 0;
      for (;i < array.length; i++) {
        const element: any = array[i][1];
        const verif = arrayMap.get(element.mySelectMenu1);
        const verif2 = arrayMap.get(element.mySelectMenu2);

        if(element.mySelectMenu1) {
          if(verif) {
            arrayMap.set(element.mySelectMenu1 , `${verif}` + i )
          } else {
            arrayMap.set(element.mySelectMenu1 , `${i}` )
          }
        }
        if(element.mySelectMenu2) {
          if(verif2) {
            arrayMap.set(element.mySelectMenu2 , `${verif2}` + i )
          } else {
            arrayMap.set(element.mySelectMenu2 , `${i}` )
          }
        }
      }
    //pour chaque element recupéré
    arrayMap.forEach((element, id) => {
      //requete patch recup item puis patch item
        this.menuService.getItem(id)
      .then((val:any)=>{
        val.description = element
        return this.menuService.modifyItem(val)
      })
      this.showGoodToaster("Plats ajoutés avec succès ! ");
    })
  }
  async onLoadConstraint(){
    try{
      let cons: any = await this.constraintService.getConstraint(1);
      let tmp : string = cons.orderTimeLimit.substring(0, 5);
      this.maxOrderHour.setValue(cons.orderTimeLimit);
    }catch{

    }
  }
//-------------------- CHARGEMENT DES PLATS DU JOUR POUR LA SEMAINE ACTUELLE ----------------------------------------------
  async onChargeWeekMenu(){
  //RECUPERATION DE LA DATE ACTUELLE
  let dateActuelle:any = new Date();
  //CALCUL DU NUMÉRO DE LA SEMAINE ACTUELLE
  let premierJanvier:any = new Date(dateActuelle.getFullYear(),0,1);
  let nombreDeJourDifference = Math.floor((dateActuelle - premierJanvier) / (24 * 60 * 60 * 1000));
  let numSemaineActuelle = Math.ceil(( dateActuelle.getDay() + 1 + nombreDeJourDifference) / 7);

  //REQUETE ASYNCHRONE DE RECUPERATION DES PLATS DU JOUR POUR LA SEMAINE ACTUELLE
  try {
    //REQUETE AU SERVICE MENU
    this.Menus = await this.menuService.getWeekMenu(numSemaineActuelle) ;
    console.log(this.Menus) ;

    //Pour tout les menus recuperer
    this.Menus.forEach((Menu:any) => {
      //Si le menu possede un plat alors on le push dans un tableau
      if(Menu.meals) {
        Menu.meals.forEach((meal: any)=> {
          let isAlreadyThere: boolean = false ;

          this.plats.forEach((plat) => {
            if(plat.label === meal.label){
              isAlreadyThere = true ;
            }
          }) ;

          if(!isAlreadyThere){
            this.plats.push(meal) ;
          }

        });
      }
    }
    );
    console.log(this.plats) ;
  }
  catch (error: any) {
    //GESTION DES ERREURS ET MESSAGES D'ERREUR
    if(error['status'] == 401){
      this.msgError = "Identifiant ou Mot de Passe Incorrect"
    }else{
      this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
    }
  }
  }
//------------------- CHARGEMENT DE LA CARTE DISPONIBLE ACTUELLEMENT -----------------------------------------
  async onChargeCarte(){
  //REQUETE ASYNCHRONE DE RECUPERATION DE LA CARTE DISPONIBLE POUR CETTE SEMAINE
   try {
     //REQUETE AU SERVICE MENU
     this.getCarte = await this.menuService.getCarte() ;

     //FOREACH DU RESULTAT POUR TRIER LES ELEMENTS DE LA CARTE PAR CATEGORIE
     this.getCarte.forEach((element:any) => {

      //Tris et création de tableaux en fonction de la catégorie
     switch(element.category){
       case 0 :
         this.category0[0]['items'].push(element) ;
       break ;
       case 1 :
         this.category1[0]['items'].push(element) ;
       break ;
       case 2 :
         this.category2[0]['items'].push(element) ;
       break ;
       case 3 :
         this.category3[0]['items'].push(element) ;
       break ;
       case 4 :
         this.category4[0]['items'].push(element) ;
       break ;
       case 5 :
         this.category5[0]['items'].push(element) ;
       break ;
       case 6 :
         this.category6[0]['items'].push(element) ;
       break ;
       case 7 :
         this.category7[0]['items'].push(element) ;
       break ;
       case 8 :
         this.category8[0]['items'].push(element) ;
       break ;
       case 9 :
         this.category9[0]['items'].push(element) ;
       break ;
       case 10 :
         this.category10[0]['items'].push(element) ;
       break ;
       case 11 :
         this.category11[0]['items'].push(element) ;
       break ;
     }
     });

     this.categories.push(this.category0);
     this.categories.push(this.category1);
     this.categories.push(this.category2);
     this.categories.push(this.category3);
     this.categories.push(this.category4);
     this.categories.push(this.category5);
     this.categories.push(this.category6);
     this.categories.push(this.category7);
     this.categories.push(this.category8);
     this.categories.push(this.category9);
     this.categories.push(this.category10);
     this.categories.push(this.category11);
   }
   catch (error: any) {
     //GESTION DES ERREURS ET MESSAGES D'ERREURS
     if(error['status'] == 401){
       this.showBadToaster("Mais Chef ! T'es plus connecté :( ... Reviens :D ! ");
     }else{
       this.showBadToaster('Chef, chef ! On a un problème :( ' + error['status'] + ' ' + error.error['exceptionMessage']);
     }
   }

 }
// EFFACER LES PLATS DE LA SEMAINE
async deleteMealofWeek(){
  this.getAllMeals = await this.mealService.findAll() ;
  //pour chaque element recupéré
  this.getAllMeals.forEach((element: any, id: number) => {
    element.description = "null"
    //requete patch recup item puis patch item
      this.mealService.findAMeal(id)
    .then((val:any)=>{
      if(val.description){
        val.description = element.description;
      }
      return this.mealService.updateMeal(val, element.id)
    })
    .then((val:any)=>{
    })

  })
  this.showGoodToaster("Il n'y a plus de plats pour la semaine ! ");
}

//-------------------- CHANGEMENT D'UN PLATS DU JOUR ----------------------------------------------
  onChangePlatsDuJour(dayId:string){
    //REDIRECTION VERS LA PAGE DE MODIFICATION
    this.router.navigate(['modifyDailyMeal/:' + dayId ]);
  }
//-------------------- CHANGEMENT D'UN ELEMENT DE LA CARTE ----------------------------------------------
  onModifyItem(item:any){
    this.router.navigate(['modifyMeal/' + item.id ]);
  }
//-------------------- SUPPRESSION D'UN ELEMENT DE LA CARTE----------------------------------------------
  async onDeleteMeal(meal:any){
    //Requete asynchrone de suppression d'un element de la carte
    try {
      //Requete API au service des meal
      await this.mealService.deleteMeal(meal.id) ;

      //REFRESH DE LA PAGE POUR METTRE A JOUR LES MODIFICATIONS
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/lunchHomepage']);
      });
    }
    catch (error:any) {
       //GESTION DES ERREURS ET MESSAGES D'ERREURS
      if(error['status'] == 401){
        this.msgError = "Identifiant ou Mot de Passe Incorrect"
      }else{
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }
  }
//-------------------- AJOUT D'UN ELEMENT A LA CARTE ----------------------------------------------
  onAddNewItem(category:any){
    this.router.navigate(['addMeal/' + category[0].id]);
  }

  async onChangeConstraint(){
    let cns = {
      "orderTimeLimit": this.maxOrderHour.value +":00",
    };
    try{
      await this.constraintService.update(cns);
      await this.onLoadConstraint();
    }catch{
      this.showBadToaster("Chef , Chef ! on à un soucis avec l'horloge")
    }
    this.showGoodToaster("L'heure de fin des commandes à été changée capitaine ! :)");
  }
//-------------------- FONCTIONS DES TOASTER ----------------------------------------------
   showGoodToaster(message:string){
    this.toastr.success(message) ;
  }
  showBadToaster(message:string){
    this.toastr.error(message) ;
  }
  showCleverToaster(message:string){
    this.toastr.info(message) ;
  }
}
