import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink, CommonModule, FormsModule, ButtonModule, DialogModule, CheckboxModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  products: any[] = []; // Store all products
  filteredProducts: any[] = []; // Declare filteredProducts to store the filtered products
  searchTerm: string = ''; // The user's search term

  constructor(private productServ: ProductService, public router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Fetch all products when the component initializes
    this.productServ.getProducts().subscribe(data => {
      this.products = data; // Store fetched products
      console.log('Fetched Products:', this.products); // Log fetched products
  
      // Subscribe to the query parameters to get the search term
      this.route.queryParams.subscribe((params: any) => {
        const searchTerm = params['term'];
        if (searchTerm) {
          this.filterProductsByName(searchTerm); // Filter products by search term
        } else {
          this.filteredProducts = []; // Clear filtered products if no search term
        }
      });
    });
  }

  // Method to filter products by name
  filterProductsByName(searchTerm: string) {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  searchProducts() {
    // Navigate to the results page with the search term as a query parameter
    this.router.navigate(['/result'], { queryParams: { term: this.searchTerm } });
  }

/*   isAdmin(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser && parsedUser.role === 'admin';
    }
    return false; // Default return value if user doesn't exist or parsing fails
  } */

  isAdminRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/admin') || currentUrl.includes('/result');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  // Method to log out the user
  onLogout() {
    localStorage.removeItem('user'); // Clear user data
    this.router.navigate(['/login']); // Navigate to login page
  }
}
