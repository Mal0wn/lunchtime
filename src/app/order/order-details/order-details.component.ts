import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  orderDate:string = "Lundi 4 Juin 2021" ;
  orderHour:string = "5H08" ;

  order:any = []

  orderId:any = "" ;
  userId:any = "" ;
  orderStatus:any = "" ;
  msgError:string = "" ;
  isLunch:boolean = true ; 
  
//-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router:Router, private route:ActivatedRoute, private orderService:OrderService, private datePipe:DatePipe) { }

//-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
    //RECUPERATION DE L'ID DE L'UTILISATEUR PAR URL
   this.orderId = this.route.snapshot.paramMap.get('orderId');
   this.userId = this.route.snapshot.paramMap.get('userId');
   this.getOrderDetails(this.orderId) ;
   
   let userInfos:any = localStorage.getItem('user') ;
   userInfos = JSON.parse(userInfos) ;
   this.isLunch = userInfos.isLunchLady ;
  }

async  getOrderDetails(orderId:any){
    try {

    this.order = await this.orderService.getOrderInfos(orderId) ;
    console.log(this.order) ;

    let date:Date = new Date ;
    let todayDate:any = this.datePipe.transform(date, 'yyyy-MM-dd');

    if(this.order.creationDate >= todayDate){

      switch(this.order.status){
        case 0 :
          this.order.status = "En Attente" ;
        break ;
        case 1:
          this.order.status = "Délivrée" ;
        break ;
        case 2 :
          this.order.status = "Annulée" ;
        break ;
      }
    
    }else{
      switch(this.order.status){
        case 0 :
          this.order.status = "Passée" ;
        break ;
        case 1:
          this.order.status = "Délivrée" ;
        break ;
        case 2 :
          this.order.status = "Annulée" ;
        break ;
      }
  }

      
    } catch (error:any) {
      if(error['status'] == 401){
        this.msgError = "Identifiant ou Mot de Passe Incorrect"
      }else{
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }

  }

//-------------------- RETOURNE VERS LES COMMANDES ----------------------------------------------
  onReturnOders(){
    //REDIRECTION
    this.router.navigate(['order/' + this.userId ]);
  }

  onReturnCurrentOders(){
    //REDIRECTION
    this.router.navigate(['currentOrder/' + this.userId ]);
  }
}
