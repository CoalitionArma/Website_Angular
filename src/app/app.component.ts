import { Component, HostBinding, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { DOCUMENT, NgClass, ViewportScroller } from '@angular/common';
import { IconSetService } from '@coreui/icons-angular';
import { cilListNumbered, cilPaperPlane, brandSet } from '@coreui/icons';

import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,HeaderComponent, NgClass, OverlayscrollbarsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  
  title = 'CoalitionWebsite';

  constructor(
    public iconSet: IconSetService
  ){
    iconSet.icons = {cilListNumbered, cilPaperPlane, ...brandSet}
  }

  lastScroll: number = 0
  scrollUp: boolean = false

  @HostListener('document:scroll', ["$event"])
  onScroll(instance: any, event: any) {
  } //TODO: do this thing to header
}
