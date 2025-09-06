import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Mission } from '../../interfaces/mission.interface';
import { MissionStatsDialogComponent } from './mission-stats-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MissionStatsService {

  constructor(private dialog: MatDialog) { }

  /**
   * Opens the mission statistics dialog for a specific mission
   * @param mission Mission object containing data including jsondata
   * @returns DialogRef to the opened dialog
   */
  openMissionStatsDialog(mission: Mission): MatDialogRef<MissionStatsDialogComponent> {
    return this.dialog.open(MissionStatsDialogComponent, {
      width: '960px',
      maxWidth: '90vw',
      height: '80vh',
      data: { mission },
      disableClose: false,
      autoFocus: false,
      panelClass: 'mission-stats-dialog-panel',
      backdropClass: 'mission-stats-backdrop',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms'
    });
  }
}
