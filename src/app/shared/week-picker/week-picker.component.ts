import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { DateService } from 'src/app/service/date.service';

@Injectable()
export class WeekDaySelectionRangeStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {
  }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    let d = date;
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -this._dateAdapter.getDayOfWeek(date) + 1);
      const end = this._dateAdapter.addCalendarDays(date, -this._dateAdapter.getDayOfWeek(date) + 5);
      return new DateRange<D>(start, end);
    }
    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-week-picker',
  templateUrl: './week-picker.component.html',
  styleUrls: ['./week-picker.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: WeekDaySelectionRangeStrategy,
    },
  ],
})
export class WeekPickerComponent implements OnInit {

  semaineActuelleLundi:any = "" ;
  semaineActuelleVendredi:any = "" ;
  semaineActuelle:any = "" ;

  @Output() dateEvent = new EventEmitter<string>();
  constructor(private dateService:DateService) { }

  ngOnInit(): void {

    this.semaineActuelleLundi = this.getMonday();
    this.semaineActuelleLundi = (this.semaineActuelleLundi.getMonth() +1) + "/" + this.semaineActuelleLundi.getDate() + "/" + this.semaineActuelleLundi.getFullYear() ;

    this.semaineActuelleVendredi = this.getFriday() ;
    this.semaineActuelleVendredi = (this.semaineActuelleVendredi.getMonth() +1) + "/" + this.semaineActuelleVendredi.getDate() + "/" + this.semaineActuelleVendredi.getFullYear() ;

    this.semaineActuelle = this.semaineActuelleLundi + " - " + this.semaineActuelleVendredi ;
  }

  onDateSelection(value: string) {
    this.semaineActuelle = "" ;        
    this.dateEvent.emit( value);
  }

  getMonday() {
    let date:any = new Date();
    var day = date.getDay(),
        diff = date.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }

  getFriday() {
    let date = new Date();
    var day = date.getDay(),
        diff = date.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(date.setDate(diff + 4));
  }
  
 
}
