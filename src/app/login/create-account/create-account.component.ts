import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; //Redirection des pages
import { UserService } from 'src/app/service/user.service'; //Service de gestion de l'utilisateur
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';//Imports necessaires au formulaire reactifs et au bon fonctionnement du formulaire (validators)
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})

export class CreateAccountComponent implements OnInit {

  submitted = false; //Necessaire à la gestion des erreurs (activation des validators)
  createAccountForm: FormGroup; //Formulaire de creation de compte
  name: FormControl;
  firstname: FormControl;
  phone: FormControl;
  email: FormControl; //Email entré
  adress: FormControl;
  postalCode: FormControl;
  image: FormControl ;
  town: FormControl;
  password: FormControl; //Mot de Passe entré
  passwordVerif: FormControl;
  sex: FormControl;
  avatar: any ;
  image64:string = "" ;
  imagePath:string = "" ;
  msgError: string = '';
  people:any ;
  base64Output : string = "data:image/png;base64,";

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor( private router: Router, private builder: FormBuilder,private userService:UserService, private toastr:ToastrService ) {

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

    //CONFIGURATEUR DES VALIDATORS : ADRESSE
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

    //CONFIGURATEUR DES VALIDATORS : VERIFICATION DU MOT DE PASSE
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

    this.image = new FormControl('', [
      Validators.required
    ]);

    //CRÉATION DU FORMULAIRE RÉACTIF DE CRÉATION DE COMPTE
    this.createAccountForm = this.builder.group({
      name: this.name,
      firstname: this.firstname,
      phone: this.phone,
      email: this.email,
      adress: this.adress,
      postalCode: this.postalCode,
      password: this.password,
      passwordVerif: this.passwordVerif,
      image: this.image,
      sex: this.sex,
      town: this.town
    });
  }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {}
//-------------------- CREATION D'UN COMPTE UTILISATEUR ----------------------------------------------
  async createAccount(){
    //GESTION DES VALIDATORS
    this.submitted = true;

    //RECUPERATION DES INFORMATIONS RENTRÉES PAR L'UTILISATEUR
    this.people = {
      "address": this.createAccountForm.value.adress,
      "wallet": 0,
      "postalCode": this.createAccountForm.value.postalCode,
      "email": this.createAccountForm.value.email,
      "isLunchLady": false,
      "password": this.createAccountForm.value.password,
      "name": this.createAccountForm.value.name,
      "firstname": this.createAccountForm.value.firstname,
      "phone": this.createAccountForm.value.phone,
      "town": this.createAccountForm.value.town,
      "sex": this.createAccountForm.value.sex,
      "image": {
        "imagePath": this.imagePath,
        "image64": this.avatar
      }
    }

     //REQUETE ASYNCHRONE DE CREATION DU COMPTE
     try {
      //REQUETE AU SERVICE DES UTILISATEURS
      await this.userService.createAccount(this.people);

      //MESSAGE UTILISATEUR
      this.showGoodToaster("Compte crée ! Connecte-toi de suite :D") ;

      //REDIRECTION
      this.router.navigate(['login']);
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
//-------------------- RETOUR VERS LA PAGE DE LOGIN ----------------------------------------------
 onReturn(){
   //REDIRECTION
    this.router.navigate(['login']);
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
//-------------------- MODIFICATION DE L'AVATAR --------------------------------------------
  async onModifyAvatar(file:any){
    try {
        //Récuperation du path de l'image choisie
        this.imagePath = file.name ;

        //Conversion du path de l'image choisie, enregistrement et modification de l'avatar
        this.convertFile(file).subscribe(base64 => {
          this.base64Output = this.base64Output + base64;
          this.avatar = this.base64Output ;
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
//-------------------- Convertion du path d'une image en string de base 64 ------------------------
  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event:any) => result.next(btoa(event.target.result.toString()));
    return result;
  }
}
