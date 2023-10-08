import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{
  studentId: any;
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private apiService: ApiService) {
      
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.studentId = params['id'];
      this.studentId = this.studentId.substring(1);
    });
  }

  resetPassword(pass: string, repeatedPass: string){
    console.log(this.studentId)
    if(pass == repeatedPass){
      this.apiService.get('students/matrikelnr/' + this.studentId).subscribe((response: any) =>{
        const studyInfo = JSON.parse(JSON.stringify(response));
        
        const payload = {
          matrikelnr: studyInfo.matrikelnr,
          username: studyInfo.username,
          password: pass,
          email: studyInfo.email,
          name: studyInfo.name,
          firstname: studyInfo.firstname,
          privacy: true,
          university: studyInfo.university,
          facultyid: studyInfo.facultyid,
          degreeprogamid: studyInfo.degreeprogramid,
        }
        console.log(payload);
  
        this.apiService.put(payload, `students/${studyInfo.studentid}/`).subscribe(() =>{
          alert('New password has been set')
          this.router.navigate(['/login']) ;
        },
          (error: any) =>{
            alert('Change password failed')  
          })
        console.log(studyInfo)
      });
      
    }else{
      alert('Repeated password must be identical to the password')
    }
  }
}