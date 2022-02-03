import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; //Redirection des pages
import { UserService } from 'src/app/service/user.service'; //Service de gestion de l'utilisateur
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';//Imports necessaires au formulaire reactifs et au bon fonctionnement du formulaire (validators)
import { User } from 'src/app/shared/user.interface';
import { ToastrService } from 'ngx-toastr'; //Systeme de Toast pour avertissement de l'utilisateur
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-change-informations',
  templateUrl: './change-informations.component.html',
  styleUrls: ['./change-informations.component.css']
})

export class ChangeInformationsComponent implements OnInit {
  submitted:boolean = false;
  changeInformationsForm: FormGroup; 
  name: FormControl;
  firstname: FormControl;
  phone: FormControl;
  email: FormControl; 
  adress: FormControl;
  postalCode: FormControl;
  town: FormControl;
  password: FormControl; 
  passwordVerif: FormControl;
  sex: FormControl;
  imagePath:string = "" ;
  image64:any ;
  msgError: string = '';
  people:any ;
  user:any ;
  avatar?:any ;
  base64Output : string = "data:image/png;base64,";

//-------------------- CONSTRUCTEUR ----------------------------------------------
 constructor( private router: Router, private builder: FormBuilder,private userService:UserService, private toastr:ToastrService) {
     //CONFIGURATEUR DES VALIDATORS : EMAIL
     this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    //CONFIGURATEUR DES VALIDATORS : MOT DE PASSE
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);

    //CONFIGURATEUR DES VALIDATORS : NOM
    this.name = new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]*')
    ]);

    //CONFIGURATEUR DES VALIDATORS : PRENOM
    this.firstname = new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]*')
    ]);

    //CONFIGURATEUR DES VALIDATORS : TELEPHONE
    this.phone = new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);

    //CONFIGURATEUR DES VALIDATORS : ADRESSE POSTALE
    this.adress = new FormControl('', [
      Validators.required
    ]);

    //CONFIGURATEUR DES VALIDATORS : CODE POSTALE
    this.postalCode = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
      Validators.pattern('[0-9]*')
    ]);

    //CONFIGURATEUR DES VALIDATORS : VERIFICATION DE MOT DE PASSE
    this.passwordVerif = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);

    //CONFIGURATEUR DES VALIDATORS : VILLE
    this.town = new FormControl('', [
      Validators.required
    ]);

    //CONFIGURATEUR DES VALIDATORS : SEXE
    this.sex = new FormControl('', [
      Validators.required
    ]);

    //CRÉATION DU FORMULAIRE REACTIF DE CREATION DE COMPTE 
    this.changeInformationsForm = this.builder.group({
      name: this.name,
      firstname: this.firstname,
      phone: this.phone,
      email: this.email,
      adress: this.adress,
      postalCode: this.postalCode,
      password: this.password,
      passwordVerif: this.passwordVerif,
      sex: this.sex,
      town: this.town
    });

    //RECUPERATION DE L'OBJET USER POUR RECUPERER LES INFORMATIONS LCOALES
    let userCrypted:any = localStorage.getItem('user') ;
    let userUncrypted:User = JSON.parse(userCrypted);
    this.user = userUncrypted ;

    //AJOUT DES VALEURS RECUPERÉES DE L'UTILISATEUR DANS LE FORMULAIRE PRÉ-REMPLIE
    this.changeInformationsForm.setValue({
      name: this.user.name ,
      firstname: this.user.firstname ,
      phone: this.user.phone ,
      email: this.user.email ,
      adress: this.user.address ,
      postalCode: this.user.postalCode,
      password: "",
      passwordVerif: "",
      sex: this.user.sex ,
      town: this.user.town
   });

   this.getImage(this.user.id) ;
  }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
   this.getImage(this.user.id) ;
  }
//-------------------- GET AVATAR USER -------------------------------------
  async getImage(userId:number){
    //Requete asynchrone de recuperation de l'image de l'utilisateur
    try {
      //Recuperation de l'avatar par le service user
      let userAvatarInformations:any = await this.userService.getUserAvatar(userId) ;
      this.avatar = userAvatarInformations['image64'] ;
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
//-------------------- CHANGEMENT D'INFORMATIONS DE COMPTE ----------------------------------------------
  async changeInformationsAccount(){
  //BOUTON DE VALIDATION DU FORMULAIRE
  this.submitted = true;
  //RECUPERATION DES VALEURS MODIFIÉES POUR L'UPDATE EN BDD (VERIFICATION SI CHANGEMENT DE MOT DE PASSE)
  if(this.changeInformationsForm.value.password == ""){
      this.people = {
        "address": this.changeInformationsForm.value.adress,
        "postalCode": this.changeInformationsForm.value.postalCode,
        "email": this.changeInformationsForm.value.email,
        "name": this.changeInformationsForm.value.name,
        "firstname": this.changeInformationsForm.value.firstname,
        "phone": this.changeInformationsForm.value.phone,
        "town": this.changeInformationsForm.value.town,
        "sex": this.changeInformationsForm.value.sex
      }
  }else{
      this.people = {
        "address": this.changeInformationsForm.value.adress,
        "postalCode": this.changeInformationsForm.value.postalCode,
        "email": this.changeInformationsForm.value.email,
        "password": this.changeInformationsForm.value.password,
        "name": this.changeInformationsForm.value.name,
        "firstname": this.changeInformationsForm.value.firstname,
        "phone": this.changeInformationsForm.value.phone,
        "town": this.changeInformationsForm.value.town,
        "sex": this.changeInformationsForm.value.sex,
      }
    }

    //REQUETE ASYNCHRONE DE CHANGEMENT DES VALEURS
     try {
    //RECUPERATION DE 'LID DE L'UTILISATEUR A MODIFIER
      let idUser = this.user.id;
      //REQUETES DE CHANGEMENT AU SERVICE DE UTILISATEUR
      let requeteChangeInformations = await this.userService.changeInformationsAccount(this.people, idUser);
      //CHANGEMENT DE L'OBJET LOCAL DE STOCKAGE DES DONNÉES DE L'UTILISATEUR
      localStorage.setItem('user', JSON.stringify(requeteChangeInformations)) ;
      this.showGoodToaster("Modifications enregistrées ;) !");
      //REDIRECTION
      this.router.navigate(['myAccount']);
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
//-------------------- RETOUR EN ARRIERE ----------------------------------------------
  onReturn(){
    //REDIRECTION
    this.router.navigate(['myAccount']); 
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
//--------------------- MODIFICATION DE L'AVATAR DE L'UTILISATEUR  ---------------
  async onModifyAvatar(file:any){
    //Requete asynchrone de changement de l'avatar de l'utilisateur
    try {
        //Récuperation des informations du fichier choisi
        this.imagePath = file.name ;  
        //Convertion du path du fichier en string base 64
        this.convertFile(file).subscribe(base64 => {
          this.base64Output = this.base64Output + base64;
          this.avatar = this.base64Output ;
          //Enregistrement dans la BDD de l'objet contenant les informations de l'avatar de l'utilisateur
          this.onRecordImg() ;
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
//-------------------- ENREGISTREMENT DE L'AVATAR EN BDD --------------------------
  async onRecordImg(){
    //Formation de l'objet contenant les informations de l'avatar de l'utilisateur
    let objImage = {
      "imagePath": this.imagePath,
      "image64": this.base64Output
    }
    //Requetes asynchrone de changement d'avatar au service user
    await this.userService.onChangePhotoUser(this.user.id, objImage) ;
    //Redirection vers la page "mon compte"
    this.router.navigate(['myAccount']);
  }
//------------------- CONVERTION DU PATH D'UNE IMAGE EN STRING BASE 64 ---------------
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
}


