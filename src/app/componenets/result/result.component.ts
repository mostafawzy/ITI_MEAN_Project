import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  products: any[] = []; // Store all products
  filteredProducts: any[] = []; // Store filtered products

  constructor(private productServ: ProductService, private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
    // Fetch all products when the component initializes
    this.productServ.getProducts().subscribe(data => {
      this.products = data; // Store fetched products
      console.log('Fetched Products:', this.products); // Log fetched products
  
      // Subscribe to the query parameters to get the search term
      this.route.queryParams.subscribe(params => {
        const searchTerm = params['term'];
        if (searchTerm) {
          this.filterProductsByName(searchTerm); // Filter products based on the search term
        } else {
          this.filteredProducts = []; // If no search term, clear filtered products
        }
      });
    });
    window.scrollTo(0, 0);
  }
  

  filterProductsByName(searchTerm: string) {
    console.log('Filtering products with term:', searchTerm); // Log the search term
    this.filteredProducts = this.products.filter(product => {
      const matches = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      console.log(`Product: ${product.title}, Matches: ${matches}`); // Log matches for each product
      return matches;
    });
  }
  
    // Navigate to product details
    viewProductDetails(productId: number) {
      this.router.navigate(['/details', productId]);
    }
}
