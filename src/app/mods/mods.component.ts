import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface Mod {
  name: string;
  guid: string;
}

interface ModCategory {
  name: string;
  mods: Mod[];
}

@Component({
  selector: 'app-mods',
  standalone: true,
  imports: [NgFor],
  templateUrl: './mods.component.html',
  styleUrl: './mods.component.scss'
})
export class ModsComponent {
  readonly workshopBaseUrl = 'https://reforger.armaplatform.com/workshop/';

  workshopUrl(guid: string): string {
    return this.workshopBaseUrl + guid;
  }

  categories: ModCategory[] = [
    {
      name: 'Terrains',
      mods: [
        { name: 'Al Hadra', guid: '68957914EA45BA6C' },
        { name: 'Chernarus Minus', guid: '665D1AA55B5D8076' },
        { name: 'FallujahV2', guid: '6895026E1FEAD75D' },
        { name: 'Mussalo', guid: '59CF333B3A309D6E' },
        { name: 'The Golden Gate', guid: '6734F85352EF7A79' },
        { name: 'Zarichne', guid: '61732D4F7D980E9A' },
      ]
    },
    {
      name: 'ACE Dev',
      mods: [
        { name: 'ACE Captives Dev', guid: '65AD7C249E4ECDFB' },
        { name: 'ACE Carrying Dev', guid: '65AD7C379CBD394D' },
        { name: 'ACE Chopping Dev', guid: '65AD7BCC9F6B3B4E' },
        { name: 'ACE Cook-Off Dev', guid: '664AFDC993C9CE1A' },
        { name: 'ACE Explosives Dev', guid: '65AD7D1E9EEAFA53' },
        { name: 'ACE Facepaint Dev', guid: '68EAA4B96976D557' },
        { name: 'ACE Finger Dev', guid: '65AD7D2E9866FA6E' },
        { name: 'ACE Magazine Repack Dev', guid: '65AD7D4099944EBD' },
        { name: 'ACE Medical Circulation Dev', guid: '65AD7D4F994EA327' },
        { name: 'ACE Medical Core Dev', guid: '6586079789278413' },
        { name: 'ACE Medical Hitzones Dev', guid: '65B343F799FB521B' },
        { name: 'ACE Tactical Ladder Dev', guid: '65AD7CB89F219E38' },
        { name: 'ACE Trenches Dev', guid: '65AD7CE59E8DB349' },
        { name: 'ACE Weather Dev', guid: '667B230F9505C8BA' },
      ]
    },
    {
      name: 'WCS Weapons Suite',
      mods: [
        { name: 'WCS_Weapons', guid: '65CF7AE8574E06D2' },
        { name: 'WCS_Sounds', guid: '631C3C1AEE9C90BC' },
        { name: 'WCS_Scopes', guid: '62A668F513428630' },
        { name: 'WCS_FlipPush', guid: '612851D73DF01668' },
        { name: 'WCS_NATO', guid: '615806DC6C57AF02' },
        { name: 'WCS_RU', guid: '615818DA7C0343FD' },
        { name: 'WCS_Attachments', guid: '61C74A8B647617DA' },
        { name: 'WCS_Armbands', guid: '61E42AE6714A3CC2' },
        { name: 'WCS_Earplugs', guid: '612F512CD4CB21D5' },
      ]
    },
    {
      name: 'ARMA-RY Weapons',
      mods: [
        { name: 'ARMA-RY Claw Mount', guid: '6614BC5EC4E1675B' },
        { name: 'ARMA-RY G3 Modernised', guid: '6614BD8AC622B696' },
        { name: 'ARMA-RY G3 Special Rifles', guid: '6614BD0AC038E724' },
        { name: 'ARMA-RY M1911A1 Pistol', guid: '665B1AF5996EB7AA' },
        { name: 'ARMA-RY M79 Grenade Launcher', guid: '66731579C7075EB3' },
        { name: 'ARMA-RY Retro Optics', guid: '66C4D6C8EA530745' },
        { name: 'ARMA-RY Soviet Equipment', guid: '671F3CDAC20CDDC1' },
        { name: 'ARMA-RY Soviet Optics', guid: '67153CD5DC771D42' },
      ]
    },
    {
      name: 'Big Chungus Weapons Pack',
      mods: [
        { name: 'Big Chungus Bolt Guns', guid: '61BD6595183FCEBD' },
        { name: 'Big Chungus Launchers', guid: '6190F1B505C08562' },
        { name: 'Big Chungus LMGs', guid: '61344BDC155A5A28' },
        { name: 'Big Chungus Rifles', guid: '62A711001B8FDEEA' },
        { name: 'Big Chungus Shotguns', guid: '620E584B1D2C96A4' },
        { name: 'Big Chungus SMGs', guid: '60E6F54E174C53C5' },
      ]
    },
    {
      name: 'Vehicles & Aircraft',
      mods: [
        { name: 'C-130 Hercules', guid: '62A302A23B480373' },
        { name: 'Gs Flight Model Pack', guid: '68846A953735DF39' },
        { name: 'Gs Mountable BTR-70', guid: '617A2E90EA218AC4' },
        { name: 'Integrity - Coyota Offroad', guid: '68F0286BB2B783E4' },
        { name: 'Parachute Framework', guid: '65930CB4CD0237B2' },
      ]
    },
    {
      name: 'Characters & Factions',
      mods: [
        { name: 'ARMA2 Skins Port', guid: '686D4A0760BC7F87' },
        { name: 'British Forces', guid: '5AE50EC5B8D6F4AE' },
        { name: 'Early 2000s US Military', guid: '60B134EF0216CF4D' },
        { name: 'Middle East Insurgents', guid: '64CEC8E005828E5D' },
        { name: 'RHS - Status Quo', guid: '595F2BF2F44836FB' },
        { name: 'ToH ReCharacters Man', guid: '596330D9AF34AF38' },
        { name: 'TROOPFIT ARSENAL', guid: '686146A940C9D3EA' },
        { name: 'TTsKO Plus', guid: '6676B89E6B8E35B3' },
      ]
    },
    {
      name: 'Coalition Custom',
      mods: [
        { name: 'Coalition Squad Interface', guid: '5B0D1E4380971EBD' },
        { name: 'COALITION Radios', guid: '61E34313E144DDA8' },
        { name: 'Coalition VON', guid: '6624E618B9058265' },
        { name: 'Coalition Battle Royal Addon', guid: '686F41B5C4D229A4' },
        { name: "fluffs Coalition Gear", guid: '672C4CF30574F4E0' },
      ]
    },
    {
      name: 'Gameplay & Mechanics',
      mods: [
        { name: 'Accurate Map Markers', guid: '670C26EAB7B57C77' },
        { name: 'Adult Mortars', guid: '6318DCB19B389CC8' },
        { name: 'AT-4', guid: '64E37695015F8AFA' },
        { name: 'Atmospheric Weather Mod', guid: '64ED6553B8AF6B62' },
        { name: 'Bon Action Animations', guid: '5C9758250C8C56F1' },
        { name: 'Disable Game Master Budgets', guid: '5F2944B7474F043F' },
        { name: 'Enhanced Maps', guid: '644B042109700804' },
        { name: 'Flashlight Stays On When Dropped', guid: '64CD29251DC39859' },
        { name: 'Game Master Enhanced', guid: '5964E0B3BB7410CE' },
        { name: 'Game Master FX', guid: '5994AD5A9F33BE57' },
        { name: 'GC Suppression', guid: '684CE8AA3B1D6573' },
        { name: 'Improved Blood Effect', guid: '62FCEB51DF8527B6' },
        { name: 'M249 Scope Rails', guid: '5AF6E0F075D79473' },
        { name: 'Map Drawing', guid: '656AC01634459D8D' },
        { name: 'Map Exporter with TIL Drawings', guid: '66212054B3A0EDC6' },
        { name: 'Melee Combat Extended', guid: '6595113A3678CF5D' },
        { name: 'MG3 with RIS Rail', guid: '6497438B19727E0D' },
        { name: 'Nasty Explosives', guid: '65CB34AF1C70AEC6' },
        { name: 'No Weapon Drop Unconscious', guid: '60612C225328522E' },
        { name: 'Realistic Combat Drones', guid: '65AD60E204191D37' },
        { name: 'ReFX - Effects Enhancement', guid: '6172FBB03A3D6C10' },
        { name: 'Server Admin Tools', guid: '5AAAC70D754245DD' },
        { name: 'Slower Strafe', guid: '60557550B10EB832' },
        { name: 'Spectral Tracers - Unified', guid: '66EE300214703AC9' },
        { name: 'Stun Grenade', guid: '59EAA899751805DF' },
        { name: 'Tactical Flava', guid: '5D550926D43F1409' },
        { name: 'Thermal PostProcess', guid: '661B5884EF0760FE' },
        { name: 'Vanilla IEDs', guid: '68B6525C55B7F276' },
        { name: 'VTF Rally Championship', guid: '60F697135C1AF8E9' },
        { name: 'WeakerWalls', guid: '620A15433CA8D688' },
        { name: 'Wirecutters 2', guid: '62F364B35E9B51B0' },
        { name: 'Zimnitrita', guid: '597697D81A1EA202' },
      ]
    },
  ];

  get totalMods(): number {
    return this.categories.reduce((sum, cat) => sum + cat.mods.length, 0);
  }
}
