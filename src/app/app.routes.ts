import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StatsComponent } from './stats/stats.component';
import { OauthComponent } from './oauth/oauth.component';
import { ProfileComponent } from './profile/profile.component';
import { EventsComponent } from './events/events.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '', component: HomeComponent,
        data: {
            title: 'Home'
        },
    },
    {
        path: 'stats', 
        component: StatsComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Stats'
        },
    },
    {
        path: 'events', 
        component: EventsComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Events'
        },
    },
    { path: 'oauth', component: OauthComponent },
    { path: 'oauth/', component: OauthComponent }, // Add explicit route with trailing slash
    { path: 'profile', 
        component: ProfileComponent,
        canActivate: [AuthGuard],
    }

];
