import { Component, HostBinding, HostListener, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { DOCUMENT, NgClass, ViewportScroller } from '@angular/common';
import { IconSetService } from '@coreui/icons-angular';
import { cilListNumbered, cilPaperPlane, brandSet } from '@coreui/icons';
import { ImagePreloaderService } from './services/image-preloader.service';
import { UserService } from './services/user.service';

import { OverlayScrollbarsComponent, OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { Subject } from 'rxjs';
import { OverlayScrollbars } from 'overlayscrollbars';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,HeaderComponent, NgClass, OverlayscrollbarsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  // private config : OverlayScrollbars.Options = {
  //   className            : "os-theme-dark",
  //   resize               : "none",
  //   paddingAbsolute      : true,
  //   normalizeRTL         : true,
  //   autoUpdate           : true,
  //   scrollbars : {
  //     visibility       : "auto",
  //     autoHide         : "move",
  //     autoHideDelay    : 800,
  //     dragScrolling    : true,
  //     clickScrolling   : true,
  //     touchSupport     : true
  //   },
  //   callbacks : {
  //     onScroll: () => {
  //       let scrollInfo = this._osInstance.scroll();
  //       console.log(scrollInfo);
  //     }
  //   }
  // }

  title = 'CoalitionWebsite';
  osInstance!: OverlayScrollbars;

  constructor(
    public iconSet: IconSetService,
    private imagePreloader: ImagePreloaderService,
    private userService: UserService
  ){
    iconSet.icons = {cilListNumbered, cilPaperPlane, ...brandSet}
  }
  @ViewChild('osRef', { read: OverlayScrollbarsComponent })
  osRef?: OverlayScrollbarsComponent;

  //if we need to enable defer on scroll bar
  // https://github.com/KingSora/OverlayScrollbars/issues/596
  
  ngOnInit(): void {
    // Initialize overlay scrollbars
    this.osInstance = OverlayScrollbars(
      {
        target: document.body,
      },
      {
        scrollbars: {
          theme: 'os-theme-dark',
        },
      },
      {
        // Events
      }
    );

    // Preload critical images for faster loading
    this.imagePreloader.preloadCriticalImages();
    
    // User authentication is automatically initialized by UserService constructor
  }
}
