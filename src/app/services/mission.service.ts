import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mission, MissionsResponse, MissionFilters } from '../interfaces/mission.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMissions(filters: MissionFilters = {}): Observable<MissionsResponse> {
    let params = new HttpParams();
    
    if (filters.limit !== undefined) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters.offset !== undefined) {
      params = params.set('offset', filters.offset.toString());
    }
    if (filters.gametype) {
      params = params.set('gametype', filters.gametype);
    }
    if (filters.terrain) {
      params = params.set('terrain', filters.terrain);
    }
    if (filters.author) {
      params = params.set('author', filters.author);
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<MissionsResponse>(`${this.apiUrl}/missions`, { params });
  }

  searchMissions(searchTerm: string, limit: number = 20): Observable<MissionsResponse> {
    return this.getMissions({
      search: searchTerm,
      limit: limit,
      offset: 0
    });
  }

  getMissionsByGametype(gametype: string, limit: number = 50): Observable<MissionsResponse> {
    return this.getMissions({
      gametype: gametype,
      limit: limit,
      offset: 0
    });
  }

  getMissionsByTerrain(terrain: string, limit: number = 50): Observable<MissionsResponse> {
    return this.getMissions({
      terrain: terrain,
      limit: limit,
      offset: 0
    });
  }
}
