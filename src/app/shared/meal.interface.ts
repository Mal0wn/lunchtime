import { Ingredient } from "./ingredient.interface";

export interface Meal{
    "id": number,
    "description": string,
    "label": string,
    "status": number,
    "imageId": number,
    "priceDF": number,
    "availableForWeeks": number[]
    "category": number,
    "ingredients": Ingredient[]
  }