import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  credit:number = 0 ;
  user:any ;

  name:string = "" ;
  firstname:string = "" ;
  email:string = "" ;
  adress:string = "" ;
  town:string = "" ;
  phone:number = 0 ;
  sex:number = 0 ;
  sexe: string = "" ;
  postalCode:number = 0 ;
  avatar:any = "" ;
  isLunch:boolean = false ;
  msgError:string = "" ;

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router: Router, private userService:UserService, private toastr:ToastrService  ) { }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
    //RÉCUPÉRATION DES DONNÉES LOCALES DE L'UTILISATEUR
    let user:any = localStorage.getItem('user') ;
    this.user = JSON.parse(user);
    this.isLunch = this.user.isLunchLady ;

    //PASSAGE DES VALEURS DE L'UTILISATEUR LOCAL VERS LE FORMULAIRE
    this.name = this.user.name ;
    this.firstname = this.user.firstname ;
    this.email = this.user.email ;
    this.adress = this.user.address ;
    this.town = this.user.town ;
    this.phone = this.user.phone ;
    this.sex = this.user.sex ;
    this.credit = this.user.wallet ;
    this.postalCode = this.user.postalCode ;

    //AFFICHAGE DU SEX SELON LE NOMBRE DE L'UTILISATEUR
    if(this.sex == 0){
      this.sexe = "Masculin" ;
    }else if(this.sex = 1){
      this.sexe = "Féminin" ;
    }else if(this.sex == 2){
      this.sexe = "Autre" ;
    }else{
      this.sexe = "Non Défini" ;
    }

    this.getImage(this.user.id) ;
  }
//-------------------- RECUPERER L'IMAGE D'UN UTILISATEUR ----------------------------------------------
  async getImage(userId:number){
    //REQUETE ASYNCHRONE DE RECUPERATION DE L'AVATAR DE 'LUTILISATEUR
    try {
      //REQUETE API AU SERVICE USER
      let userAvatarInfos:any = await this.userService.getUserAvatar(userId) ;
      this.avatar = userAvatarInfos['image64'] ;
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
//-------------------- SOLDER UN COMPTE ----------------------------------------------
  async onSoldMyAccount(){
    //REQUETE ASYNCHRONE POUR SOLDER UN COMPTE
     try {
      //REQUETE VERS LE SERVICE DES UTILIATEURS
      await this.userService.soldMyAccount(this.user.id);
      this.showGoodToaster("Votre Compte a été soldé, renvenez vite nous voir :(") ;
      //REDIRECTION
      this.router.navigate(['homepage']);
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
//-------------------- MODIFICATION DES INFORMATIONS D'UN UTILISATEUR ----------------------------------------------
  onModifInformations(){
    //REDIRECTION
    this.router.navigate(['changeInformations']); //Navigation
  }
//-------------------- CONSTRUCTEUR ----------------------------------------------
  onReturnMenu(){
    //REDIRECTION
    this.router.navigate(['homepage']); //Redirection
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
