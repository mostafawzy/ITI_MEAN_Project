import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  public cartUpdated$: Subject<boolean> = new Subject();
  
  flag=false;
  // Products CRUD methods
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(Constant.API_END_POINT.PRODUCTS);
  }

 getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${Constant.API_END_POINT.PRODUCTS}/${Constant.METHODS.GET_PRODUCT_BY_ID}/${id}`);
  }
  getProductByName(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${Constant.API_END_POINT.PRODUCTS}?search=${searchTerm}`);
  }
 /*  saveProduct(obj: any): Observable<any> {
    return this.http.post<any>(`${Constant.API_END_POINT.PRODUCTS}/${Constant.METHODS.CREATE_PRODUCT}`, obj);
  } */
  
    saveProduct(product: any) {
      return this.http.post('http://localhost:5001/products/CreateProduct', product, { responseType: 'text' });
    }
  /*   deleteProduct(productId: number): Observable<any> {
      return this.http.delete(`http://localhost:5001/products/DeleteProduct/${productId}`, { responseType: 'text' });
    } */
      deleteProduct(productId: number): Observable<any> {
        return this.http.delete(`http://localhost:5001/products/deleteProduct/${productId}`);
    }
    
  

    updateProduct(productId: number, obj: any): Observable<any> {
      return this.http.put<any>(`http://localhost:5001/products/updateProduct/${productId}`, obj);
    }
    


// Categories CRUD methods
getCategories(): Observable<any[]> {
  return this.http.get<any[]>(Constant.API_END_POINT.CATEGORIES);
}

getCategoryBySlug(slug: string): Observable<any> {
  return this.http.get<any>(`${Constant.API_END_POINT.CATEGORIES}/${slug}`);
}

}
