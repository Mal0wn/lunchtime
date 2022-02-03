import { Component,  OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pick-number',
  templateUrl: './pick-number.component.html',
  styleUrls: ['./pick-number.component.css']
})
export class PickNumberComponent implements OnInit {

  public value: string = "";
  constructor( private dialogRef: MatDialogRef<PickNumberComponent>) { }

  ngOnInit(): void {
  }
  emitValue(){
    this.dialogRef.close(parseFloat(this.value));
  }
}