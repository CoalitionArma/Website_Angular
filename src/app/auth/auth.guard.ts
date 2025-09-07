
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Use UserService to check if user is logged in and token is valid
    if (this.userService.loggedIn) {
      return true;
    } else {
      // Get the page name from the route data
      const pageName = route.data['title'] || 'this';
      
      // Redirect to home page with query params for login message
      this.router.navigate(['/'], { 
        queryParams: { 
          requiresLogin: true,
          from: pageName.toLowerCase()
        }
      });
      return false;
    }
  }
}