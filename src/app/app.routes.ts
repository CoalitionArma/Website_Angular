import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StatsComponent } from './stats/stats.component';
import { OauthComponent } from './oauth/oauth.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '', component: HomeComponent,
        data: {
            title: 'Home'
        },
    },
    {
        path: 'stats', component: StatsComponent,
        data: {
            title: 'Stats'
        },
    },
    { path: 'oauth', component: OauthComponent },
    { path: 'profile', 
        component: ProfileComponent,
        canActivate: [AuthGuard],
    }

];
