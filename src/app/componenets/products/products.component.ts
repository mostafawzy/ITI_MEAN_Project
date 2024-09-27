import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { HttpClient } from '@angular/common/http';

// Define Product interface outside of the component class
interface Product {
    id: string;
    price: string; // Change to number if price is stored as a number
    quantity: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginatorModule, EditorModule, ButtonModule, DialogModule ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  categoryList: any[] = [];
  productsList: any[] = [];
  filteredProductsList: any[] = [];
  @ViewChild('topContainer') topContainer!: ElementRef;
  itemsPerPage = 12;
  currentPage = 1;
  selectedCategory: string = '';

  constructor(private http: HttpClient, private productSrv: ProductService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
    window.scrollTo(0, 0);
  }

  scrollToTop() {
    this.topContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  // Fetch all products
  getProducts() {
    this.productSrv.getProducts().subscribe((res: any) => {
      this.productsList = res;
      this.filteredProductsList = res;
    });
  }

  // Fetch all categories
  getAllCategory() {
    this.productSrv.getCategories().subscribe((res: any) => {
      this.categoryList = res;
    });
  }

  // Filter products by category
  filterByCategory() {
    if (this.selectedCategory === '') {
      this.filteredProductsList = [...this.productsList];
    } else {
      this.filteredProductsList = this.productsList.filter(product =>
        product.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
      this.productSrv.flag = true;
    }
  }

  // Calculate total pages for pagination
  get totalPages(): number {
    if (this.productSrv.flag) {
      return Math.ceil(this.filteredProductsList.length / this.itemsPerPage);
    }
    return Math.ceil(this.productsList.length / this.itemsPerPage);
  }

  // Get current page products
  getCurrentProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    if (this.productSrv.flag) {
      return this.filteredProductsList.slice(startIndex, startIndex + this.itemsPerPage);
    }
    return this.productsList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Navigate to next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.scrollToTop();
  }

  // Navigate to previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.scrollToTop();
  }

  // Navigate to product details
  viewProductDetails(productId: number) {
    this.router.navigate(['/details', productId]);
  }

  // Add product to cart
  addToCart(product: Product) {
    const productPrice = parseFloat(product.price) || 0; // Ensure it's a number
    const quantity = product.quantity || 1; // Default to 1 if quantity is not provided
    const total = productPrice * quantity;

    if (isNaN(total) || total <= 0) {
      console.error("Invalid total amount. Cannot add to cart.");
      return;
    }

    const cartItem = {
      total: total,
      productId: product.id,
      quantity: quantity
    };

    // Assuming totalPrice and userId are defined elsewhere in your component
    const totalPrice = total; // Or however you want to calculate totalPrice
    const userId = "someUserId"; // Replace with actual user ID from your auth service

    console.log("Adding to cart:", {
      total,
      totalPrice,
      product,
      userId
    });

    this.http.post('http://localhost:5001/cart/add', cartItem)
      .subscribe(
        response => {
          console.log("Product added to cart:", response);
        },
        error => {
          console.error("Error adding product to cart:", error);
        }
      );
  }
}
