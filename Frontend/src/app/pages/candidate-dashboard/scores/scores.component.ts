import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit {
  scores: any[] = [];
  email: string ='';
  constructor(private route: ActivatedRoute, private chatService: ChatService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log('Email:', this.email);
      this.fetchScores();
    });

  }
    fetchScores(): void {
      if (this.email) {
        // Call the service method to get scores by email
        this.chatService.getScoresByEmail(this.email).subscribe(
          (response) => {
            // Assign scores from the response to the component variable
            this.scores = response;
            console.log('Scores:', this.scores);
          },
          (error) => {
            console.error('Error fetching scores:', error);
          }
        );
      }
    }
  }


