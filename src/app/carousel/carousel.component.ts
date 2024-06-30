import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { CarouselComponent, CarouselInnerComponent, CarouselItemComponent, ThemeDirective } from '@coreui/angular';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [ThemeDirective, CarouselComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, ThemeDirective],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CoalitionCarouselComponent implements OnInit {
  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });

  ngOnInit(): void {
    this.slides[0] = {
      src: 'https://steamuserimages-a.akamaihd.net/ugc/2267067215403907646/A11C169B89DEDB2A2398937A8B073C7D4DA7DF57/'
    };
    this.slides[1] = {
      src: 'https://steamuserimages-a.akamaihd.net/ugc/2267067215403906382/1A9965F2DA8EDE01F5A56071F6BD9C323CE2B2F5/'
    };
    this.slides[2] = {
      src: 'https://steamuserimages-a.akamaihd.net/ugc/2267067215403904719/05A5B4C4F1FCF1572FFB5465AA89B92C1CDD2A23/'
    };
  }

  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }

}