import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from 'src/app/shared/order.interface';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit{

  @Input() orderInput?: Order;
  @Output() orderDelete: EventEmitter<number> = new EventEmitter();
  @Output() orderDeliver: EventEmitter<number> = new EventEmitter();

//---------------------- Constructeur --------------------------
  constructor() { }
//---------------------- On Init --------------------------
  ngOnInit(): void {
    console.log(this.orderInput)
  }
//---------------------- DELETE ORDER --------------------------
  deleteOrder(){
    if( this.orderInput){
      this.orderDelete.emit(this.orderInput.id);
    }
  }
//---------------------- DELIVRER ET PAYER UNE COMMANDE --------------------------
  deliverAndPayOrder(){
    if( this.orderInput)
    this.orderDeliver.emit(this.orderInput.id);
  }
}
