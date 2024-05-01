import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { AdminService } from '../../../services/admin.service';

interface Candidate {
  name: string;
  email: string;
  experience: number;
}

@Component({
  selector: 'app-filter-top-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-top-candidates.component.html',
  styleUrl: './filter-top-candidates.component.css'
})
export class FilterTopCandidatesComponent {
  candidates: Candidate[] = [];
  jobTypes = ['Software Developer', 'Project Manager', 'Data Analyst']; 
  selectedRole: string= '';
  files: FileList | undefined ;
  requirementFile: File | undefined;
  constructor(private adminService:AdminService) { }

  uploadCVs(event: any) {
    this.files = event.target.files;
  }
  uploadRequirement(event: any) {
    this.requirementFile = event.target.files[0];
  }
  
  analyzeCandidates() {
    if (this.files && this.files.length > 0 && this.selectedRole) {
      const formData: FormData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i]);
      }
      formData.append('requirementFile', this.requirementFile!);
      formData.append('selectedRole', this.selectedRole);

      this.adminService.analyzeCvs(formData)
        .subscribe(response => {
          console.log('Analysis successful:', response);
          // Handle success response
        }, error => {
          console.error('Failed to analyze candidates:', error);
          // Handle error
        });
    } else {
      console.error('Please select CVs and a role before analyzing.');
    }
  }

  assignInterview(candidate: Candidate): void {
    // Logic to assign interview to the candidate
    console.log('Assigning interview to:', candidate);
  }
}
