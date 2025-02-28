import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-social-icon',
  standalone: true,
  imports: [],
  templateUrl: './profile-social-icon.component.html',
  styleUrl: './profile-social-icon.component.scss'
})
export class ProfileSocialIconComponent implements OnInit {
  constructor(private elementRef: ElementRef) { }

  @Input() href = "#"
  @Input() imgsrc = "dev.png"
  @Input() user = "devUser"

  ngOnInit(): void {
    const ne = this.elementRef.nativeElement;
    ne.style.setProperty("--social-box-full-width", this.user.length + "em")
  }
}
