import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

export interface DiscordEvent {
  id: string;
  name: string;
  description: string;
  scheduledStartAt: string;
  scheduledEndAt: string | null;
  image: string | null;
  url: string;
  userCount: number;
  status: number; // 1=SCHEDULED 2=ACTIVE
  gameType?: { label: string; description: string; classes: string } | null;
}

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NgClass, DatePipe],
  templateUrl: './getting-started.component.html',
  styleUrl: './getting-started.component.scss'
})
export class GettingStartedComponent implements OnInit {
  readonly discordUrl = 'https://discord.gg/the-coalition';
  readonly armaStoreUrl = 'https://store.steampowered.com/app/1874880/Arma_Reforger/';
  readonly serverName = 'COALITION';
  readonly teamspeakUrl = 'https://teamspeak.com/en/downloads/#ts3client';
  readonly vonReleasesUrl = 'https://github.com/CoalitionArma/Coalition-VON/releases';
  readonly teamspeakServer = 'ts.coalitiongroup.net';

  events = signal<DiscordEvent[]>([]);
  eventsLoading = signal(true);
  eventsError = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<DiscordEvent[]>(`${environment.botApiUrl}/api/events`).subscribe({
      next: (data) => {
        this.events.set(
          data
            .filter(e => !/CCO|Meeting/i.test(e.name))
            .map(e => ({ ...e, gameType: this.resolveGameType(e.name) }))
        );
        this.eventsLoading.set(false);
      },
      error: () => {
        this.eventsError.set(true);
        this.eventsLoading.set(false);
      }
    });
  }

  private resolveGameType(name: string): { label: string; description: string; classes: string } | null {
    if (/COTvT/i.test(name)) {
      return { label: 'COTvT', description: 'Players vs AI — some players command the AI side', classes: 'bg-amber-900/60 text-amber-300 border border-amber-700/50' };
    }
    if (/TvT/i.test(name)) {
      return { label: 'TvT', description: 'Players vs Players', classes: 'bg-red-900/60 text-red-300 border border-red-700/50' };
    }
    return null;
  }
}
