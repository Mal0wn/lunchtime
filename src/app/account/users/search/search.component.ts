import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  criteria: string = "";

//---------- CONSTRUCTEUR -----------------
  constructor() { }
//---------- ON INIT -----------------
  ngOnInit(): void {
  }
//---------- SEND CRITERIA -----------------
  sendCriteria(){
    this.search.emit(this.criteria) ;
  }
//---------- CLEAR CRITERIA -----------------
  clearCriteria(){
    this.criteria='';
    this.sendCriteria();
  }
}
