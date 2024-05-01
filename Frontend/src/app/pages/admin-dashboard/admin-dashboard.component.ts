import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  navigate(destination: string): void {
    // Navigate based on the button clicked
    this.router.navigate([`/admin/${destination}`]);
  }
  logout(destination: string): void {
    // Navigate based on the button clicked
    this.router.navigate([`/${destination}`]);
  }
}
