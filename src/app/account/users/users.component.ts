import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users:any = [] ;
  msgError:string = "" ;
  @Input() search: string = '';

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router: Router, private userService:UserService) { }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
    //Récuperation de la liste des utilisateurs
    this.getUsers() ;
  }
//---------------- RECUPERATION DE LA LISTE DES UTILISATEURS ----------------------------------------------
  async getUsers(){ 
    //Requete asynchrone de récuperation de la liste des utilisateurs
    try {
      //Requete vers le service user
      this.users = await this.userService.getAllUsers() ;
    }
    catch (error:any) {
      if(error['status'] == 401){
        this.msgError = "Identifiant ou Mot de Passe Incorrect" ;
      }else{
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }
  }
//-------------------- RETOUR AU MENU ----------------------------------------------
  onReturnMenu(){
    //REDIRECTION
    this.router.navigate(['lunchHomepage']);
  }
//-------------------- TRACK BY ID ----------------------------------------------
  trackByUserId(user: any): number {
    return user.id  
  }
//-------------------- RECHERCHE SEARCH BAR DANS LA LISTE DES UTILISATEURS -------------------
  onSearch(criteria: string){
    this.search = criteria;
  }
}
