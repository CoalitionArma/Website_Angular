import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionCardComponent } from './mission-card.component';

describe('MissionCardComponent', () => {
  let component: MissionCardComponent;
  let fixture: ComponentFixture<MissionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
