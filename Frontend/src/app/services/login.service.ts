import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'http://localhost:5000/login';
  private signupUrl = 'http://localhost:5000/signup'; 

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password });
  }

  signup(username: string, password: string, email: string, firstName: string, lastName: string): Observable<any> {
    return this.http.post<any>(this.signupUrl, { username, password, email, firstName, lastName });
  }
}