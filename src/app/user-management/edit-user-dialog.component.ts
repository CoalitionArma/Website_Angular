import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { UserService } from '../services/user.service';
import { DBUser } from '../interfaces/user.interface';

export interface EditUserDialogData {
  user: DBUser;
}

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatOptionModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent implements OnInit {
  editForm: FormGroup;
  loading = false;
  saving = false;
  communitiesList: any[] = [];
  errorMessage = '';
  private originalValues: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditUserDialogData
  ) {
    this.editForm = this.fb.group({
      callsign: [data.user.callsign || '', [Validators.maxLength(100)]],
      section: [data.user.section || 'non-member'],
      veterancy: [data.user.veterancy || 'Non-member'],
      communityId: [data.user.communityId || null],
      isAdmin: [data.user.isAdmin || false]
    });

    // Store original values for change detection
    this.originalValues = this.editForm.value;
  }

  ngOnInit(): void {
    this.loadCommunities();
    
    // Clear error message when form changes
    this.editForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  private loadCommunities(): void {
    this.loading = true;
    this.userService.getCommunitiesList().subscribe({
      next: (response: any) => {
        this.communitiesList = response.communities || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Failed to load communities:', error);
        this.communitiesList = [];
        this.loading = false;
      }
    });
  }

  hasChanges(): boolean {
    const currentValues = this.editForm.value;
    return JSON.stringify(currentValues) !== JSON.stringify(this.originalValues);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.editForm.valid && this.hasChanges()) {
      this.saving = true;
      this.errorMessage = '';
      
      const updateData = {
        discordid: this.data.user.discordid,
        ...this.editForm.value
      };

      console.log('Saving user data:', updateData);

      this.userService.updateUserProperties(updateData).subscribe({
        next: (response: any) => {
          console.log('User updated successfully:', response);
          this.saving = false;
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Failed to update user:', error);
          this.saving = false;
          
          // Extract error message
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Failed to update user. Please try again.';
          }
        }
      });
    }
  }
}