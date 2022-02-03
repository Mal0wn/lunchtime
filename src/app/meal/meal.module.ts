import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMealComponent } from './add-meal/add-meal.component';
import { ModifyMealComponent } from './modify-meal/modify-meal.component';
import { ReactiveFormsModule } from '@angular/forms'; //Pour les formualires réacifs

@NgModule({
  declarations: [
    AddMealComponent,
    ModifyMealComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports:[
    AddMealComponent,
    ModifyMealComponent
  ]
})
export class MealModule { }
