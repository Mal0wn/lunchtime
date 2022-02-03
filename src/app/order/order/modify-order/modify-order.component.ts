import { Component,  Inject,  OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-modify-order',
  templateUrl: './modify-order.component.html',
  styleUrls: ['./modify-order.component.css']
})
export class ModifyOrderComponent implements OnInit {

  public item: any;
  constructor( private dialogRef: MatDialogRef<ModifyOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any){ 
    this.item = data.order;
  }

  ngOnInit(): void {
  }

  add(quant: any){
    this.item.quantity[this.item.quantity.indexOf(quant)].quantity++;
  }

  remove(quant: any){
    this.item.quantity[this.item.quantity.indexOf(quant)].quantity--;
  }

  removeMeal(quant: any){
    this.item.quantity.splice(this.item.quantity.indexOf(quant), 1);
  }

  trackByMeal(quant: any): number{
    return quant.meal.id;
  }
  emitValue(status: number = 0){
    this.item.modalStatus = status;
    this.dialogRef.close(this.item);
  }
}
