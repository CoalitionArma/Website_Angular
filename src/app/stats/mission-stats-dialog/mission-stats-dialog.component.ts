import { Component, Inject, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Mission, MissionStatistics, KillEvent } from '../../interfaces/mission.interface';
import * as StatsActions from '../../store/stats.actions';
import { MissionStatsEntry } from '../../store/stats.reducer';
import { selectMissionStatsById } from '../../store/stats.selectors';

@Component({
  selector: 'app-mission-stats-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSortModule
  ],
  templateUrl: './mission-stats-dialog.component.html',
  styleUrls: ['./mission-stats-dialog.component.scss']
})
export class MissionStatsDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  mission: Mission;
  missionStats$: Observable<MissionStatsEntry | undefined>;
  loading = true;
  error: string | null = null;
  rawData: any = null;
  processedStats: MissionStatistics | null = null;
  
  // Data view options
  showRawData = false;
  selectedTab = 'summary';
  chartOptions: any = {};
  
  // Mission kills data
  allKills: (KillEvent & { killerSide?: string; victimSide?: string; killerSideClass?: string; victimSideClass?: string; distance?: string })[] = [];
  killsDataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatSort) sort!: MatSort;
  
  // Kill statistics for summary tab
  killStats: {
    bestKdr?: { player: string, value: string };
    longestKill?: { player: string, distance: string };
    mostUsedWeapon?: { name: string, count: number };
    totalDistance?: number;
    avgDistance?: number;
    playerKills?: number;
  } = {};
  killsDisplayColumns: string[] = ['time', 'killer', 'victim', 'weapon', 'distance'];
  columnWidths = {
    time: '15%',
    killer: '25%',
    victim: '25%',
    weapon: '25%',
    distance: '10%'
  };
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<MissionStatsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission },
    private store: Store
  ) {
    this.mission = data.mission;
    this.missionStats$ = this.store.select(selectMissionStatsById(this.mission.id));
  }

  ngOnInit(): void {
    // Dispatch action to load mission stats
    this.store.dispatch(StatsActions.loadMissionStats({ mission: this.mission }));
    
    // Subscribe to mission stats
    this.subscriptions.add(
      this.missionStats$.subscribe(stats => {
        this.loading = stats?.loading || false;
        this.error = stats?.error || null;
        this.rawData = stats?.rawData;
        this.processedStats = stats?.stats || null;
        
        if (stats && !stats.loading && stats.stats) {
          this.setupChartData(stats.stats);
          this.extractAllKills(stats.stats);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    // Set up the sort functionality after the view is initialized
    if (this.killsDataSource) {
      this.killsDataSource.sort = this.sort;
      
      // Configure custom sort comparators for proper sorting of numeric distances
      this.killsDataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'distance': {
            // Extract numeric value from distance string (e.g., "100 m" => 100)
            if (!item.distance || item.distance === 'Unknown') return 0;
            const distStr = item.distance || '';
            const numMatch = distStr.match(/(\d+)/);
            return numMatch ? parseFloat(numMatch[1]) : 0;
          }
          case 'time': {
            return item.time || '';
          }
          default: {
            return item[property] || '';
          }
        }
      };
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private setupChartData(stats: MissionStatistics): void {
    // Set up chart data based on available stats
    // This would depend on what kind of charts you want to show
    
    // Check for the new format with sessions containing kills data
    if (stats.sessions && stats.sessions.length > 0) {
      const allKills: KillEvent[] = [];
      
      // Collect all kills from all sessions
      stats.sessions.forEach(session => {
        if (session.kills && Array.isArray(session.kills)) {
          allKills.push(...session.kills);
        }
      });
      
      if (allKills.length > 0) {
        // Create weapon type distribution chart
        const weaponTypes = new Map<string, number>();
        
        allKills.forEach(kill => {
          const weapon = kill.weapon || 'Unknown';
          const count = weaponTypes.get(weapon) || 0;
          weaponTypes.set(weapon, count + 1);
        });
        
        // Create faction vs faction chart data
        const factionKills = new Map<string, number>();
        
        allKills.forEach(kill => {
          const killerFaction = kill.killerFaction || 'Unknown';
          const victimFaction = kill.victimFaction || 'Unknown';
          const key = `${killerFaction} vs ${victimFaction}`;
          const count = factionKills.get(key) || 0;
          factionKills.set(key, count + 1);
        });
        
        this.chartOptions = {
          series: [{
            name: 'Weapon Usage',
            data: Array.from(weaponTypes.values())
          }],
          labels: Array.from(weaponTypes.keys()),
          // Add more chart options as needed
        };
      }
    } else if (stats.events && stats.events.length > 0) {
      // Fallback for legacy format with events array
      const eventTypes = new Map<string, number>();
      
      stats.events.forEach(event => {
        const count = eventTypes.get(event.type) || 0;
        eventTypes.set(event.type, count + 1);
      });
      
      this.chartOptions = {
        series: [{
          data: Array.from(eventTypes.values())
        }],
        labels: Array.from(eventTypes.keys()),
        // Add more chart options as needed
      };
    }
  }
  
  toggleRawData(): void {
    this.showRawData = !this.showRawData;
  }
  
  formatJson(json: any): string {
    return json ? JSON.stringify(json, null, 2) : 'No data';
  }
  
  selectTab(tab: string): void {
    this.selectedTab = tab;
    
    // If switching to the kills tab, ensure sort is applied
    if (tab === 'kills' && this.killsDataSource && this.sort) {
      setTimeout(() => {
        this.killsDataSource.sort = this.sort;
      });
    }
  }
  
  /**
   * Handle tab change events from the mat-tab-group
   */
  onTabChange(event: any): void {
    // If switching to the kills tab, ensure sort is applied
    if (event.index === 1 && this.killsDataSource && this.sort) { // Index 1 should be the Kills tab
      setTimeout(() => {
        this.killsDataSource.sort = this.sort;
      });
    }
  }
  
  /**
   * Formats a distance value (from either distance or range property) for display
   */
  formatDistance(kill: any): string {
    if (kill.distance) {
      const distanceNum = typeof kill.distance === 'number' ? kill.distance : parseFloat(kill.distance);
      if (!isNaN(distanceNum)) {
        return `${Math.round(distanceNum)} m`;
      }
    } else if (kill.range) {
      const rangeNum = typeof kill.range === 'number' ? kill.range : parseFloat(kill.range);
      if (!isNaN(rangeNum)) {
        return `${Math.round(rangeNum)} m`;
      }
    }
    return 'Unknown';
  }
  
  /**
   * Parses side counts from various formats into a structured object
   */
  parseSideCounts(sidecounts: string): { blufor: number, opfor: number, independent: number, civilian: number } {
    let parts: number[] = [];
    
    if (!sidecounts) {
      return { blufor: 0, opfor: 0, independent: 0, civilian: 0 };
    }
    
    // Handle JSON array format like "[27,40,0,0]"
    if (sidecounts.trim().startsWith('[') && sidecounts.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(sidecounts.trim());
        if (Array.isArray(parsed)) {
          parts = parsed.map(n => parseInt(n) || 0);
        }
      } catch (error) {
        // Fall back to manual parsing without brackets
        const cleaned = sidecounts.replace(/[\[\]]/g, '');
        parts = cleaned.split(',').map(s => parseInt(s.trim()) || 0);
      }
    }
    // Try comma-separated format
    else if (sidecounts.includes(',')) {
      parts = sidecounts.split(',').map(s => parseInt(s.trim()) || 0);
    } 
    // Try space-separated format
    else if (sidecounts.includes(' ')) {
      parts = sidecounts.split(/\s+/).map(s => parseInt(s.trim()) || 0);
    }
    // Single number or unknown format
    else {
      const num = parseInt(sidecounts);
      if (!isNaN(num)) {
        parts = [num];
      }
    }
    
    // Ensure we have at least 4 values
    while (parts.length < 4) {
      parts.push(0);
    }
    
    // Return structured object
    return {
      blufor: parts[0] || 0,
      opfor: parts[1] || 0,
      independent: parts[2] || 0,
      civilian: parts[3] || 0
    };
  }
  
  /**
   * Formats side counts for display
   */
  formatSideCounts(sidecounts: string): string {
    const parsed = this.parseSideCounts(sidecounts);
    
    // Create array of side labels with counts
    const sides = [];
    if (parsed.blufor > 0) sides.push(`BLUFOR: ${parsed.blufor}`);
    if (parsed.opfor > 0) sides.push(`OPFOR: ${parsed.opfor}`);
    if (parsed.independent > 0) sides.push(`INDFOR: ${parsed.independent}`);
    if (parsed.civilian > 0) sides.push(`CIV: ${parsed.civilian}`);
    
    return sides.length > 0 ? sides.join(' | ') : 'N/A';
  }
  
  /**
   * Formats the duration string to show only the second number
   */
  formatDuration(duration: string): string {
    if (!duration) return 'Unknown';
    
    // If duration is in the format "X-Y", extract Y
    if (duration.includes('-')) {
      const parts = duration.split('-');
      if (parts.length > 1) {
        return parts[1].trim();
      }
    }
    
    return duration;
  }
  
  /**
   * Calculates additional kill statistics from the allKills array
   */
  calculateKillStatistics(): void {
    if (!this.allKills || this.allKills.length === 0) {
      this.killStats = {};
      return;
    }
    
    // Weapons usage count
    const weaponsCount: Record<string, number> = {};
    // Players kill/death tracking
    const playerKills: Record<string, number> = {};
    const playerDeaths: Record<string, number> = {};
    // Distance tracking
    let totalDistance = 0;
    let validDistanceCount = 0;
    let longestKill = { distance: 0, player: '', victim: '' };
    // Counter for kills against actual players (not AI)
    let playerKillsCount = 0;
    
    this.allKills.forEach(kill => {
      // Track weapon usage
      if (kill.weapon) {
        weaponsCount[kill.weapon] = (weaponsCount[kill.weapon] || 0) + 1;
      }
      
      // Track player kills and deaths (ignoring AI)
      if (kill.killer && kill.killer !== 'AI') {
        playerKills[kill.killer] = (playerKills[kill.killer] || 0) + 1;
      }
      
      if (kill.victim && kill.victim !== 'AI') {
        playerDeaths[kill.victim] = (playerDeaths[kill.victim] || 0) + 1;
        // Count player kills (where victim is a player)
        playerKillsCount++;
      }
      
      // Track kill distances
      let distanceValue = 0;
      if (kill.distance) {
        if (typeof kill.distance === 'number') {
          distanceValue = kill.distance;
        } else if (typeof kill.distance === 'string' && kill.distance.includes(' m')) {
          distanceValue = parseInt(kill.distance);
        } else {
          distanceValue = parseFloat(kill.distance);
        }
      }
      
      if (!isNaN(distanceValue) && distanceValue > 0) {
        totalDistance += distanceValue;
        validDistanceCount++;
        
        // Check for longest kill
        if (distanceValue > longestKill.distance && kill.killer && kill.killer !== 'AI') {
          longestKill = {
            distance: distanceValue,
            player: kill.killer,
            victim: kill.victim || 'Unknown'
          };
        }
      }
    });
    
    // Calculate K/D ratios for players
    const kdRatios: Array<{player: string, value: number}> = [];
    Object.keys(playerKills).forEach(player => {
      const kills = playerKills[player] || 0;
      const deaths = playerDeaths[player] || 0;
      const kdr = deaths === 0 ? kills : (kills / deaths);
      
      if (kills > 0) { // Only consider players with at least 1 kill
        kdRatios.push({
          player,
          value: kdr
        });
      }
    });
    
    // Find most used weapon
    let mostUsedWeapon = { name: '', count: 0 };
    Object.entries(weaponsCount).forEach(([weapon, count]) => {
      if (count > mostUsedWeapon.count) {
        mostUsedWeapon = { name: weapon, count };
      }
    });
    
    // Calculate average distance
    const avgDistance = validDistanceCount > 0 ? 
      Math.round(totalDistance / validDistanceCount) : 0;
    
    // Find player with best K/D ratio
    let bestKdr = kdRatios.length > 0 ? 
      kdRatios.sort((a, b) => b.value - a.value)[0] : null;
    
    // Update killStats object
    this.killStats = {
      bestKdr: bestKdr ? {
        player: bestKdr.player,
        value: bestKdr.value.toFixed(2)
      } : undefined,
      longestKill: longestKill.distance > 0 ? {
        player: longestKill.player,
        distance: `${Math.round(longestKill.distance)} m`
      } : undefined,
      mostUsedWeapon: mostUsedWeapon.count > 0 ? mostUsedWeapon : undefined,
      totalDistance: totalDistance > 0 ? Math.round(totalDistance) : undefined,
      avgDistance: avgDistance > 0 ? avgDistance : undefined,
      playerKills: playerKillsCount > 0 ? playerKillsCount : undefined
    };
  }
  
  /**
   * Determine the side of a player or AI
   * @param name Player or AI name
   * @param sideInfo Optional explicit side information if available
   * @returns Object with side and CSS class
   */
  determineSide(name: string, sideInfo?: string): { side: string, cssClass: string } {
    // Default values
    let side = 'unknown';
    let cssClass = 'side-unknown';
    
    // If explicit side information is provided
    if (sideInfo) {
      console.log('Side info provided:', sideInfo);
      const lowerSideInfo = sideInfo.toLowerCase();
      
      // Direct match for exact faction names
      if (lowerSideInfo === 'blufor' || lowerSideInfo === 'west') {
        side = 'BLUFOR';
        cssClass = 'side-blufor';
      } else if (lowerSideInfo === 'opfor' || lowerSideInfo === 'east') {
        side = 'OPFOR';
        cssClass = 'side-opfor';
      } else if (lowerSideInfo === 'indfor' || lowerSideInfo === 'independent' || lowerSideInfo === 'guer' || lowerSideInfo === 'resistance') {
        side = 'INDFOR';
        cssClass = 'side-indfor';
      } else if (lowerSideInfo === 'civ' || lowerSideInfo === 'civilian') {
        side = 'CIV';
        cssClass = 'side-civilian';
      }
      // Partial match for strings that contain faction names
      else if (lowerSideInfo.includes('blufor') || lowerSideInfo.includes('west')) {
        side = 'BLUFOR';
        cssClass = 'side-blufor';
      } else if (lowerSideInfo.includes('opfor') || lowerSideInfo.includes('east')) {
        side = 'OPFOR';
        cssClass = 'side-opfor';
      } else if (lowerSideInfo.includes('indep') || lowerSideInfo.includes('guer') || lowerSideInfo.includes('resist')) {
        side = 'INDFOR';
        cssClass = 'side-indfor';
      } else if (lowerSideInfo.includes('civ')) {
        side = 'CIV';
        cssClass = 'side-civilian';
      }
      
      if (side !== 'unknown') {
        console.log(`Determined side from sideInfo: ${side}`);
        return { side, cssClass };
      }
    }
    
    // If we didn't get a valid side from sideInfo, try to determine from name prefixes or suffixes
    const lowerName = name.toLowerCase();
    
    // Check for common faction indicators in the name
    if (lowerName.includes('blu') || lowerName.includes('west') || lowerName.includes('nato')) {
      side = 'BLUFOR';
      cssClass = 'side-blufor';
    } else if (lowerName.includes('op') || lowerName.includes('east') || lowerName.includes('csat')) {
      side = 'OPFOR';
      cssClass = 'side-opfor';
    } else if (lowerName.includes('ind') || lowerName.includes('guer') || lowerName.includes('aaf')) {
      side = 'INDFOR';
      cssClass = 'side-indfor';
    } else if (lowerName.includes('civ')) {
      side = 'CIV';
      cssClass = 'side-civilian';
    }
    
    console.log(`Determined side for ${name}: ${side}`);
    return { side, cssClass };
  }

  /**
   * Extracts all kills from the mission statistics
   */
  private extractAllKills(stats: MissionStatistics): void {
    this.allKills = [];
    
    console.log('Extracting kills from mission stats:', stats);
    
    if (stats.sessions && stats.sessions.length > 0) {
      console.log('Found session data:', stats.sessions.length);
      
      // Extract kills from mission data (using the first session)
      const session = stats.sessions[0]; // Use the first session since each mission is one session
      
      if (session.kills && Array.isArray(session.kills)) {
        console.log(`Mission has ${session.kills.length} kills`);
        
        // Process kill data with distance information
        const processedKills = session.kills.map((kill: any) => {
          // Debug: Log each kill to see what we're dealing with
          console.log('Processing kill:', kill);
          
          // Process the kill to ensure we have distance data and side information
          // Check for different property names that might contain faction/side info
          const killerSideInfo = kill.killerFaction || kill.killerSide || '';
          const victimSideInfo = kill.victimFaction || kill.victimSide || '';
          
          console.log(`Kill: ${kill.killer} (${killerSideInfo}) -> ${kill.victim} (${victimSideInfo})`);
          
          const killerSide = this.determineSide(kill.killer || '', killerSideInfo);
          const victimSide = this.determineSide(kill.victim || '', victimSideInfo);
          
          console.log(`Processed: ${killerSide.side} (${killerSide.cssClass}) -> ${victimSide.side} (${victimSide.cssClass})`);
          
          const processedKill = {
            ...kill,
            distance: this.formatDistance(kill),
            killerSide: killerSide.side,
            killerSideClass: killerSide.cssClass,
            victimSide: victimSide.side,
            victimSideClass: victimSide.cssClass
          };
          return processedKill;
        });
        
        this.allKills.push(...processedKills);
      }
      
      // For backward compatibility, check if there are multiple sessions and add those kills too
      if (stats.sessions.length > 1) {
        for (let i = 1; i < stats.sessions.length; i++) {
          const additionalSession = stats.sessions[i];
          if (additionalSession.kills && Array.isArray(additionalSession.kills)) {
            const processedKills = additionalSession.kills.map((kill: any) => {
              // Process the kill to ensure we have distance data and side information
              // Check for different property names that might contain faction/side info
              const killerSideInfo = kill.killerFaction || kill.killerSide || '';
              const victimSideInfo = kill.victimFaction || kill.victimSide || '';
              
              const killerSide = this.determineSide(kill.killer || '', killerSideInfo);
              const victimSide = this.determineSide(kill.victim || '', victimSideInfo);
              
              return {
                ...kill,
                distance: this.formatDistance(kill),
                killerSide: killerSide.side,
                killerSideClass: killerSide.cssClass,
                victimSide: victimSide.side,
                victimSideClass: victimSide.cssClass
              };
            });
            this.allKills.push(...processedKills);
          }
        }
      }
      
      console.log('Total kills extracted:', this.allKills.length);
      
      // Sort kills by time if available
      this.allKills.sort((a: any, b: any) => {
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return 0;
      });
      
      // Create a MatTableDataSource with the processed kills
      this.killsDataSource = new MatTableDataSource(this.allKills);
      
      // Apply sorting if view is initialized
      setTimeout(() => {
        if (this.sort) {
          this.killsDataSource.sort = this.sort;
          console.log('Sort applied to kills table');
        } else {
          console.log('Sort directive not yet available');
        }
      });
      
      // Calculate additional kill statistics for the summary tab
      this.calculateKillStatistics();
    } else {
      console.log('No sessions found or sessions array is empty');
      this.killStats = {};
      this.killsDataSource = new MatTableDataSource<any>([]);
    }
  }
}
