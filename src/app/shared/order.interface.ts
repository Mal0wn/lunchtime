import { Meal } from "./meal.interface";
import { Menu } from "./menu.interface";
import { User } from "./user.interface";

export interface Quantity {
    "id": number,
    "quantity": number,
    "meal": Meal,
    "menu": Menu,
}

export interface Order {
    "id": number,
    "creationDate": string,
    "creationTime": string,
    "status": 0,
    "user": User,
    "quantity": Quantity[]
}