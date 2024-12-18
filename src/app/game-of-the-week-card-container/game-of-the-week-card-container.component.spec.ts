import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOfTheWeekCardContainerComponent } from './game-of-the-week-card-container.component';

describe('GameOfTheWeekCardContainerComponent', () => {
  let component: GameOfTheWeekCardContainerComponent;
  let fixture: ComponentFixture<GameOfTheWeekCardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOfTheWeekCardContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOfTheWeekCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
