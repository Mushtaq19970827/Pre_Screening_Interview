import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router,private loginService: LoginService) {}

  onSubmit() {
    this.loginService.login(this.username, this.password)
      .subscribe(response => {
        // Handle successful login
        console.log('Login successful');
        // Check if user is admin
        if (response.isAdmin) {

          console.log('user email ', response.email)
          // Redirect to admin dashboard
          this.router.navigate(['/admin'], { queryParams: { email: response.email } });
        } else {
          console.log('user email ', response.email)
          // Redirect to candidate dashboard
          this.router.navigate(['/candidate'], { queryParams: { email: response.email } });

        }
      }, error => {
        // Handle login error
        console.error('Login failed', error);
      });
  }
}
