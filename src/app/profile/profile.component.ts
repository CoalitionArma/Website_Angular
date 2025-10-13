import { AfterContentInit, Component, Inject, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { StatsService } from '../services/stats.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserStats, UserRanking } from '../interfaces/user-stats.interface';
import { UserStatsComponent } from '../user-stats/user-stats.component';
import { CommonModule } from '@angular/common';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule, 
    MatSnackBarModule, 
    MatButtonModule, 
    UserStatsComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  constructor(
    public userService: UserService, 
    public statsService: StatsService,
    private fb: FormBuilder, 
    private router: Router
  ) {}

  // Observable properties for stats
  public userStats$ = this.statsService.stats$;
  public userRanking$ = this.statsService.ranking$;
  public statsLoading$ = this.statsService.loading$;
  public statsError$ = this.statsService.error$;
  public hasStats$ = this.statsService.hasStats$;
  public combatScore$ = this.statsService.combatScore$;
  public rankInfo$ = this.statsService.rankInfo$;

  armaGUIDRegex = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
  steamid64Regex = /^[0-9]{17}$/;
  
  // Communities list for dropdown
  communitiesList: any[] = [];
  communitiesLoading = false;
  
  userInfoForm = this.fb.group({
    email: ['', Validators.required],
    armaID: ['', [
      Validators.required,
      Validators.pattern(this.armaGUIDRegex)
    ]],
    steamID: ['', Validators.pattern(this.steamid64Regex)],
    callsign: [''], // Admin-only field for callsign management
    communityId: [null as number | null], // Community selection
  });

  saveFailed = false
  saveFailedReason = ""
  saved = false
  saving = false
  formLoading = true
  generalInfoExpanded = true // Controls expansion panel state

  ngOnInit(): void {
    // Debug: Check what's in localStorage when component initializes
    console.log('Profile component initializing...');
    console.log('Discord token:', !!localStorage.getItem('access_token'));
    console.log('JWT token:', !!localStorage.getItem('jwt_token'));
    console.log('User service logged in:', this.userService.loggedIn);
    console.log('Discord user:', this.userService.discordUser);
    console.log('DB user:', this.userService.dbUser);
    
    // Initialize form with user data when available
    this.initializeForm();
    
    // Load communities list
    this.loadCommunities();
    
    // Load user stats if user is logged in and we have a user ID
    if (this.userService.loggedIn && this.userService.dbUser?.discordid) {
      console.log('Loading user stats for:', this.userService.dbUser.discordid);
      this.statsService.loadUserStats(this.userService.dbUser.discordid);
    }
    
    // Subscribe to user service changes in case data loads after component init
    if (this.userService.loggedIn$) {
      this.userService.loggedIn$.subscribe((loggedIn) => {
        // Re-initialize form when user data changes
        setTimeout(() => this.initializeForm(), 100);
        
        // Load stats when user logs in
        if (loggedIn && this.userService.dbUser?.discordid) {
          console.log('User logged in, loading stats for:', this.userService.dbUser.discordid);
          this.statsService.loadUserStats(this.userService.dbUser.discordid);
        } else if (!loggedIn) {
          // Clear stats when user logs out
          this.statsService.clearUserStats();
        }
      });
    }
    
    // Subscribe to form changes to reset saved/failed states
    this.userInfoForm.valueChanges.subscribe(() => {
      this.saved = false;
      this.saveFailed = false;
    });
  }

  private initializeForm(): void {
    // Set form loading state
    this.formLoading = !this.userService.dbUser;
    
    // Set form values with user data
    this.userInfoForm.patchValue({
      email: this.userService.dbUser?.email || '',
      armaID: this.userService.dbUser?.armaguid || '',
      steamID: this.userService.dbUser?.steamid || '',
      callsign: this.userService.dbUser?.callsign || '',
      communityId: this.userService.dbUser?.communityId || null,
    });
    
    // Mark form as pristine after setting initial values
    this.userInfoForm.markAsPristine();
    
    // Set loading to false once data is loaded
    if (this.userService.dbUser) {
      this.formLoading = false;
    }
  }

  private loadCommunities(): void {
    this.communitiesLoading = true;
    this.userService.getCommunitiesList().subscribe({
      next: (response: any) => {
        this.communitiesList = response.communities || [];
        this.communitiesLoading = false;
      },
      error: (error: any) => {
        console.error('Failed to load communities:', error);
        this.communitiesList = [];
        this.communitiesLoading = false;
      }
    });
  }

  saveChanges() {
    this.saveFailed = false
    this.saved = false
    this.saving = true
    
    if (this.userInfoForm.valid && this.userInfoForm.dirty) { 
      // For admin users updating their own callsign, use the regular update endpoint
      // The backend now handles callsign updates for admin users through the regular endpoint
      this.updateRegularUserInfo();
    } else if (!this.userInfoForm.valid) {
      this.saving = false;
      this.saveFailed = true
      this.saveFailedReason = "📝 Please fix the validation errors above before saving."
      
      // Hide error message after 4 seconds
      setTimeout(() => {
        this.saveFailed = false;
        this.saveFailedReason = "";
      }, 4000);
    }
  }

  private updateCallsign() {
    const callsignValue = this.userInfoForm.get('callsign')?.value;
    
    this.userService.updateCallsign(this.userService.dbUser!.discordid, callsignValue || '').subscribe({
      next: (response: any) => {
        console.log('Callsign update successful:', response);
        
        // Update local user data
        if (this.userService.dbUser) {
          this.userService.dbUser.callsign = callsignValue || null;
        }
        
        this.saving = false;
        this.saved = true;
        this.userInfoForm.markAsPristine();
        
        setTimeout(() => {
          this.saved = false;
        }, 4000);
      },
      error: (error: any) => {
        console.error('Callsign update failed:', error);
        this.saving = false;
        this.saveFailed = true;
        
        if (error.status === 403) {
          this.saveFailedReason = "🔒 Access denied - Only administrators can update callsigns.";
        } else if (error.status === 404) {
          this.saveFailedReason = "👤 User not found.";
        } else {
          this.saveFailedReason = `❌ ${error.error?.message || error.error?.error || error.message || "Failed to update callsign."}`;
        }
        
        setTimeout(() => {
          this.saveFailed = false;
          this.saveFailedReason = "";
        }, 5000);
      }
    });
  }

  private updateRegularUserInfo() { 
      // Update the user object with the new values
      this.userService.updateLocalUser(this.userInfoForm);
      
      // Debug: Check tokens before making request
      const discordToken = localStorage.getItem('access_token');
      const jwtToken = localStorage.getItem('jwt_token');
      const tokenExpiry = localStorage.getItem('token_expiry');
      console.log('Attempting to save user info...');
      console.log('User logged in:', this.userService.loggedIn);
      console.log('Discord token exists:', !!discordToken);
      console.log('JWT token exists:', !!jwtToken);
      console.log('JWT token value (first 20 chars):', jwtToken?.substring(0, 20) + '...');
      console.log('Token expiry:', tokenExpiry);
      console.log('Current time:', new Date().getTime());
      console.log('User data to save:', this.userService.dbUser);
      
        // Immediate check for JWT token
        if (!jwtToken) {
          console.error('No JWT token found - attempting to refresh token');
          this.saving = false;
          this.saveFailed = true;
          this.saveFailedReason = "🔐 Authentication required - Refreshing your session...";
          
          // Try to refresh JWT token using existing Discord user
          this.refreshJWTToken();
          return;
        }      // Fail-safe timeout to reset saving state (in case observable doesn't complete)
      const timeout = setTimeout(() => {
        console.warn('Save operation timed out, resetting saving state');
        this.saving = false;
        this.saveFailed = true;
        this.saveFailedReason = "⏱️ Request timeout - The server is taking too long to respond. Please check your connection and try again.";
      }, 3000); // Reduced to 3 second timeout for faster testing
      
      console.log('Making HTTP request to update user...');
      
      // Wrap the service call in a try-catch to handle synchronous errors
      try {
        // Call the service to update the user
        this.userService.updateUserInfo().subscribe({
          next: (response) => {
            clearTimeout(timeout); // Clear the timeout since we got a response
            console.log('Save successful:', response);
            this.saving = false;
            this.saved = true;
            // Mark form as pristine after successful save
            this.userInfoForm.markAsPristine();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.saved = false;
            }, 4000); // Slightly longer for users to read
          },
          error: (error) => {
            clearTimeout(timeout); // Clear the timeout since we got a response
            console.error('Save failed:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.error);
            console.error('Full error object:', error);
            this.saving = false;
            this.saveFailed = true;
            
            // Check if it's an authentication error
            if (error.status === 401 || error.error?.error === 'Failed to authenticate token' || error.error?.error === 'Unauthenticated') {
              this.saveFailedReason = "🔒 Session expired - Please log out and log back in to continue.";
              // Optionally redirect to login or refresh the page
            } else if (error.message?.includes('JWT token')) {
              this.saveFailedReason = "🔐 Authentication error - Please refresh your session by logging out and back in.";
            } else if (error.status === 0) {
              this.saveFailedReason = "🌐 Network error - Please check your internet connection and try again.";
            } else if (error.status >= 500) {
              this.saveFailedReason = "⚠️ Server error - Our servers are experiencing issues. Please try again in a moment.";
            } else {
              this.saveFailedReason = `❌ ${error.error?.message || error.error?.error || error.message || "Something went wrong. Please try again."}`;
            }
            
            // Hide error message after 5 seconds
            setTimeout(() => {
              this.saveFailed = false;
              this.saveFailedReason = "";
            }, 5000);
          }
        });
      } catch (syncError) {
        // Handle synchronous errors that might occur before the Observable is created
        clearTimeout(timeout);
        console.error('Synchronous error in updateUserInfo:', syncError);
        this.saving = false;
        this.saveFailed = true;
        this.saveFailedReason = "🔐 Authentication setup error - Please refresh the page and try logging in again.";
        
        // Hide error message after 5 seconds
        setTimeout(() => {
          this.saveFailed = false;
          this.saveFailedReason = "";
        }, 5000);
      }
    }

  discardChanges() {
    // Reset form to original values and mark as pristine
    this.userInfoForm.patchValue({
      email: this.userService.dbUser?.email || '',
      armaID: this.userService.dbUser?.armaguid || '',
      steamID: this.userService.dbUser?.steamid || '',
      callsign: this.userService.dbUser?.callsign || '',
      communityId: this.userService.dbUser?.communityId || null,
    });
    this.userInfoForm.markAsPristine();
    this.saved = false;
    this.saveFailed = false;
  }

  refreshJWTToken() {
    console.log('Attempting to refresh JWT token...');
    console.log('Discord user data:', this.userService.discordUser);
    
    if (this.userService.discordUser) {
      // Try to create/update user to get a fresh JWT token
      this.userService.createOrUpdateUser(this.userService.discordUser).subscribe({
        next: (response) => {
          console.log('JWT token refresh response:', response);
          console.log('JWT token refreshed successfully');
          this.saveFailedReason = "✅ Session refreshed successfully! You can now save your changes.";
          
          // Hide message after 4 seconds
          setTimeout(() => {
            this.saveFailed = false;
            this.saveFailedReason = "";
          }, 4000);
        },
        error: (error) => {
          console.error('Failed to refresh JWT token:', error);
          this.saveFailedReason = "🔄 Session refresh failed - Please log out and log back in to continue.";
        }
      });
    } else {
      console.error('No Discord user data available');
      this.saveFailedReason = "👤 No user session found - Please log out and log back in.";
    }
  }

  // Getter method to help with change detection
  get shouldShowDiscardButton(): boolean {
    return this.userInfoForm.dirty;
  }

  get shouldDisableSaveButton(): boolean {
    return !this.userInfoForm.dirty || this.userInfoForm.invalid || this.saving;
  }

  dismissToast() {
    this.saved = false;
    this.saveFailed = false;
    this.saveFailedReason = '';
  }

  getCommunityName(): string | null {
    if (!this.userService.dbUser?.communityId || this.communitiesList.length === 0) {
      return null;
    }
    
    const community = this.communitiesList.find(c => c.id === this.userService.dbUser?.communityId);
    return community ? community.name : null;
  }
}

// @Component({
//   selector: 'data-changed-component-snack',
//   standalone: true,
//   templateUrl: 'data-changed-component-snack.html',
//   styles: `
//     :host {
//       display: flex;
//     }

//     .example-pizza-party {
//       color: hotpink;
//     }
//   `,
//   imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
// })
// export class DataChangedComponent {
//   snackBarRef = inject(MatSnackBarRef);

//   discardChanges() { 
//     this.snackBarRef.dismiss()
//   }
  
//   saveChanges() {
//     this.snackBarRef.dismissWithAction()
//   }
// }
