import { Food } from './food';

export class CartItem {
  quantity: number = 0;
  price: number = 0;
  constructor(public food: Food) {
    this.quantity = 1;
    this.price = this.food.price;
  }
}
