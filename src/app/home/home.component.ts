import { Component, OnInit } from '@angular/core';
import { CoalitionCarouselComponent } from '../carousel/carousel.component';
import { DateTime } from 'luxon';
import { NgFor } from '@angular/common';
import { CarouselComponent, CarouselInnerComponent, CarouselItemComponent, CarouselControlComponent } from '@coreui/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CoalitionCarouselComponent, CarouselComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselControlComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  localTimezoneStr = DateTime.now().toFormat('ZZZZ')
  coalTimezone = 'America/Chicago'
  coalTimezoneStr = DateTime.now().setZone(this.coalTimezone).toFormat('ZZZZ')

  events: any[] = new Array(2).fill({ id: -1, src: '', title: '', nextEventDate: {cstDay: '', cstHour: '', localDay: '', localHour: ''}, infoPoints: []})
  

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
