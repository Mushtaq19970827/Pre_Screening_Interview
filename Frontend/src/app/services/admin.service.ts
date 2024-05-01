import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  private analyzeUrl = 'http://localhost:5000/analyze-candidates';
  constructor(private http: HttpClient) { }
  analyzeCvs(formData: FormData): Observable<any> {
    return this.http.post<any>(this.analyzeUrl, formData);
  }

  
  
}
