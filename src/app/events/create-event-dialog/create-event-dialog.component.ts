import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CreateEventRequest, EventGroup, EventRole } from '../../interfaces/event.interface';
import { NativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-create-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: MAT_DATE_FORMATS, useValue: {
      parse: {
        dateInput: 'MM/DD/YYYY',
      },
      display: {
        dateInput: 'MM/DD/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      }
    }}
  ],
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.scss']
})
export class CreateEventDialogComponent implements OnInit {
  eventForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Configure dialog behavior
    this.dialogRef.disableClose = false;
    
    // Handle backdrop click to close the dialog
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(false);
    });
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      bannerUrl: [''],
      dateTime: ['', Validators.required],
      slotUnlockDate: [''], // Optional date for when slots become available
      slotUnlockTime: [''], // Optional time for when slots become available (HH:MM format)
      groups: this.fb.array([])
    });

    // Add initial group
    this.addGroup();
  }
  
  ngOnInit(): void {
    // This runs after the component is initialized
    // We could add any initialization logic here if needed
  }

  get groups(): FormArray {
    return this.eventForm.get('groups') as FormArray;
  }

  getRolesArray(groupIndex: number): FormArray {
    return this.groups.at(groupIndex).get('roles') as FormArray;
  }

  addGroup(): void {
    const groupForm = this.fb.group({
      name: ['', Validators.required],
      roles: this.fb.array([])
    });

    this.groups.push(groupForm);
    
    // Add initial role to the new group
    this.addRole(this.groups.length - 1);
  }

  removeGroup(groupIndex: number): void {
    this.groups.removeAt(groupIndex);
  }

  addRole(groupIndex: number): void {
    const rolesArray = this.getRolesArray(groupIndex);
    rolesArray.push(this.fb.control('', Validators.required));
  }

  removeRole(groupIndex: number, roleIndex: number): void {
    const rolesArray = this.getRolesArray(groupIndex);
    rolesArray.removeAt(roleIndex);
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.eventForm.value;
      
      // Combine slotUnlockDate and slotUnlockTime into a single DateTime
      let slotUnlockDateTime: Date | undefined = undefined;
      if (formValue.slotUnlockDate) {
        const date = new Date(formValue.slotUnlockDate);
        if (formValue.slotUnlockTime) {
          const [hours, minutes] = formValue.slotUnlockTime.split(':').map(Number);
          date.setHours(hours, minutes, 0, 0);
        } else {
          // If no time specified, default to midnight
          date.setHours(0, 0, 0, 0);
        }
        slotUnlockDateTime = date;
      }
      
      // Transform the form data to match the CreateEventRequest interface
      const eventData: CreateEventRequest = {
        title: formValue.title,
        description: formValue.description,
        bannerUrl: formValue.bannerUrl || undefined,
        dateTime: formValue.dateTime,
        slotUnlockTime: slotUnlockDateTime,
        groups: formValue.groups.map((group: any) => ({
          name: group.name,
          roles: group.roles.map((roleName: string) => ({
            name: roleName
          }))
        }))
      };

      this.dialogRef.close(eventData);
    }
  }
}
