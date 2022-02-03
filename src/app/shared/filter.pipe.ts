import { Pipe, PipeTransform } from '@angular/core';
import { User } from './user.interface';
import { Order } from './order.interface';

@Pipe({
  name: 'Userfilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(users: User[], criteria: string): User[] {
    if (!users) return [];
    return users.filter(user => {
      if (!user.name.toLowerCase().includes(criteria.toLowerCase()))
        return user.firstname.toLowerCase().includes(criteria.toLowerCase());
      return user.name.toLowerCase().includes(criteria.toLowerCase());
    });
  }

}

@Pipe({
  name: 'OrderUserfilter'
})
export class OrderFilterPipe implements PipeTransform {

  transform(orders: Order[], criteria: string): Order[] {
    if (!orders) return [];
    return orders.filter(order => {
      if (!order.user.name.toLowerCase().includes(criteria.toLowerCase()))
        return order.user.firstname.toLowerCase().includes(criteria.toLowerCase());
      return order.user.name.toLowerCase().includes(criteria.toLowerCase());
    });
  }
}

@Pipe({
  name: 'Statusfilter'
})
export class StatusFilterPipe implements PipeTransform {

  transform(orders: Order[], status: number): Order[] {
    if (!orders) return [];
    return orders.filter(order => {
      if (order.status == status) {
        return true;
      }return false;
    });
  }
}