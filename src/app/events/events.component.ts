import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';

import { EventService } from '../services/discord-events.service';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule, HttpClientModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [{ title: 'Meeting', start: new Date() }],
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    let events = this.eventService.getEvents();
    console.log(events);
  }
}
