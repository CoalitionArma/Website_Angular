import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { cilHamburgerMenu } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { OverlayScrollbars } from 'overlayscrollbars';

import { DropdownModule, GridModule, NavModule, HeaderModule} from '@coreui/angular';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet, IconDirective, DropdownModule, HeaderModule, GridModule, NavModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  icons = { cilHamburgerMenu }
  @Input() osInstance!: OverlayScrollbars; 

  visible = true;
  transparentHeader = true;
  lastScroll = 0;

  ngOnInit(): void {
    console.log(this.osInstance)
    this.osInstance.on("scroll", (instance, event) => {
      const currentScroll = instance.elements().scrollOffsetElement.scrollTop
      if (currentScroll <= this.lastScroll) {
        this.visible = true
        console.log(this.visible)
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

  subDivClicked($event:any) {
    console.log($event)
    $event.stopPropagation()
  }
}
