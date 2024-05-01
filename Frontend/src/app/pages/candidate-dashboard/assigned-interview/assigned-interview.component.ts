import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
interface AssignedInterview {
  _id: { $oid: string };
  userEmail: string;
  assignedStatus: string;
  interviewDate: { $date: string };
  position: string;
  score: string; // Assuming score is always a string in the response
  status: string;
}

@Component({
  selector: 'app-assigned-interview',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './assigned-interview.component.html',
  styleUrl: './assigned-interview.component.css'
})
export class AssignedInterviewComponent {
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log('Email:', this.email);

      this.fetchAssignedInterviews();
    });
  }
  email: string ='';
  constructor(private route: ActivatedRoute, private router: Router,private chatService: ChatService) { }

  assignedInterviews: AssignedInterview[] = [];
  fetchAssignedInterviews(): void {
    // Call the service method to fetch assigned interviews
    this.chatService.getAssignedInterviews(this.email).subscribe(
      (interviews) => {
        this.assignedInterviews = interviews.filter(interview => interview.status !== 'closed');
        console.log('Assigned Interviews:', this.assignedInterviews);
      },
      (error) => {
        console.error('Error fetching assigned interviews:', error);
      }
    );
  }
  startInterview(interview: any): void {
    console.log('Starting interview:', interview);
    this.router.navigate(['/candidate/interview'], { queryParams: { email: this.email, position: interview.position } });
  }
}
