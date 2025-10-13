import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityManagementComponent } from './community-management.component';

describe('CommunityManagementComponent', () => {
  let component: CommunityManagementComponent;
  let fixture: ComponentFixture<CommunityManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});