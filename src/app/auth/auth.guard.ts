
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean {
    // Use UserService to check if user is logged in and token is valid
    if (this.userService.loggedIn) {
      return true;
    } else {
      // Redirect to home page if not authenticated
      this.router.navigate(['/']);
      return false;
    }
  }
}