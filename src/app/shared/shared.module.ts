import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickNumberComponent } from './pick-number/pick-number.component';
import { UserFilterPipe, OrderFilterPipe, StatusFilterPipe } from './filter.pipe';



@NgModule({
  declarations: [
    PickNumberComponent,
    UserFilterPipe,
    OrderFilterPipe,
    StatusFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PickNumberComponent,
    UserFilterPipe,
    OrderFilterPipe,
    StatusFilterPipe
  ]
})
export class SharedModule { }
