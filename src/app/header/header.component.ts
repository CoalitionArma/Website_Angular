import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { cilHamburgerMenu } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { OverlayScrollbars } from 'overlayscrollbars';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive, RouterOutlet, IconDirective, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
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
  mobileMenuClicked() {
    this.mobileMenuVisible = !this.mobileMenuVisible
  }

  loginWithDiscord() {
    // check angular development environment
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=1311851378875830354&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Foauth%2F&scope=identify+email+connections+guilds+guilds.join`;
    window.location.href = discordAuthUrl;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
