import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOfTheWeekCardComponent } from './game-of-the-week-card.component';

describe('GameOfTheWeekCardComponent', () => {
  let component: GameOfTheWeekCardComponent;
  let fixture: ComponentFixture<GameOfTheWeekCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOfTheWeekCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOfTheWeekCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
