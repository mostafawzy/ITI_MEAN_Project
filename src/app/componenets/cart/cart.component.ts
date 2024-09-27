import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service'; // Adjust the path as necessary
import { HttpErrorResponse } from '@angular/common/http'; // Import the HttpErrorResponse type if using HttpClient
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'] // Fixed typo: changed styleUrl to styleUrls
})
export class CartComponent implements OnInit {
  cart: any[] = []; // Define cart as an array

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
        next: (cart) => {
            console.log('Fetched cart:', cart); // Log the entire cart
            this.cart = cart.items; // Assuming the API returns an object with 'items' array
        },
        error: (err: HttpErrorResponse) => {
            console.error('Error fetching cart:', err);
        }
    });
}

  increaseQuantity(item: any): void {
    item.quantity += 1;
    this.updateCartItem(item);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) { // Prevent quantity from going below 1
      item.quantity -= 1;
      this.updateCartItem(item);
    }
  }
  updateCartItem(item: any): void {
    this.cartService.updateItemInCart(item.productId, item.quantity).subscribe({
      next: () => {
        this.loadCart(); // Reload the cart after updating
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating item in cart:', err);
      }
    });
  }
  
  removeFromCart(productId: string): void {
    this.cartService.removeItemFromCart(productId).subscribe({
      next: () => {
        this.loadCart(); // Reload cart after removing item
      },
      error: (err: HttpErrorResponse) => { // Specify the type of 'err'
        console.error('Error removing item from cart:', err);
      }
    });
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
}

}
