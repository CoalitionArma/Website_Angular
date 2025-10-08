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
import { CreateEventRequest, UpdateEventRequest, EventGroup, EventRole, Event } from '../../interfaces/event.interface';
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
  isEditMode = false;
  eventToEdit?: Event;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { editMode?: boolean; event?: Event }
  ) {
    // Check if we're in edit mode
    this.isEditMode = this.data?.editMode || false;
    this.eventToEdit = this.data?.event;
    
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
      sides: this.fb.array([])
    });

    // Add initial side with a group if not in edit mode
    if (!this.isEditMode) {
      this.addSide();
    }
  }
  
  ngOnInit(): void {
    // If in edit mode, populate the form with existing data
    if (this.isEditMode && this.eventToEdit) {
      this.populateFormWithEventData();
    }
  }

  private populateFormWithEventData(): void {
    if (!this.eventToEdit) return;

    // Set basic event data
    this.eventForm.patchValue({
      title: this.eventToEdit.title,
      description: this.eventToEdit.description || '',
      bannerUrl: this.eventToEdit.bannerUrl || '',
      dateTime: new Date(this.eventToEdit.dateTime),
      slotUnlockTime: this.eventToEdit.slotUnlockTime ? new Date(this.eventToEdit.slotUnlockTime) : null
    });

    // Clear existing sides array and populate with event data
    const sidesArray = this.sides;
    while (sidesArray.length !== 0) {
      sidesArray.removeAt(0);
    }

    // Add sides from the event
    this.eventToEdit.sides.forEach(side => {
      const sideForm = this.fb.group({
        id: [side.id],
        name: [side.name, Validators.required],
        color: [side.color || '#4a7c59'],
        groups: this.fb.array([])
      });

      // Add groups to this side
      const groupsArray = sideForm.get('groups') as FormArray;
      side.groups.forEach(group => {
        const groupForm = this.fb.group({
          id: [group.id],
          name: [group.name, Validators.required],
          roles: this.fb.array([])
        });

        // Add roles to this group
        const rolesArray = groupForm.get('roles') as FormArray;
        group.roles.forEach(role => {
          const roleForm = this.fb.group({
            id: [role.id],
            name: [role.name, Validators.required],
            slottedUser: [role.slottedUser],
            slottedUserId: [role.slottedUserId]
          });
          rolesArray.push(roleForm);
        });

        groupsArray.push(groupForm);
      });

      sidesArray.push(sideForm);
    });
  }

  get sides(): FormArray {
    return this.eventForm.get('sides') as FormArray;
  }

  getGroupsArray(sideIndex: number): FormArray {
    return this.sides.at(sideIndex).get('groups') as FormArray;
  }

  getRolesArray(sideIndex: number, groupIndex: number): FormArray {
    return this.getGroupsArray(sideIndex).at(groupIndex).get('roles') as FormArray;
  }

  addSide(): void {
    const sideForm = this.fb.group({
      id: [null], // Will be generated by backend if not provided
      name: ['', Validators.required],
      color: ['#4a7c59'], // Default coalition color
      groups: this.fb.array([])
    });

    this.sides.push(sideForm);
    
    // Add initial group to the new side
    this.addGroup(this.sides.length - 1);
  }

  removeSide(sideIndex: number): void {
    this.sides.removeAt(sideIndex);
  }

  addGroup(sideIndex: number): void {
    const groupForm = this.fb.group({
      id: [null], // Will be generated by backend if not provided
      name: ['', Validators.required],
      roles: this.fb.array([])
    });

    this.getGroupsArray(sideIndex).push(groupForm);
    
    // Add initial role to the new group
    this.addRole(sideIndex, this.getGroupsArray(sideIndex).length - 1);
  }

  removeGroup(sideIndex: number, groupIndex: number): void {
    this.getGroupsArray(sideIndex).removeAt(groupIndex);
  }

  addRole(sideIndex: number, groupIndex: number): void {
    const roleForm = this.fb.group({
      id: [null], // Will be generated by backend if not provided
      name: ['', Validators.required],
      slottedUser: [null],
      slottedUserId: [null]
    });
    
    const rolesArray = this.getRolesArray(sideIndex, groupIndex);
    rolesArray.push(roleForm);
  }

  removeRole(sideIndex: number, groupIndex: number, roleIndex: number): void {
    const rolesArray = this.getRolesArray(sideIndex, groupIndex);
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
      
      if (this.isEditMode) {
        // Transform the form data to match the UpdateEventRequest interface
        const eventData: UpdateEventRequest = {
          title: formValue.title,
          description: formValue.description,
          bannerUrl: formValue.bannerUrl || undefined,
          dateTime: formValue.dateTime,
          slotUnlockTime: slotUnlockDateTime,
          sides: formValue.sides.map((side: any) => ({
            id: side.id, // Keep existing ID
            name: side.name,
            color: side.color,
            groups: side.groups.map((group: any) => ({
              id: group.id, // Keep existing ID
              name: group.name,
              roles: group.roles.map((role: any) => ({
                id: role.id, // Keep existing ID
                name: role.name,
                slottedUser: role.slottedUser,
                slottedUserId: role.slottedUserId
              }))
            }))
          }))
        };

        this.dialogRef.close(eventData);
      } else {
        // Transform the form data to match the CreateEventRequest interface
        const eventData: CreateEventRequest = {
          title: formValue.title,
          description: formValue.description,
          bannerUrl: formValue.bannerUrl || undefined,
          dateTime: formValue.dateTime,
          slotUnlockTime: slotUnlockDateTime,
          sides: formValue.sides.map((side: any) => ({
            name: side.name,
            color: side.color,
            groups: side.groups.map((group: any) => ({
              name: group.name,
              roles: group.roles.map((role: any) => ({
                name: role.name
              }))
            }))
          }))
        };

        this.dialogRef.close(eventData);
      }
    }
  }
}
