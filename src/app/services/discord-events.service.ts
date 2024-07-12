import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: string;
  name: string;
  description: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  creatorId: string;
  status: string;
  entityType: string;
  privacyLevel: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://135.148.136.167:5000/events';  // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
}
