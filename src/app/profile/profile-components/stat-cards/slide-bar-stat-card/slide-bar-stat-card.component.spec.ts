import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideBarStatCardComponent } from './slide-bar-stat-card.component';

describe('SlideBarStatCardComponent', () => {
  let component: SlideBarStatCardComponent;
  let fixture: ComponentFixture<SlideBarStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideBarStatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideBarStatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
