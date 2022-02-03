import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/user.interface';
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = 'http://localhost:8080/lunchtime/user';
  url2: string = "http://localhost:8080/lunchtime" ; //URL de base de l'API
  auth_token: string = "" ;
  userInfos: any = "";
  tokenItem:any = localStorage.getItem('token');

//-------------------- CREATION DE COMPTE ----------------------------------------------
  constructor(private http: HttpClient) { }
//--------------------  CONNEXION ----------------------------------------------
  async login(loginForm : FormGroup){
    //REFORMULATION DE L'URL
    let url = this.url2 + "/login" ; 

    //REQUETE VERS L'API
    return await this.http.post(url, loginForm.value, { observe : 'response'}).toPromise();
  }
//--------------------  OUBLIE DE MOT DE PASSE ----------------------------------------------
  async forgotPassword(resetPasswordForm : FormGroup){
    //REFORMULATION DE L'URL
    let url = this.url2 + "/forgotpassword?email=" + resetPasswordForm.value.email ;
    //REQUETE VERS L'API
    return await this.http.post(url,"", {observe : 'response'}).toPromise();
  }
//--------------------  CONNEXION ----------------------------------------------
  async createAccount(people: any){
    //REFORMULATION DE L'URL
    let url = this.url + "/register" ;
    //FOMULATION DU HEADER
    const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'accept': 'application/json' };

    //REQUETE API
    return await this.http.put(url, people, { headers }).toPromise();
  }
//--------------------  SOLDER UN COMPTE UTILISATEUR ----------------------------------------------
  async soldMyAccount(id: number){
    //REFOMULATION URL
    let url = this.url + "/delete/" + id ;
    
    //FORMULATION HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.delete(url,  { headers }).toPromise();
  }
//--------------------  CHANGEMENT D'INFORMATIONS D'UN UTILISATEUR ----------------------------------------------
  async changeInformationsAccount(user: any, userId:number){
    //REFOMULATION URL
    let url = this.url + "/update/" + userId ;
    
    //FORMUALTION HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.patch(url, user,  { headers }).toPromise();
  }
//--------------------  DECONNEXION ----------------------------------------------
  onDeconnexion(){
    //SUPPRESSION DE L'OBJET LOCAL
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
//--------------------  VERIFICATION D'AUTHENTIFICATION ----------------------------------------------
  onVerifAuthentification(){
    //RECUPERATION DE L'OBJET USER LOCAL
    let userCrypted:any = localStorage.getItem('user');
    //DECRYPTAGE DE L'OBJET
    let userUncrypted:any = JSON.parse(userCrypted);

    //SELON LE RETOUR DE L'OBJET, ON DEFINIT LA CONNEXION
    if(userUncrypted == null){
      return 0;
    }else{
      let isLunchLady = userUncrypted.isLunchLady ;

      if(isLunchLady == false){
        return 1;
      }else{
        return 2 ;
      }
    } 
  }
//--------------------- Recuperation les inforations d'un utilisateur -------------------------
  getUser$(id: number): Observable<User>{
    return this.http.get<User>(`${this.url}/find/${id}`);
  }
//---------------------- Récuperation de tout les utilisateurs ------------------------------
  getAllUsers$(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/findall`);
  }
//---------------------- Update un utilisateur ------------------------
  updateUser$(user: User): Observable<User> {
    return this.http.patch<User>(`${this.url}/update/${user.id}`, user);
  }
//--------------------  RECUPERATION DES NFORMATIONS D'UN UTILISATEUR ----------------------------------------------
  async getUserInfos(userId:number){
    //REFOMULATION URL
    let url = this.url + "/find/" + userId ;

    //FORMULATION HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };
    
    //REQUETE API
    return await this.http.get(url,  { headers }).toPromise();
  }
//--------------------  CREDITER UN UTILISATEUR ----------------------------------------------
  async creditUser(userId:number, nbCreditAsk:number){

    //REFOMULATION URL
    let url = this.url + "/credit/" + userId + "?amount=" + nbCreditAsk ;

    //FORMULATION HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };
    
    //REQUETE API
    return await this.http.post(url, "",   { headers }).toPromise();
  }
//--------------------  DEBITER UN UTILISATEUR ----------------------------------------------
  async debitUser(userId:number, nbDebitAsk:number){
    //REFOMULATION DE L'URL
    let url = this.url + "/debit/" + userId + "?amount=" + nbDebitAsk ;

    //FORMUALTION HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };
    
    //REQUETE API
    return await this.http.post(url, "",   { headers }).toPromise();
  }
//--------------------  REACTIVER UN COMPTE UTILISATEUR ----------------------------------------------
  async reactiveMyAccount(userId:number){
    //REFORMUALTION URL
    let url = this.url + "/activate/" + userId ;
    
    //FORMULATION HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };
    
    //REQUETE API
    return await this.http.patch(url, "",   { headers }).toPromise();
  }
//--------------------  DEACTIVER UN COMPTE UTILISATEUR ----------------------------------------------
  async desactiveAccount(userId:number){
    //REFORMUALTION URL
    let url = this.url + "/desactivate/" + userId ;

    //FORMULATION HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };
    
    //REQUETE API
    return await this.http.patch(url, "",   { headers }).toPromise() ;
  }
//------------------------ RECUPERATION DE TOUT LES UTILISATEURS --------------------------------
  async getAllUsers(){
    //REFORMUALTION URL
    let url = this.url2 + "/user/findall" ;

    //FORMULATION HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };
    
    //REQUETE API
    return await this.http.get(url, { headers }).toPromise() ;
  }
//------------------------ RECUPERATION DE L'AVATAR D'UN UTILISATEUR ---------------------------------
async getUserAvatar(userId:number){
  //REFORMUALTION URL
  let url = this.url + "/findimg/" + userId ;

   //FORMULATION HEADER
  const headers = { 'Authorization': this.tokenItem ,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'accept': 'application/json',
  };

  //REQUETE API
  return await this.http.get(url,{ headers }).toPromise() ;
} 
//------------------------- CHANGEMENT DE LA PHOTO D'UN UTILISATEUR --------------------------
async onChangePhotoUser(userId:number, avatarObj:any){
  //REFORMUALTION URL
  let url = this.url + "/updateimg/" + userId ;

   //FORMULATION HEADER
   const headers = { 'Authorization': this.tokenItem ,
   'Content-Type': 'application/json',
   'Access-Control-Allow-Origin': '*',
   'accept': 'application/json',
   };

  //REQUETE API
  return await this.http.patch(url, avatarObj, { headers }).toPromise() ;
}
}
