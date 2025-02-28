import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSocialIconComponent } from './profile-social-icon.component';

describe('ProfileSocialIconComponent', () => {
  let component: ProfileSocialIconComponent;
  let fixture: ComponentFixture<ProfileSocialIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSocialIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSocialIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
