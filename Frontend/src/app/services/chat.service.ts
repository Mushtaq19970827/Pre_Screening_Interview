import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  // Method to make POST request to Flask backend for initial response
  getInitialResponse() {
    const body = { history: [] }; 

    return this.http.post<any>('http://localhost:5000/initial-response', body);
  }

  // Method to make POST request to Flask backend for subsequent response
  getSubsequentResponse(transcript: string, history: any[]) {
    const body = { transcript, history }; 

    return this.http.post<any>('http://localhost:5000/subsequent-response', body);
  }

  calculateScore(email: string, position: string) {
    const body = {email,position}
    return this.http.post<any>(`http://localhost:5000/calculate-score`, body);
   
  }
  getUserDetails(email:string){
    const body = {email}
    return this.http.post<any>(`http://localhost:5000/get-user`, body);
   
  }
  updateUserDetails(email:string,firstName:string,lastName:string,username:string){
    const body = {email, firstName, lastName, username}
    return this.http.post<any>(`http://localhost:5000/update-user`, body);
   
  }
  getScoresByEmail(email: string) {
    const body = {email}
    return this.http.post<any>(`http://localhost:5000/scores`, body);
  }

  getAssignedInterviews(email:string) {
    const body = {email}
    return this.http.post<any[]>('http://localhost:5000/assigned-interviews', body);
  }
}
