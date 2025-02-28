import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactionWithFlagComponent } from './faction-with-flag.component';

describe('FactionWithFlagComponent', () => {
  let component: FactionWithFlagComponent;
  let fixture: ComponentFixture<FactionWithFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactionWithFlagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactionWithFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
