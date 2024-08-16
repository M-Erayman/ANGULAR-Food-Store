import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/food';
import { CartItem } from '../shared/models/cartItem';
import { Cart } from '../shared/models/Carts';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor() {}

  addToCart(food: Food): void {
    let cartItem = this.cart.items.find((item) => item.food.id === food.id);
    if (cartItem) return;

    this.cart.items.push(new CartItem(food));
    this.updateCart();
  }

  removeFromCart(foodId: string): void {
    this.cart.items = this.cart.items.filter((item) => item.food.id != foodId);
    this.updateCart();
  }

  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find((item) => item.food.id === foodId);
    if (!cartItem) {
      return;
    }
    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.updateCart();
  }

  clearCart(): void {
    this.cart = new Cart();
    this.updateCart();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  private updateCart(): void {
    this.cart.totalPrice = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.price,
      0
    );
    this.cart.totalCount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );

    this.setCartToLocalStorage();
    this.cartSubject.next(this.cart);
  }

  private setCartToLocalStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const cartJson = JSON.stringify(this.cart);
        localStorage.setItem('Cart', cartJson);
      } catch (error) {
        console.error('LocalStorage hatası:', error);
      }
    }
  }

  private getCartFromLocalStorage(): Cart {
    if (typeof window !== 'undefined') {
      try {
        const cartJson = localStorage.getItem('Cart');
        return cartJson ? JSON.parse(cartJson) : new Cart();
      } catch (error) {
        console.error('LocalStorage hatası:', error);
      }
    }
    return new Cart(); // Sunucu tarafında ise boş bir sepet döndür
  }
}
