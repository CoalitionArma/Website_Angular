import { ChangeDetectorRef, Component, ComponentRef, EventEmitter, inject, Output, ViewChild, ViewContainerRef } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { GameOfTheWeekCardComponent } from '../game-of-the-week-card/game-of-the-week-card.component';
import { GameCardService } from './game-card.service';

@Component({
  selector: 'app-game-of-the-week-card-container',
  standalone: true,
  imports: [GameOfTheWeekCardComponent],
  templateUrl: './game-of-the-week-card-container.component.html',
  styleUrl: './game-of-the-week-card-container.component.scss',
  animations: [
    trigger("shiftLeftReset", [
      state('shiftLeft', 
        style({
          transform: "translateX(-100%)"
        })
      ),
      state('normal', 
        style({
          transform: "translateX(0%)"
        })
      ),
      transition("normal => shiftLeft", [animate(500)]),
      transition("shiftLeft => normal", [animate(0)])
    ])
  ],
})
export class GameOfTheWeekCardContainerComponent{
  @ViewChild("cardInsert", { read: ViewContainerRef }) cardInsert!: ViewContainerRef
  @Output() animationDoneEvent = new EventEmitter()

  isCycle = false
  cdr = inject(ChangeDetectorRef)
  currentGame = this.gameCardService.getGame()

  currentCard!: ComponentRef<GameOfTheWeekCardComponent>
  nextCard!: ComponentRef<GameOfTheWeekCardComponent>

  constructor(private gameCardService: GameCardService) {
  }



  cycleGame() {
    this.addCard(this.cardInsert)
    this.isCycle = true
  }

  animationDone(event: any) {
    if (this.isCycle) {
      console.log(event)
      this.isCycle = false

      this.currentCard.destroy()
      this.currentCard = this.nextCard

      console.log(this.currentCard)
      this.animationDoneEvent.emit()
    }
  }

  ngAfterViewInit(): void {
    const compRef = this.cardInsert.createComponent(GameOfTheWeekCardComponent)
    const game = this.gameCardService.getGame() 
    compRef.setInput("imgSrc", game)
    this.cdr.detectChanges()
    
    this.currentCard = compRef
  }

  addCard(viewContainerRef: ViewContainerRef) {
    const compRef = viewContainerRef.createComponent(GameOfTheWeekCardComponent)
    const game = this.gameCardService.cycleGame(this.currentGame)
    compRef.setInput("imgSrc", game)
    this.cdr.detectChanges()

    this.nextCard = compRef
  }
}
