import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  Event, 
  CreateEventRequest, 
  CreateEventResponse, 
  SlotRoleRequest, 
  SlotRoleResponse 
} from '../interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private EVENTS_URL = `${environment.apiUrl}/events`;
  
  // BehaviorSubject to hold events list for reactive updates
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadEvents();
  }

  // Get HTTP headers with JWT token
  private getAuthHeaders(): HttpHeaders {
    const jwtToken = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'access_token': jwtToken || '',
      'Content-Type': 'application/json'
    });
  }

  // Handle HTTP errors
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('Events service error:', error);
    return throwError(() => error);
  };

  // Load all events
  loadEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.EVENTS_URL).pipe(
      tap((events: Event[]) => {
        // Convert date strings to Date objects
        const processedEvents = events.map(event => ({
          ...event,
          dateTime: new Date(event.dateTime),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }));
        this.eventsSubject.next(processedEvents);
      }),
      catchError(this.handleError)
    );
  }

  // Get current events from the subject
  get events(): Event[] {
    return this.eventsSubject.value;
  }

  // Create a new event
  createEvent(eventData: CreateEventRequest): Observable<CreateEventResponse> {
    const headers = this.getAuthHeaders();

    return this.http.post<CreateEventResponse>(`${this.EVENTS_URL}/create`, eventData, { headers }).pipe(
      tap((response: CreateEventResponse) => {
        if (response.success) {
          // Convert date strings to Date objects
          const processedEvent = {
            ...response.event,
            dateTime: new Date(response.event.dateTime),
            createdAt: new Date(response.event.createdAt),
            updatedAt: new Date(response.event.updatedAt)
          };
          
          // Add the new event to the local events list
          const currentEvents = this.eventsSubject.value;
          this.eventsSubject.next([...currentEvents, processedEvent]);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Slot a user into a role
  slotRole(slotData: SlotRoleRequest): Observable<SlotRoleResponse> {
    const headers = this.getAuthHeaders();
    
    return this.http.post<SlotRoleResponse>(`${this.EVENTS_URL}/slot`, slotData, { headers }).pipe(
      tap((response: SlotRoleResponse) => {
        if (response.success) {
          // Convert date strings to Date objects
          const processedEvent = {
            ...response.event,
            dateTime: new Date(response.event.dateTime),
            createdAt: new Date(response.event.createdAt),
            updatedAt: new Date(response.event.updatedAt)
          };
          
          // Update the event in the local events list
          const currentEvents = this.eventsSubject.value;
          const updatedEvents = currentEvents.map(event => 
            event.id === processedEvent.id ? processedEvent : event
          );
          this.eventsSubject.next(updatedEvents);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Unslot a user from a role
  unslotRole(slotData: SlotRoleRequest): Observable<SlotRoleResponse> {
    const headers = this.getAuthHeaders();
    
    return this.http.post<SlotRoleResponse>(`${this.EVENTS_URL}/unslot`, slotData, { headers }).pipe(
      tap((response: SlotRoleResponse) => {
        if (response.success) {
          // Convert date strings to Date objects
          const processedEvent = {
            ...response.event,
            dateTime: new Date(response.event.dateTime),
            createdAt: new Date(response.event.createdAt),
            updatedAt: new Date(response.event.updatedAt)
          };
          
          // Update the event in the local events list
          const currentEvents = this.eventsSubject.value;
          const updatedEvents = currentEvents.map(event => 
            event.id === processedEvent.id ? processedEvent : event
          );
          this.eventsSubject.next(updatedEvents);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Admin kick a user from a role
  adminKickFromRole(slotData: SlotRoleRequest): Observable<SlotRoleResponse> {
    const headers = this.getAuthHeaders();
    
    return this.http.post<SlotRoleResponse>(`${this.EVENTS_URL}/admin/kick`, slotData, { headers }).pipe(
      tap((response: SlotRoleResponse) => {
        if (response.success) {
          // Convert date strings to Date objects
          const processedEvent = {
            ...response.event,
            dateTime: new Date(response.event.dateTime),
            createdAt: new Date(response.event.createdAt),
            updatedAt: new Date(response.event.updatedAt)
          };
          
          // Update the event in the local events list
          const currentEvents = this.eventsSubject.value;
          const updatedEvents = currentEvents.map(event => 
            event.id === processedEvent.id ? processedEvent : event
          );
          this.eventsSubject.next(updatedEvents);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Get a single event by ID
  getEvent(eventId: string): Event | undefined {
    return this.eventsSubject.value.find(event => event.id === eventId);
  }

  // Delete an event (only by creator)
  deleteEvent(eventId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.delete(`${this.EVENTS_URL}/${eventId}`, { headers }).pipe(
      tap(() => {
        // Remove the event from the local events list
        const currentEvents = this.eventsSubject.value;
        const updatedEvents = currentEvents.filter(event => event.id !== eventId);
        this.eventsSubject.next(updatedEvents);
      }),
      catchError(this.handleError)
    );
  }
}
