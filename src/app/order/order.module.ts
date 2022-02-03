import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { AppRoutingModule } from '../app-routing.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DatePipe } from '@angular/common';
import { CurrentOrderComponent } from './current-order/current-order.component';
import { ModifyOrderComponent } from './order/modify-order/modify-order.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    OrderComponent,
    OrderDetailsComponent,
    CurrentOrderComponent,
    ModifyOrderComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatDialogModule
  ],
  exports:[
    OrderComponent,
    OrderDetailsComponent,
    CurrentOrderComponent,
  ],
  providers:[
    DatePipe
  ]
})
export class OrderModule { }
