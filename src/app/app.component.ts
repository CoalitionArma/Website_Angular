import { Component, HostBinding, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { DOCUMENT, NgClass, ViewportScroller } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,HeaderComponent, NgClass,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CoalitionWebsite';

  constructor(private viewportScroller: ViewportScroller){}

  debounce = (fn: any) => {
    // This holds the requestAnimationFrame reference, so we can cancel it if we wish
    let frame: any;
   
    // The debounce function returns a new function that can receive a variable number of arguments
    return (...params: any[]) => {
      // If the frame variable has been defined, clear it now, and queue for next frame
      if (frame) { 
        cancelAnimationFrame(frame);
      }

      // Queue our function call for the next frame
      frame = requestAnimationFrame(() => { // probably causing slight scroll with first scroll
        
        // Call our function and pass any params we received
        fn(...params);
      
      });
    } 
  }

  updateScrollDir = () => {
    const [x, y] = this.viewportScroller.getScrollPosition();
    this.scrollUp = this.lastScroll > y;
    this.lastScroll = y;
  }

  lastScroll: number = 0
  scrollUp: boolean = false

  @HostListener('document:scroll', ["$event"])
  onScroll(event: any) {
    this.debounce(this.updateScrollDir)()
  }
  
  
}
