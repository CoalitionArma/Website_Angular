import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReplayFile, ReplaysResponse } from '../interfaces/replay.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getReplays(): Observable<ReplaysResponse> {
    return this.http.get<ReplaysResponse>(`${this.apiUrl}/replays`);
  }

  downloadReplay(replayFile: ReplayFile): void {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = replayFile.downloadUrl;
    link.download = replayFile.filename;
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openReplayInNewTab(replayFile: ReplayFile): void {
    window.open(replayFile.downloadUrl, '_blank');
  }
}
