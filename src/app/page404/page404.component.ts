import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css']
})
export class Page404Component implements OnInit {

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router : Router) { }
//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void { }
//-------------------- RETOURNE VERS LE MENU ----------------------------------------------
  returnOnMenu(){
    this.router.navigate(['homepage']);
  }
}
