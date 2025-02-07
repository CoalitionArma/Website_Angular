import { Component, Input } from '@angular/core';
import { StatCardComponent } from "../stat-card/stat-card.component";

@Component({
  selector: 'app-slide-bar-stat-card',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './slide-bar-stat-card.component.html',
  styleUrl: './slide-bar-stat-card.component.scss'
})
export class SlideBarStatCardComponent {
  @Input() title =  "slide-bar-stat-title"
  @Input() value = "stat-value"
  @Input() subvalue = "stat-subvalue"
  @Input() statPercentage = .5
}
