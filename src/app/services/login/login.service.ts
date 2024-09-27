import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginObj } from '../../componenets/login/login.component'; // Make sure the path is correct
// Ensure correct import
import jwt_decode from 'jwt-decode'; // Ensure you use this form



@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5001/users'; // Ensure this is correct

  constructor(private http: HttpClient) {}

  // Function to log in the user
  loginUser(login: loginObj): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, login);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserById/${id}`);
  }
  
  saveUser(user: any) {
    return this.http.post('http://localhost:5001/users/createUser', user, { responseType: 'text' });
  }

  getAdminData(token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` }; // Set the authorization header with the token
    return this.http.get<any>(`${this.apiUrl}/admin`, { headers });
  }

  decodeToken(token: string): any {
    return jwt_decode(token); // Decode the token and return the payload
  }
}
