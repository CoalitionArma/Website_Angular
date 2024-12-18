import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-game-of-the-week-card',
  standalone: true,
  imports: [],
  templateUrl: './game-of-the-week-card.component.html',
  styleUrl: './game-of-the-week-card.component.scss',
  // animations: [
  //   trigger("inOut",[
  //     state('in', style({transform: 'translateX(0)'})),
  //     transition(':enter', [style({transform: 'translateX(-100%)'}), animate(100)]),
  //     transition(':leave', [animate(100, style({transform: 'translateX(100%)'}))]),
  //   ])
  // ]
})
export class GameOfTheWeekCardComponent {
  @Input() imgSrc!: string

  constructor() {}
}
