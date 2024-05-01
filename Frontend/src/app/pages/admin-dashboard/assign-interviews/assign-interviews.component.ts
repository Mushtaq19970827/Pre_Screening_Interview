import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

interface Interview {
  candidateName: string;
  interviewDate: string;
  attended: boolean;
  score: number | null;
}

@Component({
  selector: 'app-assign-interviews',
  styleUrls: ['./assign-interviews.component.css'], // Fix 'styleUrl' to 'styleUrls'
  templateUrl: './assign-interviews.component.html',
})
export class AssignInterviewsComponent {
  interviews: Interview[] = [];
  email: string = '';
  selectedPosition: string = '';
  constructor(private http: HttpClient,private router: Router) {
    // this.loadInterviews();
  }

  assignInterview(candidateName: string, interviewDate: string,selectedpostion: string): void {

    const body = {candidateName, interviewDate, selectedpostion}
    this.email = candidateName;
    this.http.post<any>('http://localhost:5000/assign-interview', body)
      .subscribe({
        next: (response: any) => {
          this.interviews.push(response);
          console.log('Interview assigned successfully');

          this.router.navigate(['/admin/interview'], { queryParams: { email: response.email } });
        },
        error: (error) => console.error('Failed to assign interview', error)
      });
  }

  
}
