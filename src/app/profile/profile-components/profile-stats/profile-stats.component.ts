import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-stats',
  standalone: true,
  imports: [],
  templateUrl: './profile-stats.component.html',
  styleUrl: './profile-stats.component.scss'
})
export class ProfileStatsComponent implements OnInit {

  // {name: String, kills: Number, accuracy: Number, timesDeployed: Number}
  // m249 saw, m60, m21 sws, m16 carbine, m203, m72 law, m9, m67, m15 at mine, m112 demolition block, m9 bayonet
  // pm, aks-74u, ak-74, ak-74n, rpk-74, rpk-74n, pkm, svd, rpg-7v1, gp25, tm-62m, 400g tnt demolition block, 6Kh4 Bayonet

  weaponsStats: any = []

  ngOnInit() {
    function rand(max: number) {
      return Math.floor(Math.random() * max)
    }

    let weaponList = [
      "M249 SAW", "M60", "M21 SWS", "M16 Carbine", "M203", "M72 LAW", "M9", "M67", "M15 AT Mine", "M112 Demolition Block", "M9 Bayonet",
      "PM", "AKS-74U", "AK-74", "AK-74N", "RPK-74", "RPK-74N", "PKM", "SVD", "RPG-7V1", "GP25", "TM-26M", "400g TNT Demolition Block", "6Kh4 Bayonet"
    ]

    this.weaponsStats = weaponList.map(name => {
      return {name: name, kills: rand(200), accuracy: rand(5000)/100, timesDeployed: rand(36)}
     })

     console.log(this.weaponsStats)
  }

}
