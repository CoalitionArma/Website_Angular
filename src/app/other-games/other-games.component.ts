import { AfterViewInit, Component, ElementRef, ViewChild, HostBinding } from '@angular/core';
import { GameOfTheWeekCardComponent } from '../game-of-the-week-card/game-of-the-week-card.component';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-other-games',
  standalone: true,
  imports: [GameOfTheWeekCardComponent],
  templateUrl: './other-games.component.html',
  styleUrl: './other-games.component.scss',
  animations: [
    trigger("shiftLeftReset", [
      state('shiftLeft', 
        style({
          transform: "translateX(-100%)"
        })
      ),
      state('normal', 
        style({
        })
      ),
      transition("normal => shiftLeft", [animate(500)]),
      transition("shiftLeft => normal", [animate(500)])
    ])
  ]
})
export class OtherGamesComponent {
  @ViewChild('otherGames1') otherGames1!: ElementRef

  isCycle = false

  cycleGame() {
    this.isCycle = !this.isCycle
  }

  //https://stackoverflow.com/questions/44939878/dynamically-adding-and-removing-components-in-angular
}
