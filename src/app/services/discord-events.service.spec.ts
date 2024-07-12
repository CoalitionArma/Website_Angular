import { TestBed } from '@angular/core/testing';

import { EventService } from './discord-events.service';

describe('DiscordEventsService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
