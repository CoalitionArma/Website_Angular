import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventService } from '../services/discord-events.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    // Start with an empty events array
    events: []
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.eventService.getEvents().subscribe((events) => {
      console.log(events)
      // Update the calendarOptions with the new events
      this.calendarOptions.events = events.map(event => ({
        id: event.id,
        title: event.name,
        start: event.scheduledStartTime,
        end: event.scheduledEndTime,
        allDay: true // Adjust based on your data
      }));
    });
  }
}
