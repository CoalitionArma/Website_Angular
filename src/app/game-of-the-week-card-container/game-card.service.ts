import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GameCardService {

  constructor(private httpClient: HttpClient) { }

  private path = "./assets/images/othergames/gameCards"
  private extension = ".jpg"

  private cardsAll: string[] = [
    "7daystodie",
    "cs2",
    "escapefromtarkov",
    "eveonline",
    "ffxiv",
    "insurgencysandstorm",
    "minecraft",
    "osrs",
    "rainbow6seige",
    "runescape",
  ].map(c => this.path + "/" + c + this.extension)

  private cardsLeftToShow = this.cardsAll.slice()
  private displayedGames: string[] = []

  getGames(): string[] {
    return this.cardsAll
  }

  getGame(): string {
    if (this.cardsLeftToShow.length == 0) {
      this.cardsLeftToShow = this.cardsAll.slice()
    }

    const i = Math.floor(Math.random() * this.cardsLeftToShow.length)
    console.log("cardsLefToShow", this.cardsLeftToShow)
    console.log("i", i)
    console.log("2", this.cardsLeftToShow[2])
    console.log("0", this.cardsLeftToShow[0])
    const game = this.cardsLeftToShow[i]
    this.httpClient.get(game, {responseType: "blob"})
    this.cardsLeftToShow.splice(i, 1)

    console.log(game)
    return game
  }

  cycleGame(currentGame: string): string {
    const game = this.getGame()
    const i = this.displayedGames.indexOf(currentGame)
    this.displayedGames.splice(i, 1, game)
    return game
  }
}
//https://stackoverflow.com/questions/59555080/how-can-i-fetch-an-image-in-an-intuitive-way-using-angular-httpclient