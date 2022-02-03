import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrderService } from '../service/order.service';
import { Order } from '../shared/order.interface';
import { DateService } from '../service/date.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-userlist-orders',
  templateUrl: './userlist-orders.component.html',
  styleUrls: ['./userlist-orders.component.css']
})

export class UserlistOrdersComponent implements OnInit {

  orders$: Observable<Order[]> = of([]);
  @Input() search: string = '';
  public statusSelected: number = 0;
  public statusList: any = [
    { name: "En Attente", status: 0},
    { name: "Livrée", status: 1},
    { name: "Annulée", status: 2},
  ];
  public dateToday: string = new Date().toISOString().substring(0, 10);
  public i_day: number = 0;
  public dateSelect: string = "";
  public weekDays =[{
    day: "Monday", date: ""
  }, {
    day: "Tuesday", date: ""
  }, {
    day: "Wednesday", date: ""
  }, {
    day: "Thursday", date: ""
  }, {
    day: "Friday", date: ""
  },];
  public searchStr: string = "";

//---------------------- Constructeur --------------------------
  constructor(private orderService: OrderService, private dateService: DateService, private toastr: ToastrService) {
   }
//---------------------- On Init --------------------------
  ngOnInit(): void {
    this.orders$ = this.orderService.getAllOrdersForDate$('2019-01-01', this.dateToday, 0);

    let todayDate:any = new Date();
    let todayDay = todayDate.getDay() - 1 ;
    todayDate = (todayDate.getMonth() +1) + "/" + todayDate.getDate() + "/" + todayDate.getFullYear() ;
    this.onDateChange(todayDate) ;
    this.selectDay(todayDay) ;
  }

//---------------------- Changement de Date (week picker) --------------------------
  onDateChange(val: string) {
    let cpt = 2;
    //appel du service order pour recuperer les commandes d'une date donnée
    this.dateSelect = val;
    this.orders$ = this.orderService.getAllOrdersForDate$(
      this.dateService.getMondayFromDate( new Date( val)).toISOString().substring(0, 10),
      this.dateService.getFridayFromDate(new Date(val)).toISOString().substring(0, 10), 
      this.statusSelected
      );
    // mise a jour du filtre des dates
    this.weekDays.forEach( e => {
      let d = new Date(val);
      d.setDate( d.getDate() - d.getDay() + cpt);
      e.date = d.toISOString().substring(0, 10);
      cpt++;
    });
  }
//---------------------- Selection de jour --------------------------
  selectDay(i: number) {
    this.i_day = i;
  }
//---------------------- Suppression d'une commande --------------------------
  deleteOrder(id: number){
    this.orderService.deleteOrder(id);
    this.orders$ = this.orders$.pipe(map(orders => orders.filter(order => order.id != id)));
  }
//---------------------- Delivrer et payer une commande --------------------------
  async deliverAndPayOrder(id: number){
    //requete asynchrone pour delivrer et payer une commande
    try {
      //appel du service Order pour recuperer et payer la commande
      await this.orderService.deliverAndPayOrder(id);
      this.orders$ = this.orders$.pipe(map(orders => orders.filter(order => order.id != id)));
    } 
    catch (e:any) {
      //GESTION DES ERREURS ET MESSAGES D'ERREURS
      if(e['status'] == 412){
        this.toastr.error("Credit Insuffisant , veuillez jeuner !");
      }else{
        this.toastr.error('Chef, chef ! On a un problème 😦 ' + e['status'] + ' ' + e.error['exceptionMessage']);
      }
    }
  }
//---------------------- Track order by id --------------------------
  trackByOrderId(order: any): number{
    return order.id;
  }
//---------------------- On Search criteria --------------------------
  onSearch(criteria: string){
    this.search = criteria;
  }

  onStatusSelect(){
    this.orders$ = this.orderService.getAllOrdersForDate$(
      this.dateService.getMondayFromDate( new Date( this.dateSelect)).toISOString().substring(0, 10),
      this.dateService.getFridayFromDate( new Date( this.dateSelect)).toISOString().substring(0, 10), 
      this.statusSelected
      );
  }

  onTMPStatusSelect(){ // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ a changer pour onStatusSelect dans le html lors de la prod
    this.orders$ = this.orderService.getAllOrdersForDate$(
      this.dateService.getMondayFromDate( new Date( '2019-01-01')).toISOString().substring(0, 10),
      this.dateService.getFridayFromDate( new Date( this.dateToday)).toISOString().substring(0, 10), 
      this.statusSelected
      );
  }
}
