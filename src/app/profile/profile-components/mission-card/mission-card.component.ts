import { Component, Input, OnInit } from '@angular/core';
import { FactionWithFlagComponent } from "../faction-with-flag/faction-with-flag.component";
import { DateTime } from 'luxon';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-mission-card',
  standalone: true,
  imports: [FactionWithFlagComponent, NgFor, NgIf],
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.scss'
})
export class MissionCardComponent implements OnInit {
  @Input() missionData: any;

  startDateString: String = ""
  startTimeString: String = ""
  endTimeString: String = ""
  killersToList: any = []

  ngOnInit(): void {
    this.startDateString = this.missionData.date.start.toLocaleString(DateTime.DATE_FULL)
    this.startTimeString = this.missionData.date.start.toLocaleString(DateTime.TIME_SIMPLE)
    this.endTimeString = this.missionData.date.end.toLocaleString(DateTime.TIME_SIMPLE)

    if (this.missionData.style == "onelife") {
      this.missionData.kia = this.missionData.killers.length > 0
    }
    else {
      this.missionData.kia = false
    }

    this.killersToList = this.missionData.killers.slice(0, 3)
  }

  // mission name: String
  // author: String
  // gamemode: String
  // repsawn? one life?
  // date: DateTime?
  
  // enemies: List
  // allies: List
  
  // slot: String
  // inf kills: Num
  // vic kills: Num
  // heli kills: Num

  // killer(s) + slots: List(Name, Slot, Side, Weapon)

  // one life
  // kia?: Bool
}
