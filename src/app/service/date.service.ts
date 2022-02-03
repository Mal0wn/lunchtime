import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

//-------------------- Constructeur ------------------------
  constructor() { }
//-------------------- Récupération de la date du lundi de la semaine actuelle ------------------------
  getMondayFromDate(day: Date): Date {
    /* return new Date( day.setDate( day.getDate() - day.getDay() +1)); */
    let d = day;
    d.setDate( d.getDate() - day.getDay() + 2);
    return d;
  }
//-------------------- Récupération de la date du vendredi de la semaine actuelle ------------------------
  getFridayFromDate(day: Date): Date {
    let d = day;
    d.setDate( d.getDate() - day.getDay() + 6);
    return d;
  }
}
