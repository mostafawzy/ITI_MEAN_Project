// logout.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '<button (click)="onLogout()">Logout</button>',
})
export class LogoutComponent {
  constructor(private router: Router) {}

  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
