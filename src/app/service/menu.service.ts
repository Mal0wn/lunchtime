import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../shared/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

 url:string = "http://localhost:8080/lunchtime" ;
 tokenItem:any = localStorage.getItem('token') ;

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private http:HttpClient) { }
//-------------------- RECUPERATION DES MENU DU JOUR POUR LA SEMAINE ----------------------------------------------
  async getWeekMenu(weeknum:number){
    //REFORMULATION DE L'URL
    let url = this.url + "/menu/findallavailableforweek/" + weeknum;

    //FORMATION DU HEADER
    const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
//--------------------- Recuperation des menu par jour --------------------------------
  getMenusByDay(): Observable<Menu[]> {
    return this.http.get<Menu[]>('http://localhost:8080/lunchtime/menu/findallavailablefortoday');
  }
//-------------------- RECUPERATION DE LA CARTE POUR UNE SEMAINE ----------------------------------------------
  async getCarte(){
    //REFORMULATION DE L'URL
      var url = this.url + "/meal/findallavailablefortoday" ;

      //FORMUALTION DU HEADER
      const headers = { 'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'accept': 'application/json' };

      //REQUETE API
      return await this.http.get(url, { headers }).toPromise();
  }
//---------------------- Recuperation des repas pour la semaine ----------------------------------
  async getMealForWeek(weeknum:number) {
    //REFORMULATION DE L'URL
    let url = this.url + "/meal/findallavailableforweek/" + weeknum;
    //FORMUALTION DU HEADER
    const headers = { 'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*',
                      'accept': 'application/json' };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
//----------------------- Modification d'un item ---------------------------------
  async modifyItem(item:any){
    //REFORMULATION DE L'URL
    let url = this.url + "/meal/update/" + item.id ;

    //FORMUALTION DU HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };
    //REQUETE API
    return await this.http.patch(url, item, { headers }).toPromise();
  }
//------------------------ Enregistrement d'un nouvel item -----------------------------------
  async addItem(item:any){
    //REFORMULATION DE L'URL
    let url = this.url + "/meal/add" ;

    //FORMUALTION DU HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };
    
    //REQUETE API
    return await this.http.put(url, item, { headers }).toPromise();
  }
//------------------------ Suppression d'un item ------------------------------------
  async deleteItem(itemId:number){
    //REFORMULATION DE L'URL
    let url = this.url + "/meal/delete/" + itemId ;

    //FORMUALTION DU HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.delete(url, { headers }).toPromise();
  }
//--------------------------- Recuperation des informations d'un item ----------------------------
  async getItem(itemId:number){
    //REFORMULATION DE L'URL
    let url = this.url + "/meal/find/" + itemId ;

    //FORMUALTION DU HEADER
    const headers = { 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
}
