import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { DBUserResponse } from '../interfaces/user.interface';

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
        this.userService.getToken(code).subscribe(
          (response) => {
            // Get the discord user
            this.userService.getDiscordUser(response.access_token).subscribe(
              (user) => {
                // Call API to create user
                this.userService.createOrUpdateUser(user).subscribe(
                  (response) => {
                    localStorage.setItem('access_token', response.token); // Set the token in local storage
                    // Tell the header component that the user is logged in
                    this.userService.loggedIn = true;
                    //console.log('User saved:', response);
                  },
                  (error) => {
                    console.error('Error saving user:', error);
                  }
                );
              },
              (error) => {
                console.error('Error getting user:', error);
              }
            );
            this.router.navigate(['/profile']);
          },
          (error) => {
            console.error('Error exchanging code for token:', error);
          }
        );
      } else {
        console.error('No OAuth2 code found');
      }
    });
  }
}