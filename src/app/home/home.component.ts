import { Component, OnInit } from '@angular/core';
import { CoalitionCarouselComponent } from '../carousel/carousel.component';
import { DateTime } from 'luxon';
import { NgFor } from '@angular/common';
import { CarouselComponent, CarouselInnerComponent, CarouselItemComponent, CarouselControlComponent, CarouselIndicatorsComponent } from '@coreui/angular';
import { RouterLink } from '@angular/router';

import { cilChevronBottom } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { OverlayScrollbars } from 'overlayscrollbars';

import Aos from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CoalitionCarouselComponent, CarouselComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselControlComponent, RouterLink, CarouselIndicatorsComponent, IconDirective, OverlayscrollbarsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  options = {
    scrollbars: {
      theme: 'os-theme-light',
    },
  };
  icons = { cilChevronBottom }

  localTimezoneStr = DateTime.now().toFormat('ZZZZ')
  coalTimezone = 'America/Chicago'
  coalTimezoneStr = DateTime.now().setZone(this.coalTimezone).toFormat('ZZZZ')

  events: any[] = new Array(4).fill({ id: -1, src: '', title: '', nextEventDate: {cstDay: '', cstHour: '', localDay: '', localHour: ''}, infoPoints: []})

  quotes: string[] = [
    "'The only way to do great work is to love what you do.'",
    "'Success is not the key to happiness. Happiness is the key to success.'",
    "'Believe you can and you're halfway there.'",
    "'The future belongs to those who believe in the beauty of their dreams.'",
    "'In the middle of every difficulty lies opportunity.'",
    "'The best way to predict the future is to create it.'",
    "'My leg! For the love of liberty, my leg!'",
    "'Your name is unknown. Your deed is immortal.'",
    "'There is no try. Only do.'",
    "'Never tell people how to do things. Tell them what to and they will you with their ingenuity.'",
    "'Be yourself. Everyone else is taken.'",
    "'You have power over your mind - not outside events. Realize this, and you will find strength.'",
    "'I've got eyes on guys.'",
    "'Leaders and medics.......PLEASE'",
    "'The industrial revolution and its consequences, or something.'",
    "'I know what you are.'",
    "'Guys. I swear. Armakart really works now.'",
    "'That's nice bud.'",
    "'I'm not a doctor, but I play one in Arma.'",
    "'We're going to finally take Polshishkino this time!'",
    "'There's two types of men: those who know of banana business and those who haven't been affected by it yet.'",
    "'Ohhhhhhhhhhh, see ya goober!'",
    "'From the rapturous applause'",
    "'Comms were good.'",
    "'I can have sex whenever I want but Arma's only twice a week.'",
    "'I think I forgot the handcuffs on the nightstand.'",
    "'!sandwich'",
    "'Wait, do these quotes at the bottom of the page actually get read?'",
    "'This is cruel coalition. I'm out.'",
    "'Damn, that's crazy...'",
    "'To the left of south.'",
    "'Tank is on me.'",
    "'This is me in plain clothes.'",
    "'Peace in Varistan, at last.'",
    "'I'm up, they see me, I'm in spectator'",
    "'The sniper's dea-'",
    "'Check the wiki.'"
  ];

  quoteToDisplay = this.quotes[Math.floor(Math.random() * this.quotes.length)];
  

  getNextEventDate(eventWeekday: number, eventHour: number, eventMinute: number) { 
    const cstDate: DateTime = DateTime.now().setZone(this.coalTimezone);
    const cstWeekday: number = cstDate.weekday;
    var dateDifference: number = eventWeekday - cstWeekday;
    if (cstWeekday == eventWeekday && cstDate.hour >= eventHour + 4 && cstDate.minute > eventMinute) { // Is it Friday after 10PM? (expected end of CFC)
      dateDifference = 7;
    } else {
      if (dateDifference < 0) {
        dateDifference = eventWeekday - 2 + -dateDifference;
      }
    }

    const nextCSTCFCDate = DateTime.now().setZone(this.coalTimezone).plus({days: dateDifference}).set({hour: eventHour, minute: eventMinute, second: 0});
    const nextLocalCFCDate = DateTime.now().setZone(this.coalTimezone).plus({days: dateDifference}).set({hour: eventHour, minute: eventMinute, second: 0}).setZone("local");
    return {
      cstHour: nextCSTCFCDate.toLocaleString(DateTime.TIME_SIMPLE),
      cstDay: nextCSTCFCDate.weekdayShort,

      localHour: nextLocalCFCDate.toLocaleString(DateTime.TIME_SIMPLE),
      localDay: nextLocalCFCDate.weekdayShort,
    }
  }

  ngOnInit(): void {
    this.events[0] = {
      id: 0,
      src: "./assets/images/bmp.png",
      title: "COALITION Fight Club",
      nextEventDate: this.getNextEventDate(5, 18, 0),
      about: [
        "Three back-to-back, one-life, high-intensity TVT missions, featuring orgainzed and structured gamplay, aswell as a variety of maps, factions and roles."
      ]
    }
    this.events[1] = {
      id: 1,
      src: "./assets/images/btr90.png",
      title: "COALITION Reforger Church",
      nextEventDate: this.getNextEventDate(7, 18, 0),
      about: [
        "A laid back extended COOP mission, featuring respawns, a dedicated gamemaster, and a fun and unique experience."
      ]
    }
    this.events[2] = {
      id: 2,
      src: "./assets/images/timber_ridge.png",
      title: "COALITION Campaign",
      nextEventDate: this.getNextEventDate(6, 12, 0),
      about: [
        "Our members only campaign. Join a section specializing in a mode of combat, and fight in a persistant, story driven, campaign."
      ]
    }
    this.events[3] = {
      id: 3,
      src: "./assets/images/1874880_20240517212309_1.png",
      title: "COALITION Community Operations",
      nextEventDate: this.getNextEventDate(6, 12, 0),
      about: [
        "Our primier 128+ player, multi-community event. Featuring multiple weeks of planning and organization culminating into a singular day of combat."
      ]
    }

    Aos.init()
  }

  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }
}
