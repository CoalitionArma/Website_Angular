import { AfterContentInit, Component, Inject, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    FormsModule, MatCardModule, MatInputModule, ReactiveFormsModule, MatSnackBarModule, MatButtonModule, CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  constructor(public userService: UserService, private fb: FormBuilder, private router: Router) {}

  armaGUIDRegex = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
  steamid64Regex = /^[0-9]{17}$/;
  userInfoForm = this.fb.group({
    email: [this.userService.dbUser?.email, Validators.required],
    armaID: [this.userService.dbUser?.armaguid, [
      Validators.required,
      Validators.pattern(this.armaGUIDRegex)
    ]],
    steamID: [this.userService.dbUser?.steamid, Validators.pattern(this.steamid64Regex)],
  });

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
    if (this.userInfoForm.valid && (this.userInfoForm.dirty || this.userInfoForm.touched)) { 
      // Update the user object with the new values
      this.userService.updateLocalUser(this.userInfoForm);
      // Call the service to update the user
      this.userService.updateUserInfo().subscribe()
      this.saved = true
      window.location.reload()
    } else {
      this.saveFailed = true
      this.saveFailedReason = "Invalid Inputs"
    }
  }

  saveFailed = false
  saveFailedReason = ""

  saved = false

  discardChanges() {
    this.userInfoForm.reset()
  }

  ngOnInit(): void {
    //console.log(this.userService.dbUser)
  }
}

// @Component({
//   selector: 'data-changed-component-snack',
//   standalone: true,
//   templateUrl: 'data-changed-component-snack.html',
//   styles: `
//     :host {
//       display: flex;
//     }

//     .example-pizza-party {
//       color: hotpink;
//     }
//   `,
//   imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
// })
// export class DataChangedComponent {
//   snackBarRef = inject(MatSnackBarRef);

//   discardChanges() { 
//     this.snackBarRef.dismiss()
//   }
  
//   saveChanges() {
//     this.snackBarRef.dismissWithAction()
//   }
// }
