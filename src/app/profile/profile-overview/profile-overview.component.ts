import { Component } from '@angular/core';
import { StatCardComponent } from "../profile-components/stat-cards/stat-card/stat-card.component";
import { SlideBarStatCardComponent } from "../profile-components/stat-cards/slide-bar-stat-card/slide-bar-stat-card.component";
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [StatCardComponent, SlideBarStatCardComponent, NgFor],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss'
})
export class ProfileOverviewComponent {

  winsValue = "72%"
  winsSubvalue = "27 WINS"
  winsStatPercentage = 0.76

  kdValue = "0.69"
  kdSubvalue = "10 KILLS"
  kdStatPercentage = 0.1

  accuracyValue = "20%"
  accuracySubvalue = "9001 SHOTS"
  accuracyStatPercentage = 0.3



  bestCards = [
    { title: "WEAPON", value: "M16A1", subvalue: "10 KILLS", statPercentage: 0.5 },
    { title: "ROLE", value: "Rifleman Anti-Tank", subvalue: "18 MISSIONS", statPercentage: 0.9},
    { title: "VEHICLE", value: "HMMMV", subvalue: "4 HOURS", statPercentage: 0.2},
    { title: "MAP", value: "Everon", subvalue: "50 MISSIONS", statPercentage: 0.8},
    { title: "FACTION", value: "US Army", subvalue: "18 MISSIONS", statPercentage: 0.6},
    { title: "LONGEST KILL", value: "178 M", subvalue: "M16A1", statPercentage: 0.1}
  ]
}
