import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private logSrv: LoginService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    
    const token = localStorage.getItem('token'); // Get token from localStorage

    // Check if token is null
    if (!token) {
      console.log('No token found in localStorage'); // Debugging log
      this.router.navigate(['/login']); // Redirect to login if no token
      return of(false); // Deny access
    }

    let user;
    try {
      user = this.logSrv.decodeToken(token); // Decode token
      if (!user || typeof user.role !== 'string') {
        throw new Error('Invalid user object'); // Additional check for validity
      }
    } catch (error) {
      console.error('Error decoding token:', error); // Log decoding error
      this.router.navigate(['/login']); // Redirect to login on error
      return of(false); // Deny access
    }

    console.log('User from token:', user); // Debugging log

    // Check user role
    if (user.role === 'admin') {
      return of(true); // Allow access if admin
    } else {
      console.log('Access denied, redirecting to login'); // Debugging log
      this.router.navigate(['/login']); // Redirect to login if not admin
      return of(false); // Deny access
    }
  }
}
