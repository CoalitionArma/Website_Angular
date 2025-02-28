import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-faction-with-flag',
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
  templateUrl: './faction-with-flag.component.html',
  styleUrl: './faction-with-flag.component.scss'
})
export class FactionWithFlagComponent implements OnInit {
  @Input() factionID: string = "dev"
  @Input() flagSide: string = "right"
  faction = {
    img: "devFlag.png",
    name: "DevFaction",
    side: "indfor"
  }

  factions = new Map()

  ngOnInit() {
    this.factions.set("ussr", {
      img: "./assets/dev-assets/ussr.png",
      name: "USSR",
      side: "opfor"
    })

    this.factions.set("usarmy", {
      img: "./assets/dev-assets/usa.png",
      name: "US Army",
      side: "blufor"
    })

    this.factions.set("fia", {
      img: "./assets/dev-assets/fia.png",
      name: "FIA",
      side: "indfor"
    })

    this.faction = this.factions.get(this.factionID)
  }
}
