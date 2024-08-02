import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-of-the-week-card',
  standalone: true,
  imports: [],
  templateUrl: './game-of-the-week-card.component.html',
  styleUrl: './game-of-the-week-card.component.scss'
})
export class GameOfTheWeekCardComponent {
  @Input({ required: true }) bgColor!: String;
}
