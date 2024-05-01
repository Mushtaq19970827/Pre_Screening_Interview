import { Component } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
interface Message {
  text: string;
  sender: 'user' | 'bot';
}
@Component({
  selector: 'app-interview-screen',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './interview-screen.component.html',
  styleUrl: './interview-screen.component.css'
})
export class InterviewScreenComponent {
  videoEnabled: boolean = false;
  position: string = 'demo';

  newMessage: string = '';
  messages: Message[] = [];
  email: string ='';
  constructor(private chatService:ChatService,private route: ActivatedRoute, private router:Router) { }

  // ngOnInit is a lifecycle hook that runs after Angular has initialized the component's data-bound properties.
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.position = params['position'];
      console.log('Email:', this.email);
    });
  }

  toggleVideo(): void {
    if (!this.videoEnabled) {
      // If video is not enabled, request access to the user's camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          // Attach the stream to a video element or your video streaming component
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.play();
          // Append the video element to the DOM or your video container
          document.querySelector('.placeholder-video')!.appendChild(videoElement);
          // Update the videoEnabled flag
          this.videoEnabled = true;
          console.log('Video enabled. Video stream started.');
        })
        .catch((error) => {
          console.error('Error accessing user media:', error);
        });
    } else {
      // If video is already enabled, stop the video stream
      const videoElement = document.querySelector('video');
      if (videoElement) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.remove();
        this.videoEnabled = false;
        console.log('Video disabled. Video stream stopped.');
      }
    }
  }

  
  // Method to call initial response endpoint
  callInitialResponse() {
    this.chatService.getInitialResponse().subscribe(response => {
      console.log('Initial Response:', response);
      this.messages.push({ text: response.results, sender: 'bot' });
    });
  }

  // Method to send user message
  sendMessage(event: any) {
    const newMessage = event.target.parentElement.querySelector('input').value;
    if (newMessage.trim() !== '') {
      this.messages.push({ text: newMessage, sender: 'user' });
      this.chatService.getSubsequentResponse(newMessage, []).subscribe(response => {
        console.log('Subsequent Response:', response);
        this.messages.push({ text: response.results, sender: 'bot' });
      });
      // Clear input field
    event.target.parentElement.querySelector('input').value = '';
    }
  }
  calculateScore() {
    this.chatService.calculateScore(this.email, this.position).subscribe(scores => {
      console.log('Calculated Scores:', scores);
      this.router.navigate(['/candidate/scores'], { queryParams: { email: this.email } });
    });
  }
    
  
}
