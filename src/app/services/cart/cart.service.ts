import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:5001/cart'; 
  // Method to add an item to the cart
  addItemToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { productId, quantity });
  }

  // Method to get the user's cart
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  // Method to remove an item from the cart
  removeItemFromCart(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`);
  }

  // Method to update the quantity of an item in the cart
  updateItemInCart(productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { productId, quantity });
  }

  // Method to clear the cart
clearCart(): Observable<any> {
  return this.http.delete(`${this.apiUrl}/clear`);
}

// Method to get a specific item from the cart
getCartItem(productId: string): Observable<CartItem> {
  return this.http.get<CartItem>(`${this.apiUrl}/item/${productId}`);
}

}


// cart.model.ts
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
}
