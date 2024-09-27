import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  itemId!: number;
  itemDetails: any = {};
  isLoading: boolean = true;  // Loading state
  errorMessage: string = '';   // Error message state

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(`Fetching details for item ID: ${this.itemId}`); // Log itemId
  
    this.productService.getProductById(this.itemId).subscribe(
      (details) => {
        // Assuming details is an array with one product, extract the first element
        this.itemDetails = details[0]; // Update this line
        this.isLoading = false; // Set loading to false when data is received
        console.log('Product details fetched:', this.itemDetails); // Log details
      },
      (error) => {
        this.errorMessage = 'Error fetching product details'; // Set error message
        console.error('Error fetching product details:', error);
        this.isLoading = false; // Set loading to false on error
      }
    );
    window.scrollTo(0, 0);
  }
  
  }
