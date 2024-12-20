
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const authToken = localStorage.getItem('access_token');
    if (authToken) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}