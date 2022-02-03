import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/service/menu.service';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'; //Imports necessaires au formulaire reactifs et au bon fonctionnement du formulaire (validators)
import { Observable, ReplaySubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MealService } from 'src/app/service/meal.service';

@Component({
  selector: 'app-modify-meal',
  templateUrl: './modify-meal.component.html',
  styleUrls: ['./modify-meal.component.css']
})

export class ModifyMealComponent implements OnInit {

  getMealInfos:any = [] ;
  msgError:string = "" ;
  mealId:any = "" ;
  modifyMealForm: FormGroup; //Formulaire de login
  mealName: FormControl; //Email entré
  mealPrice: FormControl; //Mot de Passe entré
  mealImagePath:string = "" ;
  mealImage?:any ;
  mealbase64Image : string = "data:image/png;base64,";
  mealWeekAvailable:any = [] ;
  avatar:string = "" ;
  categoryName:string = "" ;
  preparedWeeksForFindWeeksAvailable:any = [] ;
  weeks:any = [] ;

//-------------------------- Constructeur -------------------------------------
  constructor(private router:Router, private menuService:MenuService, private route:ActivatedRoute, private builder: FormBuilder, private toastr:ToastrService, private mealService:MealService ) {
    //CONFIGURATION DES VALIDATORS : NOM ARTICLE
    this.mealName = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    //CONFIGURATION DES VALIDATORS : PRIX ARTICLE
    this.mealPrice = new FormControl('', [
      Validators.required
    ]);

    //FORMATION DU FORMULAIRE REACTIF DE MODIFICATION D'ARTICLE
    this.modifyMealForm = this.builder.group({
      mealName: this.mealName,
      mealPrice: this.mealPrice
    });
  } 
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
    //RÉCUPÉRATION DE L'ID DE L'UTILISATEUR PAR UN SCREEN DE L'URL
    this.mealId = this.route.snapshot.paramMap.get('mealId');
    //Recuperation de l'element a modifier et ses informations
    this.getMeal(this.mealId) ;
    //Récuperation de l'image de l'element
    this.getMealImage(this.mealId) ;
  }
//-------------------- GET MEAL IMAGE----------------------------------------------
  async getMealImage(mealId:number){
    //Requete asynchrone de recuperation de l'image de l'element
    try {
      //Requete API de recuperation des informations de l'image de l'element
      let mealImageFromBack:any = await this.mealService.findMealImage(mealId) ;

      if(mealImageFromBack['image64'] != "data:image/png;base64,"){
        this.avatar = mealImageFromBack['image64'] ; 
      }
      
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
//-------------------- RECUPERER LES INFORMATIONS DE L'UTILISATEUR ----------------------------------------------
  async getMeal(mealId:number){
    //REQUETE ASYNCHRONE DE RECUPERATION DE LA CARTE DISPONIBLE POUR CETTE SEMAINE
    try {
      //REQUETE AU SERVICE MENU
      this.getMealInfos = await this.mealService.findAMeal(mealId) ;

      //Recuperation de la categorie de l'element a modifier
      this.getMealCategory(this.getMealInfos) ;
      //Recuperation des semaines ou l'element est disponible
      this.mealWeekAvailable = this.getMealInfos.availableForWeeks ;
      //Changement des checkbox en fonction de la recuperation des semaines disponibles selectionnée à la création de l'element
      this.onChargeCheckboxChoosen() ;
      //Récuperation des semaines disopibiles pour l'afficher
      this.mealWeekAvailable = this.getMealInfos.availableForWeeks ;

      //AJOUT DES VALEURS RECUPERÉES DE L'UTILISATEUR DANS LE FORMULAIRE PRÉ-REMPLIE
      this.modifyMealForm.setValue({
        mealName:  this.getMealInfos.label ,
        mealPrice: this.getMealInfos.priceDF
      });
    }
    catch (error: any) {
      //GESTION DES ERREURS ET MESSAGES D'ERREURS
      if(error['status'] == 401){
        this.msgError = "Identifiant ou Mot de Passe Incorrect"
      }else{
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }
  }
//-------------------- RECUPERER LES INFORMATIONS DE L'UTILISATEUR ----------------------------------------------
  getMealCategory(meal:any){
    //Selon l'id de la category, on attribut le nom de la categorie
    switch(meal.category){
      case 0 :
        this.categoryName = "Autres" ;
      break ;
      case 1 :
        this.categoryName = "Apéritif" ;
      break ;
      case 2 :
        this.categoryName = "Entrée" ;
      break ;
      case 3 :
        this.categoryName = "Plats Principaux" ;
      break ;
      case 4 :
        this.categoryName = "Les A-Cotés" ;
      break ;
      case 5 :
        this.categoryName = "Les Desserts" ;
      break ;
      case 6 :
        this.categoryName = "Brunchs et Déjeuners" ;
      break ;
      case 7 :
        this.categoryName = "Soupes et Potages" ;
      break ;
      case 8 :
        this.categoryName = "Sauce et Vinaigrettes" ;
      break ;
      case 9 :
        this.categoryName = "Boissons et Cocktails" ;
      break ;
      case 10 :
        this.categoryName = "Sandwichs" ;
      break ;
      case 11 :
        this.categoryName = "Snacks" ;
      break ;
    }
  }
//-------------------- MODIFIER UN ELEMENT DE LA CARTE ----------------------------------------------
  async onModifyMeal(){
  //REQUETE ASYNCHRONE DE RECUPERATION DE LA CARTE DISPONIBLE POUR CETTE SEMAINE
  try {
    //Récuperation des informations de l'element a modifier
    let meal = this.getMealInfos ;
    meal.label = this.modifyMealForm.value.mealName ;
    meal.priceDF = this.modifyMealForm.value.mealPrice ;

    //REQUETE AU SERVICE MENU
    await this.menuService.modifyItem(meal) ;

    this.onReturn() ;
  }
  catch (error: any) {
    //GESTION DES ERREURS ET MESSAGES D'ERREURS
    if(error['status'] == 401){
      this.msgError = "Identifiant ou Mot de Passe Incorrect"
    }else{
      this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
    }
  }
  }
//-------------------- RETOUR A LA HOMEPAGE DE LA LUNCH LADY -----------------------------------
  onReturn(){
    //REDIRECTION
    this.router.navigate(['/lunchHomepage']);
  }
//-------------------- RETOUR A LA HOMEPAGE DE LA LUNCH LADY -----------------------------------
  async onModifyMealAvatar(file:any){
    try {
      //Récuperation du path de l'image
        this.mealImagePath = file.name ;  

        //Conversion de l'image en string de base 64
        this.convertFile(file).subscribe(base64 => {
          this.mealbase64Image = this.mealbase64Image + base64;
          this.mealImage = this.mealbase64Image ;
        });

        let mealId = this.mealId ;
        let objImage = {
          "imagePath": this.mealImagePath,
          "image64": this.mealImage
        }
        console.log(objImage) ;
        await this.mealService.updateMealImg(objImage, mealId) ;

        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['modifyMeal/' + mealId]);
        }); 
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
//-------------------------- Conversion du path de l'image en string de base 64 ------------------------------
  convertFile(file : File) : Observable<string> {
     const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    //Conversion du fichier en string bianire
    reader.readAsBinaryString(file);
    //Conversion du fichier en string base 64
    reader.onload = (event:any) => result.next(btoa(event.target.result.toString()));
    //Renvoie la base 64 du fichier
    return result;
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
//------------------------ Changement lors d'appuis sur les checkbox des semaines ou l'element est disponible ----------------------
  onChangeCheckbox(event:any){
    //Necessaire pour récuperer l'index dans le tableau des semaines disponible de la semaine cherchée
    let count = 0 ;

    //Si elle est deja checkée, alors on la retire de l'array et  on la décoche
    if(event.target.checked == true){
      this.mealWeekAvailable.push(parseInt(event.target.value, 10)) ;
    }else{
      //Sinon on la coche et on la push dans l'array
      this.mealWeekAvailable.forEach((meal:any) => {
        if(meal == event.target.value){
          this.mealWeekAvailable.splice(count, 1) ;
        }
        count = count + 1 ;
      });
    }
  }
//------------------------ Chargement des semaines deja cochées au paravant lors de la création de l'element ----------------------
  onChargeCheckboxChoosen(){
    //Pour chaque semaine de l'année
    for(let i = 1; i < 54; i++){
      //Création d'un objet de la semaine
      let objWeek = {
        "id": i,
        "checked" : false
      }
      //Création du tableau de semaine utilisables avec les checkbox
      this.weeks.push(objWeek) ;
    }
    
    //Si dans la semaine est dans la liste des semaines deja cochées alors on attribut la value checked dans la liste des semaines complete
    for(let y = 0; y < this.mealWeekAvailable.length; y++){
      for(let i = 0; i < this.weeks.length; i++){
        if(this.mealWeekAvailable[y] == this.weeks[i].id){
          this.weeks[i].checked = true ;
        }
      }
    }
  }
}
