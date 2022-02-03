import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MealService {
  url:string = "http://localhost:8080/lunchtime/meal" ;
  tokenItem:any = localStorage.getItem('token');

  constructor(private http:HttpClient) { }
//---------------------ADD A MEAL---------------------
  async addMeal(meal:any){
      //REFORMULATION DE L'URL
      let url = this.url + "/add" ;
    
      //FORMUALTION DU HEADER
      const headers = { 'Authorization': this.tokenItem ,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
      };

      //REQUETE API
      return await this.http.put(url, meal , { headers }).toPromise();
  }
//---------------------UPDATE A MEAL IMAGE---------------------
  async updateMealImg(mealImg:any, mealId:number){
    //REFORMULATION DE L'URL
    let url = this.url + "/updateimg/" + mealId ;

    //FORMUALTION DU HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.patch(url, mealImg , { headers }).toPromise();
  }
//---------------------UPDATE MEAL---------------------
  async updateMeal(meal:any, mealId:number){
    //REFORMULATION DE L'URL
    let url = this.url + "/update/" + mealId ;

    //FORMUALTION DU HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.patch(url, meal , { headers }).toPromise();
  }
//---------------------FIND MEAL IMAGE---------------------
  async findMealImage(mealId:any){
    //REFORMULATION DE L'URL
    let url = this.url + "/findimg/" + mealId ;

    //FORMUALTION DU HEADER
    const headers = { 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
//---------------------FIND MEAL AVAILABLE FOR WEEK---------------------
  async findAvailableForWeek(weekNumber:number){
    //REFORMULATION DE L'URL
    let url = this.url + "/findallavailableforweek/" + weekNumber ;

    //FORMUALTION DU HEADER
    const headers = { 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
//---------------------FIND MEAL AVAILABLE FOR TODAY---------------------
  async findAvailableForToday(){
    //REFORMULATION DE L'URL
    let url = this.url + "/findallavailablefortoday" ;

    //FORMUALTION DU HEADER
    const headers = { 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
//---------------------FIND ALL---------------------
  async findAll(){
    //REFORMULATION DE L'URL
    var url = this.url + "/findall/" ;

    //FORMUALTION DU HEADER
    const headers = { 'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }

  
//---------------------FIND A MEAL---------------------
  async findAMeal(mealId:number){
    //REFORMULATION DE L'URL
    let url = this.url + "/find/" + mealId ;

    //FORMUALTION DU HEADER
    const headers = { 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
//---------------------DELETE A MEAL---------------------
  async deleteMeal(mealId:number){
    //REFORMULATION DE L'URL
    var url = this.url + "/delete/" + mealId ;

    //FORMUALTION DU HEADER
    const headers = {  'Authorization': this.tokenItem ,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.delete(url, { headers }).toPromise();
  }
}
