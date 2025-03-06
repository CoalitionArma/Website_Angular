import { NgFor } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BehaviorSubject } from 'rxjs';
import { FactionWithFlagComponent } from "../faction-with-flag/faction-with-flag.component";

export interface Weapon {
  name: String
  type: String
  variants: String[]
}

export interface WeaponStat {
  name: String
  kills: number
  shots: number
  hits: number
  accuracy: number
  deployments: any
  killsPerDeployment: number
  recentKills: Kill[]
}

export interface Kill {
  victim: String
  distance: Number
  faction: String
  headshot: boolean
  friendlyFire: boolean
}

export interface Vehicle {
  name: String
  type: String
  variants: String[]
}

@Component({
  selector: 'app-profile-stats',
  standalone: true,
  imports: [MatTableModule, MatTabsModule, MatSortModule, FactionWithFlagComponent, NgFor],
  templateUrl: './profile-stats.component.html',
  styleUrl: './profile-stats.component.scss'
})
export class ProfileStatsComponent implements OnInit, AfterViewInit {

  // {name: String, kills: Number, accuracy: Number, timesDeployed: Number}
  // m249 saw, m60, m21 sws, m16 carbine, m203, m72 law, m9, m67, m15 at mine, m112 demolition block, m9 bayonet
  // pm, aks-74u, ak-74, ak-74n, rpk-74, rpk-74n, pkm, svd, rpg-7v1, gp25, tm-62m, 400g tnt demolition block, 6Kh4 Bayonet

  displayedColumns: string[] = ['rank', 'name', 'kills', 'accuracy', 'timesDeployed']
  selectedWeapon: BehaviorSubject<any> = new BehaviorSubject(-1);

  weaponsStats: any = null

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    
    this.weaponsStats!.sort = this.sort;
  }

  selectWeapon(row:any) {
    this.selectedWeapon.next(row)
  }

  ngOnInit() {
    console.log()
    function rand(max: number) {
      return Math.floor(Math.random() * max)
    }

    let weaponList: Weapon[] = [
      {name: "M249 SAW", type:"mg", variants: ["Default"]},
      {name: "M60", type:"mg", variants: ["Default"]},
      {name: "M21 SWS", type:"sniper", variants: ["Default"]},
      {name: "M16 Carbine", type:"rifle", variants: ["Black", "Camo", "Olive"]},
      {name: "M16A2", type:"rifle", variants: ["Black", "Camo", "Olive"]},
      {name: "M203", type:"ugl", variants: ["Default"]},
      {name: "M72 LAW", type:"launcher", variants: ["Default"]},
      {name: "M9", type:"pistol", variants: ["Default"]},
      {name: "M67", type:"grenade", variants: ["Default"]},
      {name: "M15 AT Mine", type:"explosive", variants: ["Default"]},
      {name: "M112 Demolition Block", type:"explosive", variants: ["Default"]},
      {name: "M9 Bayonet", type:"melee", variants: ["Default"]},
      {name: "PM", type:"pistol", variants: ["Default"]},
      {name: "AKS-74U", type:"rifle", variants: ["Default"]},
      {name: "AKS-74UN", type:"rifle", variants: ["Default"]},
      {name: "AK-74", type:"rifle", variants: ["Default"]},
      {name: "AK-74N", type:"rifle", variants: ["Default"]},
      {name: "RPK-74", type:"mg", variants: ["Default"]},
      {name: "RPK-74N", type:"mg", variants: ["Default"]},
      {name: "PKM", type:"mg", variants: ["Default"]},
      {name: "SVD", type:"sniper", variants: ["Default"]},
      {name: "RPG-7V1", type:"launcher", variants: ["Default"]},
      {name: "GP25", type:"ugl", variants: ["Default"]},
      {name: "TM-26M", type:"explosive", variants: ["Default"]},
      {name: "400g TNT Demolition Block", type:"explosive", variants: ["Default"]},
      {name: "6Kh4 Bayonet", type:"melee", variants: ["Default"]},
    ]

    let names: String[] = [
      "Tanaka", "Kaltag", "RebelCid", "NJPatman", "Lazz", "JLaw", "SchmidtStorm", "Hawk", "LookItsDante", "Shimavitz"
    ]

    let vics: Vehicle[] = [
      {name: "M923A1 Transport Truck", type: "truck", variants: ["Open", "Camo Open", "Covered", "Camo Covered"]},
      {name: "M923A1 Fuel Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "M934A1 Command Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "M923A1 Arsenal Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "M923A1 Ammo Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "M923A1 Repair Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "M923A1 Construction Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "M151A2", type: "lightvic", variants: ["M2", "Camo M2"]},
      {name: "M1025 HMMMV", type: "lightvic", variants: ["M2", "Camo M2"]},
      {name: "UH-1H Transport Helicopter", type: "truck", variants: ["Unarmed", "Armed"]},
      {name: "UAZ-469", type: "lightvic", variants: ["Open", "Camo Open", "Covered", "Camo Covered", "PKM", "Camo PKM", "Civilian Covered", "Civilian Open"]},
      {name: "UAZ-452A Ambulance", type: "lightvic", variants: ["Default", "Civlian S1203"]},
      {name: "Ural-4320 Transport Truck", type: "truck", variants: ["Open", "Camo Open", "Covered", "Camo Covered", "Civilian Covered", "Civilian Open"]},
      {name: "Ural-4320 Fuel Truck", type: "truck", variants: ["Default", "Camo", "Civilian"]},
      {name: "Ural-4320 Command Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "Ural-4320 Arsenal Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "Ural-4320 Ammo Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "Ural-4320 Construction Truck", type: "truck", variants: ["Default", "Camo"]},
      {name: "BTR-70", type: "apc", variants: ["Default", "Camo"]},
      {name: "Mi-8MT", type: "helicopter", variants: ["Unarmed", "Armed"]},
      {name: "S105 Car", type: "lightvic", variants: ["Civilian"]}
    ]

    let factions = ["ussr", "fia", "usarmy"]

    function genWeaponStats(weapon: Weapon): WeaponStat {
      const k = rand(200)
      const d = genDeploymentData()
      const s = rand(10000)
      const h = rand(6000)
      const rk = Array(3).fill(0).map(genRecentKill)
      console.log(rk)
      return {name: weapon.name, kills: k, shots: s, hits: h, accuracy: h/s, deployments: d, killsPerDeployment: k/(d.totalDeployments), recentKills: rk}
    }

    function genRecentKill(): Kill {
      const v = names[rand(names.length)]
      const d = rand(400)
      const f = factions[rand(factions.length)]
      const h = rand(2) == 1
      const ff = rand(2) == 1
      return {victim: v, distance: d, faction: f, headshot: h, friendlyFire: ff}
    }

    function genDeploymentData() {
      const facDeployments = factions.map(f => {
        return {faction: f, deployments: rand(36)}
      })

      return {totalDeployments: facDeployments.reduce((t: number, d: any) =>{
        return t + d.deployments
      }, 0), factionDeployments: facDeployments}
    }

    var ws = weaponList.map(weapon => {
      return genWeaponStats(weapon)
     })

    ws.sort((a: any, b: any) => b.kills - a.kills).map((w: any, i: number) => {
      w.rank = i + 1
      return w
    })

     this.weaponsStats = new MatTableDataSource(ws)
  }

}
