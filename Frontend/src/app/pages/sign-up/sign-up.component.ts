import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router,private loginService: LoginService) {}
  onSubmit() {
    this.loginService.signup(this.username, this.password, this.email, this.firstName, this.lastName).subscribe({
      next: (response) => {
        // Handle successful signup
        console.log('Signup successful');
        // Navigate to login page after successful signup
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Handle signup error
        console.error('Signup failed', error);
      }
    });
  }
}
