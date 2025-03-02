import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatTabsModule} from '@angular/material/tabs';
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { ProfileOverviewComponent } from "./profile-overview/profile-overview.component";
import { ProfileSocialIconComponent } from "./profile-components/profile-social-icon/profile-social-icon.component";
import { ProfileStatsComponent } from "./profile-components/profile-stats/profile-stats.component";

/** Error when invalid control is dirty, touched, or submitted. */

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatTabsModule,
    ProfileSettingsComponent,
    ProfileOverviewComponent,
    ProfileSocialIconComponent,
    ProfileStatsComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {
  constructor(public userService: UserService) {}
}
