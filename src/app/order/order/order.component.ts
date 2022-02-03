import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModifyOrderComponent } from './modify-order/modify-order.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {

  todayDate:any ;
  currentOrders: any = [];
  userId: any = "";
  msgError: string = "";
  orders: any = [];
  thereIsOrders: boolean = false;
  quantity: any;

  //-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router: Router, private route: ActivatedRoute, private orderService: OrderService, private datePipe: DatePipe, private dialog: MatDialog) { }

  //-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
    //RÉCUPÉRATION DE L'ID DE L'UTILISATEUR PAR UN SCREEN DE L'URL
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getOrdersForUser(this.userId);
  }

  async getOrdersForUser(userId: number) {
    try {
      this.orders = await this.orderService.getOrdersForUser(userId);
      if (this.orders == "") {
        this.thereIsOrders = false;
      } else {
        this.thereIsOrders = true;
      }

    } catch (error: any) {
      if (error['status'] == 401) {
        this.msgError = "Identifiant ou Mot de Passe Incorrect"
      } else {
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }
    //Tris des commandes
    this.sortOrders();
    this.orders.sort((a: any, b: any) => {
      return b.id - a.id;
    });
  }
//--------------------- TRIS DE COMMANDES DE L'UTILISATEUR --------------------------------
  sortOrders(){
    //Pour toutes les commandes recuperées
    this.orders.forEach( (element:any) => {
      //récuperation de la date actuelle
      let date:Date = new Date ;
      this.todayDate = this.datePipe.transform(date, 'yyyy-MM-dd');

        //Selon le status de la commande, on lui attribut une string de définition
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
    
      //Push dans le tableau des commandes
      this.currentOrders.push(element) ;
    });
  }
//-------------------- RETOURNE VERS LE MENU ----------------------------------------------
  onReturnMenu(){
    //REDIRECTION
    this.router.navigate(['homepage']);
  }
//-------------------- Suppression de la commande ---------------------------
  async deleteOrder(orderId: any) {
    try {
      await this.orderService.deleteOrder(orderId);
      this.orders[this.orders.findIndex((e: any) => e.id == orderId)].status = 2;
      this.sortOrders();
    } catch (error: any) {
      if (error['status'] == 401) {
        this.msgError = "Identifiant ou Mot de Passe Incorrect"
      } else {
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }
  }
//-------------------- Modification de  la commande ---------------------------
  async modifyOrder(order: any) {
    try {
      let tmpOrder = {
        userId: order.user.id,
        constraintId: -1,
        quantity: []
      };
      let quant: any = [];
      order.quantity.forEach(async (item: any) => {
        let tmpQuant = {
          quantity: item.quantite,
          mealId: item.meal.id,
        }
        quant.push(tmpQuant);
      });
      tmpOrder.quantity = quant;
      tmpOrder.constraintId = -1; 
      await this.orderService.updateOrder(tmpOrder, order.id);
      this.orders[this.orders.findIndex((e: any) => e.id == order.id)] = order;
    } 
    catch (error: any) {
      if (error['status'] == 401) {
        this.msgError = "vous n'etes pas connecté !"
      } else {
        this.msgError = 'Problème rencontré : ' + error['status'] + ' ' + error.error['exceptionMessage']; //Formation du message d'erreur
      }
    }

  }

  async displayModal(order: any) {
    let tmp: any;
    let modal = this.dialog.open(ModifyOrderComponent, {
      autoFocus: true,
      data: {
        order: order
      }
    });
    modal.afterClosed().subscribe(
      item => { tmp = item; }
      , undefined, () => {
        console.log("check :", tmp)
        if (tmp) {
          if (tmp.modalStatus == -1) {
            this.deleteOrder(order.id);
          } else if (tmp.modalStatus == 1) {
            console.log(tmp);
            delete tmp.modalStatus;
            this.modifyOrder(tmp);
          }
        }
      }
    );
  }
}
