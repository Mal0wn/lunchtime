import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; //Redirection des pages
import { UserService } from 'src/app/service/user.service'; //Service de gestion de l'utilisateur
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'; //Imports necessaires au formulaire reactifs et au bon fonctionnement du formulaire (validators)
import jwt_decode from 'jwt-decode';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false; //Necessaire à la gestion des erreurs (activation des validators)
  loginForm: FormGroup; //Formulaire de login
  email: FormControl; //Email entré
  password: FormControl; //Mot de Passe entré
  msgError:string = "" ;
  jwt:any = "" ;
  secretKey:any = "-KaPdSgVkXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z$C&F)J@NcRfUjXn2r5u7x!A%" ;

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private userService:UserService ,private router:Router ,private builder: FormBuilder, private location : Location, private toastr:ToastrService) {
   //CONFIGURATION DES VALIDATORS : EMAIL
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    //CONFIGURATION DES VALIDATORS : MOT DE PASSE
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]);

    //FORMATION DU FORMULAIRE REACTIF DE CONNEXION
    this.loginForm = this.builder.group({
      email: this.email,
      password: this.password
    });
  }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void { }
//-------------------- REFRESH DE LA PAGE ----------------------------------------------
  refreshPage(){
    //REFRESH
    location.reload();
  }
//-------------------- CONNEXION ----------------------------------------------
  async login() {
   //REQUETE ASYNCHRONE DE CONNEXION
    try {
      //REQUETE VERS LE SERVICE DES UTILISATEURS
      let requeteLogin = await this.userService.login(this.loginForm);
      
      //RECUPERATION DU TOKEN D'AUTHENTIFICATION
      this.jwt = requeteLogin.headers.get('Authorization') ;
      //DECRYPTAGE DU TOKEN
      let tokenUncrypte:any =  jwt_decode(this.jwt); 

      //STOCKAGE DU JETON ET DES INFORMATIONS DE L'UTILISATEUR EN LOCAL
      localStorage.setItem('token', this.jwt);
      localStorage.setItem('user', JSON.stringify(tokenUncrypte['user']));
      //MESSAGE UTILISATEUR CONNECTÉ
      this.showGoodToaster("Connecté !") ;

      //REDIRECTION
      this.router.navigate(['homepage']);
      //REFRESH DE LA PAGE
      setTimeout(this.refreshPage, 2000) ;
    }
    catch (error: any) {
      //GESTION DES ERREURS ET MESSAGES D'ERREURS
      if(error['status'] == 401){
        this.showBadToaster("Identifiant ou Mot de Passe Incorrect :(");
      }else{
        this.showBadToaster('Chef, chef ! On a un problème :( ' + error['status'] + ' ' + error.error['exceptionMessage']);
      }
    }
  }
//-------------------- OUBLIS DU MOT DE PASSE ----------------------------------------------
  onResetPassword(){
    //REDIRECTION
    this.router.navigate(['resetPassword']);
  }
//-------------------- CREATION DE COMPTE ----------------------------------------------
  onCreateNewAccount(){
    //REDIRECTION
    this.router.navigate(['createAccount']);
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