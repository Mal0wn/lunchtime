import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.css']
})
export class CurrentOrderComponent implements OnInit {
  
  currentOrders:any = [] ;
  userId:any = "" ;
  msgError:string = "" ;
  orders:any = [] ;
  thereIsOrders:boolean = false ;
  todayDate:any ;

//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router: Router, private route:ActivatedRoute, private orderService:OrderService, private datePipe:DatePipe) { }

//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
    //RÉCUPÉRATION DE L'ID DE L'UTILISATEUR PAR UN SCREEN DE L'URL
    this.userId = this.route.snapshot.paramMap.get('userId');
    //Récuperation des commandes en cours pour l'utilisateur connecté
    this.getOrdersForUser(this.userId);
  }
//----------------------- Récuperation des commandes en cours pour l'utilisateur connecté -----------------
  async getOrdersForUser(userId:number){
  //Requete asynchrone de recuperation des commande en cours pour l'utilisateur connecté
    try {
      let currentOrders = this.orders = await this.orderService.getOrdersForUser(userId);
      //verification s'il y a des commandes en cours
      if(currentOrders == ""){
        this.thereIsOrders = false;
      }else{
        this.thereIsOrders = true ;
      }

    } catch (error:any) {
      if(error['status'] == 401){
        this.msgError = "Identifiant ou Mot de Passe Incorrect"
      }else{
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }

    //Tris des commandes
    this.sortOrders();
  }
//------------------------------- Tris des commandes en cours récuperées ----------------------------
  sortOrders(){
    //pour chaque commandes recuperée
    this.orders.forEach( (element:any) => {
      //Récuperation de la date du jour
      let date:Date = new Date ;
      this.todayDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      //Selon le status de la commande, attribution d'unestring explicative
      switch(element.status){
        case 0 :
          element.status = "En Attente" ;
        break ;
        case 1:
          element.status = "Délivrée" ;
        break ;
        case 2 :
          element.status = "Annulée" ;
        break ;
      }

    //Push dans le tableau des commandes en cours
    this.currentOrders.push(element) ;
  });

  }
//-------------------- RETOURNE VERS LE MENU ----------------------------------------------
  onReturnMenu(){
    //REDIRECTION
    this.router.navigate(['homepage']);
  }
//-------------------- DELETE ORDER ----------------------------------------------
  async deleteOrder(orderId:any){
    //Requete asynchrone de suppression d'une commande
    try {
     //Requete APi de suppression d'une commande en cours
     await this.orderService.deleteOrder(orderId) ;
     //Récuperation de la liste des commandes en cours pour l'utilisateur connecté afin de resfresh la liste
     this.getOrdersForUser(this.userId) ;
    } 
    catch (error:any) {
      if(error['status'] == 401){
        this.msgError = "Identifiant ou Mot de Passe Incorrect"
      }else{
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }
  }
//-------------------- Modifier une commande en cours ----------------------------------------------
  async modifyOrder(orderId:any){}
//-------------------- REDIRECTION VERS LA PAGE DES UTILISATEURS ----------------------------------------------
  onReturnUsers(){
    //REDIRECTION
    this.router.navigate(['users']);
  }
//-------------------- REDIRECTION VERS LA PAGE DE L'UTILISATEUR CIBLÉ ----------------------------------------------
  onReturnUser(){
    //REDIRECTION
    this.router.navigate(['user/' + this.userId]);
  }
}

