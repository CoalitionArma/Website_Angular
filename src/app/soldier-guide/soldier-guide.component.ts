import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

interface Role {
  id: string;
  name: string;
  team: 'white' | 'red' | 'green';
  icon: string;
  summary: string;
  loadout: string[];
  tip: string;
  recruitsAllowed: boolean;
}

interface Formation {
  name: string;
  description: string;
  use: string;
  image: string;
}

interface FaqItem {
  q: string;
  a: string;
}

@Component({
  selector: 'app-soldier-guide',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './soldier-guide.component.html',
  styleUrl: './soldier-guide.component.scss'
})
export class SoldierGuideComponent {

  readonly wikiUrl = 'https://coalitiongroup.net/wiki/index.php/New_Infantry_Guide';
  readonly medicalWikiUrl = 'https://coalitiongroup.net/wiki/index.php/Medical_Information';
  readonly atWikiUrl = 'https://coalitiongroup.net/wiki/index.php/Anti-Tank_Team';
  readonly commsWikiUrl = 'https://coalitiongroup.net/wiki/index.php/Communication_and_Marking';

  sections = [
    { id: 'structure',   label: 'Structure' },
    { id: 'roles',       label: 'Roles' },
    { id: 'formations',  label: 'Formations' },
    { id: 'radios',      label: 'Radios' },
    { id: 'medical',     label: 'Medical' },
    { id: 'advanced',    label: 'Advanced' },
  ];

  roles: Role[] = [
    {
      id: 'sl',
      name: 'SL — Squad Leader',
      team: 'white',
      icon: 'M12 1L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1Z',
      summary: 'Commands the squad. Translates platoon orders into fireteam tasks and coordinates Red and Green teams.',
      loadout: ['Rifle or carbine', 'Binoculars', 'Short-range AN/PRC-343 (Squad Net)', 'Long-range radio (Platoon Net)'],
      tip: 'Your job is to make decisions, not to fight. Keep your head up and your eyes on the big picture.',
      recruitsAllowed: false,
    },
    {
      id: 'medic',
      name: 'Medic',
      team: 'white',
      icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
      summary: 'Keeps the squad alive. Carries fluids and advanced medical supplies to stabilize casualties the fireteams cannot treat themselves.',
      loadout: ['Rifle or carbine', 'IV fluids and saline', 'Extended medical kit'],
      tip: 'Stay with the SL and out of the fight. A dead medic helps no one.',
      recruitsAllowed: false,
    },
    {
      id: 'ftl',
      name: 'FTL — Fireteam Leader',
      team: 'red',
      icon: 'M12 1L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1Z',
      summary: 'Leads Red team and is second in command (2IC) of the squad. Takes over if the SL goes down.',
      loadout: ['Rifle with M203/M320 or GP25 grenade launcher', 'Binoculars', 'Short-range AN/PRC-343 (Squad Net)'],
      tip: 'Stay tactically close to your FTL at all times.',
      recruitsAllowed: false,
    },
    {
      id: 'ar',
      name: 'AR — Automatic Rifleman',
      team: 'red',
      icon: 'M3 6h18M3 12h18M3 18h18',
      summary: 'The base of fire for Red team. Lays down suppression while Green team maneuvers.',
      loadout: ['Automatic rifle or LMG', 'Pistol'],
      tip: 'You are the most powerful weapon in the fireteam. Pick good positions before opening fire.',
      recruitsAllowed: false,
    },
    {
      id: 'aar',
      name: 'AAR — Assistant Automatic Rifleman',
      team: 'red',
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      summary: 'Spot for the AR, adjust his fire, and keep him stocked with ammunition.',
      loadout: ['Rifle or carbine', 'Binoculars'],
      tip: 'Call targets and impacts using the ADD report. Your eyes are as important as your rifle.',
      recruitsAllowed: true,
    },
    {
      id: 'ftl-green',
      name: 'FTL — Green Fireteam Leader',
      team: 'green',
      icon: 'M12 1L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1Z',
      summary: 'Leads Green team and is third in command (3IC) of the squad. Executes the maneuver while Red team suppresses.',
      loadout: ['Rifle with M203/M320 or GP25 grenade launcher', 'Binoculars', 'Short-range AN/PRC-343 (Squad Net)'],
      tip: 'Communicate your movement to the Red FTL. He needs to know where you are before he lifts suppression.',
      recruitsAllowed: false,
    },
    {
      id: 'rifleman',
      name: 'Rifleman',
      team: 'green',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
      summary: 'General maneuver rifleman in Green team. Works alongside the Green FTL and may carry extra equipment like demolition.',
      loadout: ['Rifle or carbine', 'Utility items'],
      tip: 'Follow your Green FTL\'s lead. Your adaptability makes you the most versatile slot on the team.',
      recruitsAllowed: true,
    },
    {
      id: 'rat',
      name: 'RAT — Rifleman Anti-Tank',
      team: 'green',
      icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
      summary: 'Primary armor threat. You are often the entire squad\'s only anti-tank asset.',
      loadout: ['Rifle or carbine', 'Single-use anti-tank launcher'],
      tip: 'Patience is key — a missed shot wastes your only round. Range estimate carefully before firing.',
      recruitsAllowed: true,
    },
  ];

  formations: Formation[] = [
    {
      name: 'The Wedge',
      description: 'Default movement-to-contact formation. Maximum firepower forward and to the rear, but a wide cross-section from the sides.',
      use: 'Use when moving through open terrain with no confirmed contact.',
      image: 'https://coalitiongroup.net/wiki/images/thumb/2/2d/Wedge.jpg/400px-Wedge.jpg',
    },
    {
      name: 'The Line',
      description: 'Maximum firepower forward. Commonly used as a reaction to contact from the wedge, or in dense forest terrain.',
      use: 'React to contact from Wedge, or use in thick vegetation.',
      image: 'https://coalitiongroup.net/wiki/images/thumb/0/0a/Line.jpg/400px-Line.jpg',
    },
    {
      name: 'The Column',
      description: 'Lowest visual signature. Great flanking fire support but weak forward and rear. Used in minefields or choke points.',
      use: 'Dangerous obstacles, minefields, or when a low profile is essential.',
      image: 'https://coalitiongroup.net/wiki/images/thumb/5/5e/COLUMN.jpg/400px-COLUMN.jpg',
    },
  ];

  addSteps = [
    { letter: 'A', word: 'Alert', desc: 'Announce contact to your net immediately' },
    { letter: 'D', word: 'Direction', desc: 'Magnetic bearing in degrees (e.g. 252)' },
    { letter: 'D', word: 'Distance', desc: 'Estimated range in meters (e.g. 300m)' },
  ];

  radioRules = [
    'Always state your name/callsign when transmitting — never say "me" or "I"',
    'Use the ADD report for all contact calls: Alert, Direction, Distance',
    'Always use the "you-me" structure. "Red, this is green"',
    'You may hear the SL give FTLs orders. Wait until the FTL tells you what to do. Never act on the SL\'s orders without confirmation from your FTL',
    'Minimize chatter on squad nets — keep the channel clear for important traffic',
  ];

  faqs: FaqItem[] = [
    {
      q: 'I\'m new — which role should I pick?',
      a: 'Start as AAR, RAT, or Rifleman. FTL and AR are restricted for recruits until you\'ve learned the basics. AAR is the best learning role — you stay with the AR and observe everything.',
    },
    {
      q: 'How far apart should I be from my teammates?',
      a: 'Minimum 5 meters spacing in all formations. Your FTL will tell you to "push out" or "pull in". Use your CSI compass HUD to help judge distance.',
    },
    {
      q: 'What do I do if I get hit?',
      a: 'Kill any threats in front of you and get to cover.Open your inventory to check injuries. Apply bandages and tourniquets. "Stable" means no active bleeding, fluids present, and a stable heart rate — bandaged limbs alone are NOT stable. Call for a medic through your FTL if needed.',
    },
    {
      q: 'What\'s the difference between Squad Net and Platoon Net?',
      a: 'Squad Net: all members of your squad share one frequency. FTLs each carry one short-range AN/PRC-343. The SL carries two radios — one for the squad net and one for the platoon net. Platoon Net: SLs and the Platoon Element (PL + PSgt, each with two radios) share one dedicated channel.',
    },
  ];
}
