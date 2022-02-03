import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; //Redirection des pages
import { UserService } from 'src/app/service/user.service'; //Service de gestion de l'utilisateur
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; //Imports necessaires au formulaire reactifs et au bon fonctionnement du formulaire (validators)
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})

export class ResetPasswordComponent implements OnInit {
  
  submitted = false; //Necessaire à la gestion des erreurs (activation des validators)
  resetPasswordForm: FormGroup; //Formulaire de login
  email: FormControl; //Email entré
  msgError: string = '';

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor( private router: Router, private builder: FormBuilder, private userService: UserService, private toastr:ToastrService ){
    //CONFIGURATION DES VALIDATORS : EMAIL
    this.email = new FormControl('', [Validators.required, Validators.email]);

    //CRÉATION DU FORMULAIRE RÉACTIF
    this.resetPasswordForm = this.builder.group({
      email: this.email,
    });
  }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {}
//-------------------- RENVOIE DU MOT DE PASSE ----------------------------------------------
  async resetPassword() {
    //REQUETE ASYNCHRONE D'ENVOIE DU MOT DE PASSE PAR MAIL
    try { 
      //REQUETE AU SERVICE DES UTILISATEURS
      await this.userService.forgotPassword(this.resetPasswordForm); 

      //MESSAGE UTILISATEUR
      this.showGoodToaster("Mail envoyé, notez le quelque part cette fois ci Capitaine ;) !") ;

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
//-------------------- RETOUR VERS LA PAGE DE CONNEXION  ----------------------------------------------
  onReturn() {
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
}
