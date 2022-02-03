import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constraint } from '../shared/constraint.interface';

@Injectable({
  providedIn: 'root'
})
export class ConstraintService {
  url: string = "http://localhost:8080/lunchtime/constraint";
  tokenItem: any = localStorage.getItem('token');
  constructor(private http: HttpClient) { }

  async update(constraint: any) {
    //REFORMULATION DE L'URL
    let url = this.url + "/update/1";

    //FORMUALTION DU HEADER
    const headers = {
      'Authorization': this.tokenItem,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
    };

    //REQUETE API
    return await this.http.patch(url, constraint, { headers }).toPromise();
  }
  async getConstraint(id: number){
    //REFORMULATION DE L'URL
    let url = this.url + "/find/"+id;

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
}
