import { AfterViewInit, Component,QueryList,ViewChild, ViewChildren } from '@angular/core';
import { GameOfTheWeekCardComponent } from '../game-of-the-week-card/game-of-the-week-card.component';
import { GameOfTheWeekCardContainerComponent } from "../game-of-the-week-card-container/game-of-the-week-card-container.component";
import { GameCardService } from '../game-of-the-week-card-container/game-card.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-other-games',
  standalone: true,
  imports: [GameOfTheWeekCardComponent, GameOfTheWeekCardContainerComponent, NgFor],
  templateUrl: './other-games.component.html',
  styleUrl: './other-games.component.scss',
})

export class OtherGamesComponent implements AfterViewInit{
  @ViewChildren("otherGameCard") otherGameCards!: QueryList<GameOfTheWeekCardContainerComponent>


  constructor (private gameCardService: GameCardService) {
  }

  gameImgs = this.gameCardService.getGames()


  startAnimation() {
    setTimeout(this.cycleRandomCard, 3000, this.otherGameCards)
  }

  cycleRandomCard(otherGameCards: QueryList<GameOfTheWeekCardContainerComponent>) {
    const i = Math.floor(Math.random() * 5)
    otherGameCards.get(i)!.cycleGame()
  }

  ngAfterViewInit(): void {
    this.startAnimation()
  }

  //https://stackoverflow.com/questions/44939878/dynamically-adding-and-removing-components-in-angular
}
