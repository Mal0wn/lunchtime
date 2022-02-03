import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'; 
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { MealService } from 'src/app/service/meal.service';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.css']
})

export class AddMealComponent implements OnInit {

  AddMealForm: FormGroup; 
  mealName: FormControl; 
  mealPrice: FormControl; 
  mealImage: FormControl ;

  msgError:string = "" ;
  categoryId:any = 0 ;
  categoryName:string = "" ;
  avatar:any = ""  ;

  imagePath:string = "" ;
  base64Output : string = "data:image/png;base64,";
  mealWeekAvailable:any = [] ;

  weeks:any = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53] ; ;

//------------------------------- Constructeur -------------------------------------
  constructor(private router:Router, private mealService:MealService, private route:ActivatedRoute, private builder: FormBuilder,private toastr:ToastrService ) {
     //CONFIGURATION DES VALIDATORS : NOM ARTICLE
     this.mealName = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    //CONFIGURATION DES VALIDATORS : PRIX ARTICLE
    this.mealPrice = new FormControl('', [
      Validators.required
    ]);

    this.mealImage = new FormControl('', [
      Validators.required
    ]);

    //FORMATION DU FORMULAIRE REACTIF DE MODIFICATION D'ARTICLE
    this.AddMealForm = this.builder.group({
      nomArticle: this.mealName,
      prixArticle: this.mealPrice,
      image: this.mealImage
    });
  }
//------------------------------- On Init -------------------------------------
  ngOnInit(): void {
    //RÉCUPÉRATION DE L'ID DE L'UTILISATEUR PAR UN SCREEN DE L'URL
    this.categoryId = this.route.snapshot.paramMap.get('idCategory');

    //Affichage du nom de la catégorie en fonction de l'id de la categorie recu en parametre de l'url
    switch(this.categoryId){
      case "0" :
       this.categoryName = "Autres" ;
       this.categoryId = 0 ;
       break ;
      case "1" :
       this.categoryName = "Apéritif" ;
       this.categoryId = 1 ;
      break;
      case "2" :
       this.categoryName = "Entrée" ;
       this.categoryId = 2 ;
      break;
      case "3" :
       this.categoryName = "Plats Principaux" ;
       this.categoryId = 3 ;
      break;
      case "4" :
       this.categoryName = "Les A-Cotés" ;
       this.categoryId = 4 ;
      break;
      case "5" :
       this.categoryName = "Les Desserts" ;
       this.categoryId = 5 ;
      break;
      case "6" :
       this.categoryName = "Brunchs et Dejeuners" ;
       this.categoryId = 6 ;
      break;
      case "7" :
       this.categoryName = "Soupes et Potages" ;
       this.categoryId = 7 ;
      break;
      case "8" :
       this.categoryName = "Sauce et Vinaigrettes" ;
       this.categoryId = 8 ;
      break;
      case "9" :
       this.categoryName = "Boissons et Cocktails" ;
       this.categoryId = 9 ;
      break;
      case "10" :
       this.categoryName = "Sandwichs" ;
       this.categoryId = 10 ;
      break;
      case "11" :
       this.categoryName = "Snacks" ;
       this.categoryId = 11 ;
      break;
    }
  }
//------------------------------- Ajout d'un item a la categorie choisie -------------------------------------
  async onAddItem(){
    //Requete asynchrone d'ajout d'un meal a une categorie
    try {
      //Formation de l'objet a inserer en bdd
      let meal = {
        "description": "",
        "label": this.AddMealForm.value.nomArticle,
        "image": {
          "imagePath": this.imagePath,
          "image64": this.avatar
        },
        "priceDF": this.AddMealForm.value.prixArticle,
        "availableForWeeks": this.mealWeekAvailable ,
        "ingredientsId": [],
        "category": this.categoryId
      }
      //Requete au service meal
      await this.mealService.addMeal(meal) ;
  
      //REDIRECTION
      this.router.navigate(['/lunchHomepage']);
    } 
    catch (error:any) {
      //GESTION DES ERREURS ET MESSAGES D'ERREURS
      if(error['status'] == 401){
        this.showBadToaster("Mais Chef ! T'es plus connecté :( ... Reviens :D ! ");
      }else{
        this.showBadToaster('Chef, chef ! On a un problème :( ' + error['status'] + ' ' + error.error['exceptionMessage']);
      }
    }
  }
//------------------------------- Retour à la homepage de la lunchlady -------------------------------------
  onReturn(){
    //REDIRECTION
    this.router.navigate(['/lunchHomepage']);
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
//------------------------------- Modification de l'image de l'element a ajouter --------------------------
  async onModifyAvatar(file:any){
    try {
      //Recuperation du path de l'image
        this.imagePath = file.name ;  

        //Conversion de l'image en base 64
        this.convertFile(file).subscribe(base64 => {
          this.base64Output = this.base64Output + base64;
          this.avatar = this.base64Output ;
        });

    } catch (error:any) {
      //GESTION DES ERREURS ET MESSAGES D'ERREURS
      if(error['status'] == 401){
        this.showBadToaster("Mais Chef ! T'es plus connecté :( ... Reviens :D ! ");
      }else{
        this.showBadToaster('Chef, chef ! On a un problème :( ' + error['status'] + ' ' + error.error['exceptionMessage']);
      }
    }
  }
//---------------------------------- Conversion du path en base 64 ----------------------------------------
  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event:any) => result.next(btoa(event.target.result.toString()));
    return result;
  }
//--------------------------------- Gestion des disponibilité des semaine en fonctions des checkboxs ----------------
  onChangeCheckbox(event:any){
    //Compteur necessaire a la suppression des checkboxs
    let count = 0 ;

    //Si la checkbox est deja cochée alors on décoche
    if(event.target.checked == true){
      this.mealWeekAvailable.push(parseInt(event.target.value, 10)) ;
    }else{
      this.mealWeekAvailable.forEach((meal:any) => {
        if(meal == event.target.value){
          this.mealWeekAvailable.splice(count, 1) ;
        }
        count = count + 1 ;
      });
    }
  } 
}
