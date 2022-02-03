import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user$: any = "" ;
  userId:any = 45 ;
  msgError: string = "" ;
  userInfo :any = "" ;
  nbCreditAsk:number = 0 ;
  nbDebitAsk:number = 0 ;
  sexe:string = "" ;
  isLunch:boolean = false ;

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router:Router, private route: ActivatedRoute, private userService: UserService,private toastr:ToastrService) { }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
   //RÉCUPÉRATION DE L'ID DE L'UTILISATEUR PAR UN SCREEN DE L'URL
   this.userId = this.route.snapshot.paramMap.get('userId');
   //APPEL A LA RÉCUPERATION DES DONNÉES DE L'UTILISATEUR
   this.getUserInfos(this.userId) ;
  }
//-------------------- RECUPERATION DES DONNÉES DE L'UTILISATEUR ----------------------------------------------
  async getUserInfos(userId:number){
    //REQUETE ASYNCHRONE DE RECUPERATION DES DONNÉES DE L'UTILISATEUR
    try {
      //REQUETE DE RECUPERATION DES DONNÉES DE L'UTILIATEUR AU SERVICE UTILIATEUR
      this.userInfo = await this.userService.getUserInfos(userId);
      this.isLunch = this.userInfo.isLunchLady ;

      //SELON LE RESULTAT DU SEX RECU : ATTRIBUTION DE LA VALEUR EN STRING
      switch(this.userInfo.sex){
        case 0 : 
          this.sexe = "Masculin" ;
        break;
        case 1 : 
          this.sexe = "Féminin" ;
        break ;
        case 2 : 
          this.sexe = "Autre" ;
        break ;
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
//-------------------- VIDER LES INPUTS LORS D'UN CLIC ----------------------------------------------
  onClickInputAVider(event:any){
    //VIDAGE DE L'INPUT
    event.target.value = "" ;
  }
//-------------------- CREDITER UN COMPTE ----------------------------------------------
  async onCreditAccount(userId:number){
    //REQUETE ASYNCHRONE DE CREDITER UN COMPTE
    try {
      //REQUETE AU SERVICE DES UTILISATEURS
      await this.userService.creditUser(userId, this.nbCreditAsk);

      //REFRESH DE LA PAGE POUR METTRE A JOUR LES MODIFICATIONS 
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['user/' + userId]);
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
//-------------------- DEBITER UN COMPTE ----------------------------------------------
  async onDebitAccount(userId:number){
   //REQUETES ASYNCHRONE AFIN DE DEBITER UN COMPTE
    try {
      //REQUETE VERS LE SERVICE DES UTILISATEURS
      await this.userService.debitUser(userId, this.nbDebitAsk);

      //REFRESH DE LA PAGE AFIN DE METTRE A JOUR LES MODIFICATIONS
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['user/' + userId]);
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
//-------------------- DESACTIVER UN COMPTE ----------------------------------------------
  async onDeactiveAccount(userId:number){
    //REQUETE ASYNCHRONE DE DESACTIVATION DE COMPTE
    try {
      //REQUETE VERS LE SERVICE DES UTILISATEUR
      await this.userService.desactiveAccount(userId);

      //REFRESH DE LA PAGE AVEC MISE A JOUR DES DONNÉES
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['user/' + userId]);
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
//-------------------- REACTIVATION DU COMPTE D'UN UTILISATEUR ----------------------------------------------
  async onReActivateAccount(userId:number){
    //REQUETE ASYNCHRONE DE REACTIVATION DU COMPTE D'UN UTILISATION
    try {
      //REQUETE VERS LE SERVICE DES UTILISATEURS
      await this.userService.reactiveMyAccount(userId);

      //REFRESH DE LA PAGE POUR AFFIHER LES MISES A JOUR
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['user/' + userId]);
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
//-------------------- RETOUR VERS LA PAGE DES UTILISATEURS ----------------------------------------------
  onReturnUsers(){
    //REDIRECTION
    this.router.navigate(['users']);
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
