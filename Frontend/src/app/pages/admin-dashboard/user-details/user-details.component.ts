import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface User {
  _id: string;  // Assuming MongoDB, which uses _id by default for the identifier
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  users: User[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('http://localhost:5000/users').subscribe({
      next: (data: User[]) => this.users = data,
      error: (err: any) => console.error('Failed to fetch users:', err)
    });
  }

  deleteUser(userId: string): void {
    this.http.delete(`http://localhost:5000/users/${userId}`).subscribe({
      next: () => {
        this.users = this.users.filter(user => user._id !== userId);
        console.log('User deleted successfully');
      },
      error: (err: any) => console.error('Failed to delete user:', err)
    });
  }
}
