import { TestBed } from '@angular/core/testing';

import { GameCardService } from './game-card.service';

describe('GameCardService', () => {
  let service: GameCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
