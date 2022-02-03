import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../shared/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  url: string = 'http://localhost:8080/lunchtime/order';
  tokenItem: any = localStorage.getItem('token');

  //-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private http: HttpClient) { }
//------------------RECUPERER UN USER SELON SON ID ----------------------------------------------
  getByUserId$(userId: number): Observable<Order[]> {
    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };

    return this.http.get<Order[]>(`${this.url}/findallforuser/${userId}`, { headers });
  }

  //------------------RECUPERER UN USER SELON SON ID ----------------------------------------------
  getAllOrders$(): Observable<Order[]> {
    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };

    return this.http.get<Order[]>(`${this.url}/findall`, { headers});
  }
//------------------RECUPERER UN USER SELON UNE DATE (DEBUT + FIN) ET LE STATUS ----------------------------------------------
  getAllOrdersForDate$(dateStart: string, dateEnd: string, status: number): Observable<Order[]> {

    const params = `?status=${status}&beginDate=${dateStart}&endDate=${dateEnd}`;
    const headers = {
      'Authorization': this.tokenItem, // change with this.tokenItem
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };

    return this.http.get<Order[]>(`${this.url}/findallbetweendateinstatus${params}`, { headers });
  }
//------------------ Recuperation des Commandes d'un utilisateur ---------------------------------
  async getOrdersForUser(userId: number) {
    //REFORMULATION DE L'URL
    let url = this.url + "/findallforuser/" + userId;

    //FORMUALTION DU HEADER 
    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
//-------------------- Recuperation des informations d'une commande -------------------------
  async getOrderInfos(orderId: number) {
    //REFORMULATION DE L'URL
    var url = this.url + "/find/" + orderId;

    //FORMUALTION DU HEADER 
    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.get(url, { headers }).toPromise();
  }
//-------------------- Suppression d'une commande ------------------------
  async deleteOrder(orderId: any) {
    //REFORMULATION DE L'URL
    let url = this.url + "/cancel/" + orderId;

    //FORMUALTION DU HEADER 
    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.patch(url, "", { headers }).toPromise();
  }
//--------------------- Valider et payer une commande -------------------------
  async deliverAndPayOrder(orderID: number) {

    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };

    return await this.http.patch(`${this.url}/deliverandpay/${orderID}/-1`, '', { headers }).toPromise();
  }
//--------------------- Passer une commande -------------------------
  async addOrder( order: any){
    let url = `${this.url}/add`;
    console.log("URL = ",url)
    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };
    return this.http.put( url, order, { headers }).toPromise();
  }

  async updateOrder( order: any, orderId: number,){
    let url = `${this.url}/update/${orderId}`;
    console.log("URL = ",url)
    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };
    return this.http.patch( url, order, { headers }).toPromise();
  }
}
