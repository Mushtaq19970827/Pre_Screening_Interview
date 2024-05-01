import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.css'
})
export class CandidateDashboardComponent {
  email: string='';
  constructor(private router: Router,private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log('Email:', this.email);
      // Do whatever you need with the email
    });
  }
  
  navigate(destination: string): void {
    // Navigate based on the button clicked
    this.router.navigate([`/candidate/${destination}`], { queryParams: { email: this.email } });
  }

  logout(destination: string): void {
    // Navigate based on the button clicked
    this.router.navigate([`/${destination}`], { queryParams: { email: this.email } });
  }
}
