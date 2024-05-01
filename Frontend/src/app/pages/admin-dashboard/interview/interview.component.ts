import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
interface Interview {
  userEmail: string;
  interviewDate: { $date: string };
  status: string;
  score: number | null;
  position: string;
}

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.css'
})
export class InterviewComponent {
  constructor(private http: HttpClient) {
  }
  ngOnInit(){
    this.loadInterviews();
  }
  interviews: Interview[] = [];
  // markAttendance(interview: Interview) {
  //   const updatedStatus = !interview.attended;
  //   this.http.patch(`/api/interviews/${interview.userEmail}`, { attended: updatedStatus })
  //     .subscribe({
  //       next: () => {
  //         interview.attended = updatedStatus;
  //         console.log('Attendance updated');
  //       },
  //       error: (error) => console.error('Error updating attendance', error)
  //     });
  // }

  
  loadInterviews() {
    const user_email = ''
    const body = {user_email}
    this.http.post<Interview[]>('http://localhost:5000/get-all-interviews', body) // Fix URL
      .pipe(catchError(error => {
        console.error('Error fetching interviews', error);
        return of([]);
      }))
      .subscribe(interviews => {
        this.interviews = interviews;
      });
  }

}
