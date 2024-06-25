import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoalitionCarouselComponent } from './carousel.component';

describe('CoalitionCarouselComponent', () => {
  let component: CoalitionCarouselComponent;
  let fixture: ComponentFixture<CoalitionCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoalitionCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoalitionCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
