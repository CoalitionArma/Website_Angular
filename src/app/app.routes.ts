import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StatsComponent } from './stats/stats.component';
import { CfcComponent } from './cfc/cfc.component';

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
    {
        path: '', component: CfcComponent,
        data: {
            title: 'CFC'
        },
    },
];
