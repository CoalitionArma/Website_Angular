import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map, mergeMap, catchError, delay } from 'rxjs/operators';
import * as StatsActions from './stats.actions';
import { UserStatsResponse } from '../interfaces/user-stats.interface';
import { MissionStatistics, MissionSession } from '../interfaces/mission.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class StatsEffects {
  
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  loadUserStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatsActions.loadUserStats),
      mergeMap(({ userId }) => {
        const token = localStorage.getItem('jwt_token');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'access_token': token || ''
        });

        const url = `${environment.apiUrl}/user/stats/${userId}`;

        return this.http.get<UserStatsResponse>(url, { headers }).pipe(
          map((response) => {
            return StatsActions.loadUserStatsSuccess({ 
              stats: response.stats, 
              ranking: response.ranking 
            });
          }),
          catchError((error) => {
            const errorMessage = error.error?.error || error.message || 'Failed to load user statistics';
            return of(StatsActions.loadUserStatsFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  loadMissionStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatsActions.loadMissionStats),
      mergeMap(({ mission }) => {
        // Use a small delay to ensure UI updates before processing
        return of(mission).pipe(
          delay(50),
          mergeMap(() => {
            try {
              console.log('Processing mission stats for:', mission.name);
              
              // Quick size check to prevent freezing
              if (mission.jsondata) {
                let dataSize = 0;
                let hasLargeDataset = false;
                
                if (typeof mission.jsondata === 'string') {
                  dataSize = mission.jsondata.length;
                  hasLargeDataset = dataSize > 50000; // 50KB string limit
                } else if (Array.isArray(mission.jsondata)) {
                  // Count total kills across sessions
                  (mission.jsondata as any[]).forEach((session: any) => {
                    if (session?.kills?.length) {
                      dataSize += session.kills.length;
                    }
                  });
                  hasLargeDataset = dataSize > 500; // 500 kills limit
                } else if (typeof mission.jsondata === 'object') {
                  // Check if it's a large object by key count
                  const keyCount = Object.keys(mission.jsondata).length;
                  hasLargeDataset = keyCount > 100; // 100 keys limit
                  dataSize = keyCount;
                }
                
                console.log('Mission data size:', dataSize, 'hasLargeDataset:', hasLargeDataset);
                
                // If data is too large, process minimal summary only
                if (hasLargeDataset) {
                  console.log('Large dataset detected, processing minimal summary only');
                  const minimalStats = this.createMinimalStats(mission.jsondata, dataSize);
                  
                  return of(StatsActions.loadMissionStatsSuccess({
                    missionId: mission.id,
                    stats: minimalStats,
                    rawData: this.createSampleData(mission.jsondata) // Provide sample data only
                  }));
                }
              }              let processedStats: MissionStatistics;
              let rawData = mission.jsondata;
              
              if (mission.jsondata) {
                if (typeof mission.jsondata === 'string') {
                  try {
                    rawData = JSON.parse(mission.jsondata);
                  } catch (parseError) {
                    console.error('Error parsing jsondata:', parseError);
                    return of(StatsActions.loadMissionStatsFailure({
                      missionId: mission.id,
                      error: 'Invalid JSON format'
                    }));
                  }
                }
                
                processedStats = this.parseMissionStatistics(rawData);
                
                return of(StatsActions.loadMissionStatsSuccess({
                  missionId: mission.id,
                  stats: processedStats,
                  rawData: this.limitRawData(rawData) // Limit raw data size
                }));
                
              } else if (mission.jsonlink) {
                // Handle external link fetching
                return this.fetchMissionStatsFromLink(mission.id, mission.jsonlink);
              } else {
                // No data available
                processedStats = {
                  events: [],
                  summary: {
                    totalEvents: 0,
                    totalKills: 0,
                    playerCount: 0,
                    outcome: 'No statistics data available'
                  }
                };
                
                return of(StatsActions.loadMissionStatsSuccess({
                  missionId: mission.id,
                  stats: processedStats,
                  rawData: null
                }));
              }
              
            } catch (error: any) {
              console.error('Error processing mission stats:', error);
              return of(StatsActions.loadMissionStatsFailure({
                missionId: mission.id,
                error: error.message || 'Failed to process mission statistics'
              }));
            }
          })
        );
      })
    )
  );

  private fetchMissionStatsFromLink(missionId: number, jsonlink: string) {
    const proxyUrl = `/api/mission-stats/${missionId}`;
    
    return this.http.get(proxyUrl).pipe(
      map((response: any) => {
        if (response.success) {
          const processedStats = this.parseMissionStatistics(response.data);
          return StatsActions.loadMissionStatsSuccess({
            missionId,
            stats: processedStats,
            rawData: response.data
          });
        } else {
          return StatsActions.loadMissionStatsFailure({
            missionId,
            error: response.error || 'Failed to fetch mission statistics'
          });
        }
      }),
      catchError((error) => {
        const errorMessage = error.error?.error || error.message || 'Failed to fetch mission statistics';
        return of(StatsActions.loadMissionStatsFailure({
          missionId,
          error: errorMessage
        }));
      })
    );
  }

  private parseMissionStatistics(data: any): MissionStatistics {
    console.log('Parsing mission statistics in effect');
    
    let totalKills = 0;
    let playerCount = 0;
    let outcome = 'No data';
    let duration: string | undefined;

    try {
      // Check for new single-session format with mission, date, faction counts, and kills array
      if (data && typeof data === 'object' && data.kills && Array.isArray(data.kills)) {
        console.log('Processing new single-session format');
        
        totalKills = data.kills.length;
        
        // Calculate player count from faction counts
        const factionCounts = {
          blufor: data.BLUFOR || 0,
          opfor: data.OPFOR || 0, 
          indfor: data.INDFOR || 0,
          civ: data.CIV || 0
        };
        playerCount = factionCounts.blufor + factionCounts.opfor + factionCounts.indfor + factionCounts.civ;
        
        // Calculate duration from first to last kill
        if (data.kills.length > 0) {
          const firstKill = data.kills[0]?.time;
          const lastKill = data.kills[data.kills.length - 1]?.time;
          
          if (firstKill && lastKill && firstKill !== lastKill) {
            duration = `${firstKill} - ${lastKill}`;
          }
        }
        
        outcome = `${totalKills} kills | ${playerCount} players | Mission: ${data.mission || 'Unknown'}`;
        
      } else if (Array.isArray(data) && data.length > 0) {
        console.log('Processing legacy array format with', data.length, 'sessions');
        
        // Count kills efficiently
        data.forEach(session => {
          if (session?.kills?.length) {
            totalKills += session.kills.length;
          }
        });
        
        // Sample player count from first session
        const firstSession = data[0];
        if (firstSession?.kills?.length) {
          const sampleKills = firstSession.kills.slice(0, 20);
          const players = new Set();
          
          sampleKills.forEach((kill: any) => {
            if (kill?.killer && kill.killer !== 'AI') players.add(kill.killer);
            if (kill?.victim && kill.victim !== 'AI') players.add(kill.victim);
          });
          
          playerCount = players.size;
        }
        
        // Calculate duration from first to last kill
        if (data.length > 0 && data[0]?.kills?.length > 0) {
          const firstKill = data[0].kills[0]?.time;
          const lastSession = data[data.length - 1];
          const lastKill = lastSession?.kills?.[lastSession.kills.length - 1]?.time;
          
          if (firstKill && lastKill && firstKill !== lastKill) {
            duration = `${firstKill} - ${lastKill}`;
          }
        }
        
        outcome = `${totalKills} total kills across ${data.length} session(s)`;
        
      } else {
        // Legacy format
        const events = data.events || data.timeline || data.log || [];
        totalKills = events.length;
        playerCount = this.extractPlayerCount(data);
        duration = this.extractDuration(data);
        outcome = this.extractOutcome(data) || 'Legacy data format';
      }
      
    } catch (error) {
      console.error('Error in parseMissionStatistics:', error);
      totalKills = 0;
      playerCount = 0;
      outcome = 'Error parsing data';
    }

    const summary = {
      totalEvents: 0, // Will be populated by dialog component when needed
      totalKills: totalKills,
      playerCount: playerCount,
      duration: duration,
      outcome: outcome
    };

    return {
      events: [], // Empty for performance, dialog will process detailed events
      sessions: Array.isArray(data) ? data : [data], // Wrap single session in array for consistency
      summary
    };
  }

  private extractPlayerCount(data: any): number {
    if (data.players) return Array.isArray(data.players) ? data.players.length : data.players;
    if (data.playerCount) return data.playerCount;
    if (data.summary?.playerCount) return data.summary.playerCount;
    return 0;
  }

  private extractDuration(data: any): string | undefined {
    if (data.duration) return data.duration;
    if (data.missionTime) return data.missionTime;
    if (data.summary?.duration) return data.summary.duration;
    return undefined;
  }

  private extractOutcome(data: any): string | undefined {
    if (data.outcome) return data.outcome;
    if (data.result) return data.result;
    if (data.summary?.outcome) return data.summary.outcome;
    return undefined;
  }

  private createMinimalStats(jsondata: any, dataSize: number): MissionStatistics {
    console.log('Creating minimal stats for large dataset of size:', dataSize);
    
    return {
      events: [],
      sessions: Array.isArray(jsondata) ? jsondata : undefined,
      summary: {
        totalEvents: 0,
        totalKills: dataSize,
        playerCount: 0,
        duration: undefined,
        outcome: `Large dataset with ${dataSize} events (limited view)`
      }
    };
  }

  private createSampleData(jsondata: any): any {
    // Return a small sample of the data for UI display
    if (Array.isArray(jsondata)) {
      // Take first session and first 10 kills only
      const firstSession = jsondata[0];
      if (firstSession?.kills?.length) {
        return [{
          ...firstSession,
          kills: firstSession.kills.slice(0, 10)
        }];
      }
      return [];
    } else if (jsondata?.kills?.length) {
      // Single session format
      return {
        ...jsondata,
        kills: jsondata.kills.slice(0, 10)
      };
    }
    return null;
  }

  private limitRawData(rawData: any): any {
    if (!rawData) return null;
    
    if (Array.isArray(rawData)) {
      // Limit to first 2 sessions and first 10 kills per session
      return rawData.slice(0, 2).map(session => {
        if (session?.kills?.length) {
          return {
            ...session,
            kills: session.kills.slice(0, 10)
          };
        }
        return session;
      });
    }
    
    return rawData;
  }
}
