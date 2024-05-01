import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
interface User {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  username: string;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    isAdmin: false,
    username: ''
  };

  // Boolean flag to toggle between view and edit mode
  editing = false;
  email: string ='';
  // Constructor for the component (used for dependency injection)
  constructor(private route: ActivatedRoute, private chatService:ChatService, private router: Router) { }

  // ngOnInit is a lifecycle hook that runs after Angular has initialized the component's data-bound properties.
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log('Email:', this.email);
    this.getUserDetails()

      
    });
  }
  getUserDetails() {
    this.chatService.getUserDetails(this.email).subscribe(data => {
      console.log('User details:', data);
      this.user = data
    });}

    updateUserDetails() {
      this.chatService.updateUserDetails(this.email,this.user.firstName,this.user.lastName, this.user.username).subscribe(data => {
        console.log('User details:', data);
        this.user = data
      });}
  // Function to toggle the editing state
  toggleEdit(): void {
    this.editing = !this.editing;
  }

  // Function to save profile changes
  saveProfile(): void {
    this.updateUserDetails()
    console.log('Profile saved', this.user);
    this.toggleEdit();  // Toggle back to view mode after save
  }
}
