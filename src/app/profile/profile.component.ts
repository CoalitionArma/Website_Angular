import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(private userService: UserService) {}
  email: string = '';

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
}
