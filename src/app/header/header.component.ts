import { Component, HostBinding, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { cilHamburgerMenu } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { OverlayScrollbars } from 'overlayscrollbars';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive, RouterOutlet, IconDirective, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(public userService: UserService, private router: Router) {}

  icons = { cilHamburgerMenu }
  @Input() osInstance!: OverlayScrollbars; 

  visible = true;
  transparentHeader = true;
  lastScroll = 0;

  ngOnInit(): void {
    this.osInstance.on("scroll", (instance, event) => {
      const currentScroll = instance.elements().scrollOffsetElement.scrollTop
      if (currentScroll <= this.lastScroll) {
        this.visible = true
      } else {
        this.visible = false
      }

      if (currentScroll == 0) {
        this.transparentHeader = true
      } else {
        this.transparentHeader = false
      }

      this.lastScroll = currentScroll
    })
  }

  mobileMenuVisible = false;
  profileDropdownVisible = false;

  mobileMenuClicked() {
    this.mobileMenuVisible = !this.mobileMenuVisible;
    
    // Prevent body scrolling when mobile menu is open (iOS fix)
    if (this.mobileMenuVisible) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }

  toggleProfileDropdown() {
    this.profileDropdownVisible = !this.profileDropdownVisible;
  }

  closeProfileDropdown() {
    this.profileDropdownVisible = false;
  }

  closeMobileMenu() {
    this.mobileMenuVisible = false;
    // Restore body scrolling
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  loginWithDiscord() {
    const redirectUri = encodeURIComponent(environment.redirectUri);
    const discordAuthUrl = `${environment.discordOAuthUrl}?client_id=${environment.clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify+email+connections+guilds+guilds.join`;
    window.location.href = discordAuthUrl;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    // Clean up body styles when component is destroyed
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }
}
