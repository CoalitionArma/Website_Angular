import { Component } from '@angular/core';
import { StatCardComponent } from "../profile-components/stat-cards/stat-card/stat-card.component";
import { SlideBarStatCardComponent } from "../profile-components/stat-cards/slide-bar-stat-card/slide-bar-stat-card.component";
import { NgFor } from '@angular/common';
import { FactionWithFlagComponent } from "../profile-components/faction-with-flag/faction-with-flag.component";
import { MissionCardComponent } from "../profile-components/mission-card/mission-card.component";
import { DateTime } from 'luxon';
import { CircleBarStatCardComponent } from "../profile-components/stat-cards/circle-bar-stat-card/circle-bar-stat-card.component";
@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [StatCardComponent, SlideBarStatCardComponent, NgFor, FactionWithFlagComponent, MissionCardComponent, CircleBarStatCardComponent],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss'
})
export class ProfileOverviewComponent {

  winsValue = "72"
  winsSubvalue = "27 WINS"

  kdValue = "69"
  kdSubvalue = "10 KILLS"
  kdStatPercentage = 0.1

  accuracyValue = "20"
  accuracySubvalue = "9001 SHOTS"
  accuracyStatPercentage = 0.3


  oneLifeMission = {
    missionName: "Swing Past",
    author: "FanServ",
    gamemode: "Search and Destory",
    style: "onelife",
    date:  {
      start: DateTime.fromSeconds(1733616000),
      end: DateTime.fromSeconds(1733616000)
    },
    win: false,

    side: "fia",
    enemies: ["usarmy"],
    allies: ["fia", "ussr"],
    
    slot: "Cell 1 Automatic Rifleman",
    infKills: 4,
    vicKills: 0,
    heliKills: 1,

    killers: [
      {name: "Tanaka",
        side: "ussr",
        weapon: "Mi-8 (S-8 HEAT Rocket)"
      }
    ]
  }

  repsawnMission = {
    missionName: "Gall Bladdar Removal Surgery",
    author: "Lazz",
    gamemode: "Attack/Defend",
    style: "respawn",
    date:  {
      start: DateTime.fromSeconds(1733616000),
      end: DateTime.fromSeconds(1733628240)
    },
    win: true,

    side: "usarmy",
    enemies: ["ussr"],
    allies: ["usarmy"],
    
    slot: "Bradley 1 Gunner",
    infKills: 10,
    vicKills: 2,
    heliKills: 0,

    killers: [
      {name: "NJPatman",
        side: "ussr",
        weapon: "RPG-7 (PG-7M)"
      },
      {name: "RebelCid",
        side: "ussr",
        weapon: "AKSU-74 (5.45x39mm BP gs)"
      },
      {name: "JLaw",
        side: "usarmy",
        weapon: "M15 Mine"
      },
      {name: "SchmidtStorm",
        side: "ussr",
        weapon: "MiG-29 (KAB-500L)"
      },
      {name: "Embrodak",
        side: "ussr",
        weapon: "9K111 Fagot"
      }
    ]
  }

  mission = this.repsawnMission


  bestCards = [
    { title: "WEAPON", value: "M16A1", subvalue: "10 KILLS", statPercentage: 0.5, unit: ""},
    { title: "ROLE", value: "Rifleman Anti-Tank", subvalue: "18 MISSIONS", statPercentage: 0.9, unit: ""},
    { title: "VEHICLE", value: "HMMMV", subvalue: "4 HOURS", statPercentage: 0.2, unit: ""},
    { title: "MAP", value: "Everon", subvalue: "50 MISSIONS", statPercentage: 0.8, unit: ""},
    { title: "FACTION", value: "US Army", subvalue: "18 MISSIONS", statPercentage: 0.6, unit: ""},
    { title: "LONGEST KILL", value: "178", subvalue: "M16A1", statPercentage: 0.1, unit: "M"}
  ]
}
