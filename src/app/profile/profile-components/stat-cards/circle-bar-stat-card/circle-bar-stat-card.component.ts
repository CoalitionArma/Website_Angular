import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-bar-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './circle-bar-stat-card.component.html',
  styleUrl: './circle-bar-stat-card.component.scss'
})
export class CircleBarStatCardComponent {
  @Input() title = ""
  @Input() value = ""
  @Input() subValue = ""
  @Input() unit = ""
}
