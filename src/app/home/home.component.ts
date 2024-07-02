import { Component, OnInit } from '@angular/core';
import { CoalitionCarouselComponent } from '../carousel/carousel.component';
import { DateTime } from 'luxon';
import { NgFor } from '@angular/common';
import { CarouselComponent, CarouselInnerComponent, CarouselItemComponent, CarouselControlComponent, CarouselIndicatorsComponent } from '@coreui/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CoalitionCarouselComponent, CarouselComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselControlComponent, RouterLink, CarouselIndicatorsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  localTimezoneStr = DateTime.now().toFormat('ZZZZ')
  coalTimezone = 'America/Chicago'
  coalTimezoneStr = DateTime.now().setZone(this.coalTimezone).toFormat('ZZZZ')

  events: any[] = new Array(2).fill({ id: -1, src: '', title: '', nextEventDate: {cstDay: '', cstHour: '', localDay: '', localHour: ''}, infoPoints: []})

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
    "'We're going to finally take Polishkino this time!'",
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
    "'Peace in Varistan, at last.'"
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
      src: "./assets/images/btr90.png",
      title: "COALITION Fight Club",
      nextEventDate: this.getNextEventDate(5, 18, 0),
      infoPoints: [
        "One-Life Intense TvT Action", "3 Unqiue Missions per night", "Large Variety of Maps and Factions"
      ]
    }
    this.events[1] = {
      id: 1,
      src: "./assets/images/bmp.png",
      title: "COALITION Reforger Church",
      nextEventDate: this.getNextEventDate(7, 18, 0),
      infoPoints: [
        "Relaxed COOP Experience", "3 Unqiue Missions per night", "Large Variety of Maps and Factions"
      ]
    }

    console.log(this.events)
  }

  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }
}
