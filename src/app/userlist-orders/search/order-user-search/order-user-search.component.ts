import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-order-user-search',
  templateUrl: './order-user-search.component.html',
  styleUrls: ['./order-user-search.component.css']
})
export class OrderUserSearchComponent implements OnInit {

  @Output() search: EventEmitter<string> = new EventEmitter();
  criteria: string = "";

//---------------------- Constructeur --------------------------
  constructor() { }
//---------------------- On Init --------------------------
  ngOnInit(): void {
  }
//---------------------- Send Criteria --------------------------
  sendCriteria(){
    this.search.emit(this.criteria)
  }
//---------------------- Clear Criteria --------------------------
  clearCriteria(){
    this.criteria='';
    this.sendCriteria();
  }
}
