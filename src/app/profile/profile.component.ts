import { AfterContentInit, Component, Inject, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule, MatCardModule, MatInputModule, ReactiveFormsModule, MatSnackBarModule, MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  constructor(public userService: UserService) {}
  
  email: string = this.userService.user?.email || '';
  armaID: string = this.userService.user?.id || '';

  emailFormControl = new FormControl(this.userService.user?.email || this.email, [Validators.required, Validators.email]);
  emailMatcher = new MyErrorStateMatcher();

  armaIDRegex = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
  armaIDFormControl = new FormControl(this.userService.user?.id || this.armaID,  [Validators.required, Validators.pattern(this.armaIDRegex)]);
  armaIDMatcher = new MyErrorStateMatcher();

  // private _snackBar = inject(MatSnackBar);
  // openSnackBar() {
  //   this._snackBar.openFromComponent(DataChangedComponent, {
  //     data: {
  //       save: this.saveChanges,
  //       discard: this.discardChanges
  //     }
  //   });
  // }

  saveChanges() {
    this.saveFailed = false
    this.saved = false
    if (this.emailFormControl.valid && this.armaIDFormControl.valid) {
      this.email = (this.emailFormControl.value as string)
      this.armaID = (this.armaIDFormControl.value as string)
      this.saved = true
      new Promise(r => setTimeout(r, 4000)).then(() => this.saved = false)
    } else {
      this.saveFailed = true
      this.saveFailedReason = "Invalid Inputs"
    }
  }

  saveFailed = false
  saveFailedReason = ""

  saved = false

  discardChanges() {
    this.emailFormControl.setValue(this.email)
    this.armaIDFormControl.setValue(this.armaID)
  }

  updateEmail() {
    this.userService.updateEmail(this.email).subscribe(
      (response) => {
        console.log('Email updated:', response);
      },
      (error) => {
        console.error('Error updating email:', error);
      }
    );
  }

  ngOnInit(): void {
    // this.emailFormControl.valueChanges.subscribe(value => {
    //   if ((value as string) != this.armaID || value != this.email) {
    //     if (!this._snackBar._openedSnackBarRef) {
    //       this.openSnackBar()
    //     }
    //   } else {
    //     this._snackBar.dismiss()
    //   }
    // })

    // this.armaIDFormControl.valueChanges.subscribe(value => {
    //   if ((value as string) != this.armaID || value != this.email) {
    //     if (!this._snackBar._openedSnackBarRef) {
    //       this.openSnackBar()
    //     }
    //   } else {
    //     this._snackBar.dismiss()
    //   }
    // })
  }
}

@Component({
  selector: 'data-changed-component-snack',
  standalone: true,
  templateUrl: 'data-changed-component-snack.html',
  styles: `
    :host {
      display: flex;
    }

    .example-pizza-party {
      color: hotpink;
    }
  `,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
})
export class DataChangedComponent {
  snackBarRef = inject(MatSnackBarRef);

  discardChanges() { 
    this.snackBarRef.dismiss()
  }
  
  saveChanges() {
    this.snackBarRef.dismissWithAction()
  }
}
