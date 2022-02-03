import { NgModule } from '@angular/core';
import { BucketComponent } from './bucket/bucket.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    BucketComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  exports:[
    BucketComponent
  ]
})
export class BucketModule { }
