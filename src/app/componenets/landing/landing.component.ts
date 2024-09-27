import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink,CommonModule, FormsModule, PaginatorModule, EditorModule, ButtonModule, DialogModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  categoryList: any[] = [];
  productsList: any[] = [];
  
  filteredProductsList: any[] = [];
  
  itemsPerPage = 4;
  currentPage = 1;
  selectedCategory: string = '';

  constructor(private productSrv: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
    
    window.scrollTo(0, 0);
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

filterByCategory(categorySlug: string) {
  this.selectedCategory = categorySlug; // Set the selected category
  if (this.selectedCategory === '') {
    this.filteredProductsList = [...this.productsList];
  } else {
    this.filteredProductsList = this.productsList.filter(product =>
      product.category.toLowerCase() === this.selectedCategory.toLowerCase()
    );
    this.productSrv.flag = true;
  }
}

  // Navigate to product details
  viewProductDetails(productId: number) {
    this.router.navigate(['/details', productId]);
  }



}
