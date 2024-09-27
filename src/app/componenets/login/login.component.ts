import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, Button],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: loginObj = new loginObj(); 

  constructor(private router: Router, private logSrv: LoginService) {}

  onLogin() {
    if (this.login.email && this.login.password) {
      this.logSrv.loginUser(this.login).subscribe({
        next: (res) => {
          console.log('User logged in successfully', res);
  localStorage.setItem('token', res.token); // Store token in localStorage
          
          // Store user info
          localStorage.setItem('user', JSON.stringify(res.user)); // Assuming the user info is inside res.user
          localStorage.setItem('token', res.token); // Store the token for authenticated requests

          // Check if the user is an admin
          if (res.role === 'admin') {
            this.router.navigate(['/admin']); // Navigate to admin if the user is an admin
          } else {
            this.router.navigate(['/products']); // Otherwise, navigate to products
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('Invalid email or password. Please try again.');
        }
      });
    } else {
      alert('Please fill in all fields.');
    }

    // Note: Clear previous user data is removed from here since it could clear valid data
  }
  
  // Register function
  onRegister() {
    if (this.login.userName && this.login.email && this.login.password) {
      this.logSrv.saveUser(this.login).subscribe({
        next: (res) => {
          console.log('User registered successfully', res);
          // Redirect to login page
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          // Check if the error message indicates that the user is already registered
          if (err.status === 409) {
            alert('You are already registered. Please sign in.');
          } else {
            alert('Registration failed. Please try again.');
          }
        }
      });
    } else {
      alert('Please fill in all fields.');
    }
  }
}

export class loginObj {
  id: number;
  userName: string; // Use lowercase 'string'
  email: string; // Use lowercase 'string'
  password: string; // Use lowercase 'string'

  constructor() {
    this.id = 0;
    this.userName = '';
    this.email = '';
    this.password = '';
  }
}
