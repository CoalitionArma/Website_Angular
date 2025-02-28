import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleBarStatCardComponent } from './circle-bar-stat-card.component';

describe('CircleBarStatCardComponent', () => {
  let component: CircleBarStatCardComponent;
  let fixture: ComponentFixture<CircleBarStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleBarStatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleBarStatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
