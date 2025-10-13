import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // First check if user is logged in
    if (!this.userService.loggedIn) {
      this.router.navigate(['/'], { 
        queryParams: { 
          requiresLogin: true,
          from: 'admin'
        }
      });
      return false;
    }

    // Then check if user has admin privileges
    if (this.userService.dbUser?.isAdmin) {
      return true;
    } else {
      // Redirect to home page if not admin
      this.router.navigate(['/']);
      return false;
    }
  }
}