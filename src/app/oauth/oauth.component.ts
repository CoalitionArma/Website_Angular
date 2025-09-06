import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-oauth',
  template: '<p>Logging in...</p>',
})
export class OauthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        // Chain the OAuth flow using RxJS operators for better error handling
        this.userService.getToken(code).pipe(
          switchMap((tokenResponse) => {
            // Get the Discord user with the access token
            return this.userService.getDiscordUser(tokenResponse.access_token).pipe(
              switchMap((discordUser) => {
                // Create or update user in our database
                return this.userService.createOrUpdateUser(discordUser);
              })
            );
          }),
          catchError((error) => {
            // console.error('OAuth flow error:', error);
            // Redirect to home or login page on error
            this.router.navigate(['/']);
            return throwError(() => error);
          })
        ).subscribe({
          next: (response) => {
            //console.log('User authenticated successfully:', response);
            
            // Navigate to profile page
            this.router.navigate(['/profile']);
          },
          error: (error) => {
            // console.error('Final error in OAuth flow:', error);
            this.router.navigate(['/']);
          }
        });
      } else {
        // console.error('No OAuth2 code found in URL parameters');
        this.router.navigate(['/']);
      }
    });
  }
}