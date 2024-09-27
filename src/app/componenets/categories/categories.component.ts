import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  products$: Observable<any[]> | undefined;
  isSidePanel: boolean = false;
  categoryObj: CategoryObject = new CategoryObject();
  isApiCallInProgress: boolean = false;

  constructor(private productSrv: ProductService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.products$ = this.productSrv.getCategories().pipe(
      // You can add additional mapping if needed
    );
  }

  saveCategory() {
    this.isApiCallInProgress = true;
    this.productSrv.createCategory(this.categoryObj).subscribe(
      () => {
        this.toaster.success('Category created successfully!');
        this.getAllCategories();
        this.reset();
      },
      (error) => {
        this.toaster.error('Failed to create category.');
        this.isApiCallInProgress = false;
      },
      () => {
        this.isApiCallInProgress = false;
      }
    );
  }

  updateCategory() {
    this.isApiCallInProgress = true;
    this.productSrv.updateCategory(this.categoryObj.slug, this.categoryObj).subscribe(
      () => {
        this.toaster.success('Category updated successfully!');
        this.getAllCategories();
        this.reset();
      },
      (error) => {
        this.toaster.error('Failed to update category.');
        this.isApiCallInProgress = false;
      },
      () => {
        this.isApiCallInProgress = false;
      }
    );
  }

  onEdit(item: any) {
    this.categoryObj = item; // Set the selected category to edit
    this.isSidePanel = true; // Open side panel
  }

  onDelete(item: any) {
    this.productSrv.deleteCategory(item.slug).subscribe(
      () => {
        this.toaster.success('Category deleted successfully!');
        this.getAllCategories(); // Refresh category list
      },
      (error) => {
        this.toaster.error('Failed to delete category.');
      }
    );
  }

  reset() {
    this.categoryObj = new CategoryObject(); // Reset category object
    this.isSidePanel = false; // Close side panel
  }
}

export class CategoryObject {
  slug: string;
  name: string;
  url: string;

  constructor() {
    this.slug = '';
    this.name = '';
    this.url = '';
  }
}
