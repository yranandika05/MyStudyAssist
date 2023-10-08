import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";
import {ApiService} from "../services/api.service";
import {SessionService} from "../services/session.service";
import {map} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  idNumber: string = '';
  username: string = '';
  email: string = '';
  university: string = '';
  faculty: string = ''
  facultyId: number | null = null;
  degreeProgram: string = '';
  degreeProgramId: number | null = null;

  degreeProgramList: any[] = [];
  facultyList:any [] = [];



  constructor(private router: Router, private translate: TranslateService, private languageService: LanguageService, private apiService: ApiService, private session:SessionService ) {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
    this.getStudentInfo();
    this.getDegreeList();
    this.getFacultyList();
  }

  getStudentInfo(): void {
    const studentId = this.session.getItem('studentid', true);
    let degreeProgramList: any[] = [];
    let facultyList:any [] = [];
    let getFacultyName: string = '';
    let getDegreeName: string = '';
    this.apiService.get(`students/${studentId}`).pipe(
      map((response: any) => {
        return {
          firstName: response.firstname,
          lastName: response.name,
          idNumber: response.matrikelnr,
          username: response.username,
          email: response.email,
          university: response.university,
          facultyid: response.facultyid,
          degreeprogramid: response.degreeprogramid
          // Assign other properties as needed
        };
      })
    ).subscribe((info: any) => {
      this.apiService.get('faculties/').subscribe((faculties: any[]) => {
        facultyList = faculties;
        //search faculty id based on faculty;
        getFacultyName = facultyList.find(faculty => faculty.facultyid === info.facultyid).name;
        this.faculty = getFacultyName;
        this.apiService.get('degreeprograms/').subscribe((degreePrograms: any[]) =>{
          degreeProgramList = degreePrograms;
          //search degree program id based on degree name
          getDegreeName = degreeProgramList.find(degree => degree.degreeprogramid === info.degreeprogramid).name;
          this.degreeProgram = getDegreeName;
          }, (error: any) =>{console.error('error get degree programs', error)});
        }, (error: any) =>{console.error('error get faculties', error)});

        this.firstName = info.firstName;
        this.lastName = info.lastName;
        this.idNumber = info.idNumber;
        this.username = info.username
        this.email = info.email;
        this.university = info.university;
        this.facultyId = info.facultyid;
        this.degreeProgramId = info.degreeprogramid;

      },
      (error: any) => {
        console.error('Error retrieving student info:', error);
      }
    );
  }

  getFacultyList(){
    this.apiService.get('faculties/').subscribe((faculties: any[]) => {
      this.facultyList = faculties;
    },(error: any) =>{console.error('error get faculties', error)});
  }

  getDegreeList(){
    this.apiService.get('degreeprograms/').subscribe((degreePrograms: any[]) =>{
      this.degreeProgramList = degreePrograms;
    }, (error: any) =>{console.error('error get degree programs', error)});
  }
  save(firstName: string, lastName: string, university: string, faculty: string, degree: string){
    const studentId = this.session.getItem('studentid', true);
    let getFacultyId: number;
    let getDegreeId: number;;

    this.apiService.get('faculties/').subscribe((faculties: any[]) => {
      this.facultyList = faculties;



      this.apiService.get('degreeprograms/').subscribe((degreePrograms: any[]) =>{
        this.degreeProgramList = degreePrograms;



        this.apiService.get(`students/${studentId}`).pipe(
          map((response: any) => {
            return {
              pass: response.password
              // Assign other properties as needed
            };
          })
        ).subscribe(
          (info: any) => {
            const payload = {
              matrikelnr: this.idNumber,
              username: this.username,
              password: info.pass,
              email: this.email,
              name: lastName == '' ? this.lastName : lastName,
              firstname: firstName == '' ? this.firstName : firstName,
              privacy: true,
              university: university == '' ? this.university : university,
              facultyid: faculty,
              degreeprogramid: degree,
            }
            console.log(payload)
            this.apiService.put(payload, `students/${studentId}/`).subscribe(() =>{
                this.getStudentInfo();
                alert('Your personal information has been seved')
              },
              (error: any) =>{
                alert('Saving personal information failed:' + error)
              })
          }, (error: any) => {console.error('Error retrieving student info:', error);});
      }, (error: any) =>{console.error('error get degree programs', error)});
    }, (error: any) =>{console.error('error get faculties', error)});
  }


  resetPassword(pass: string, repeatedPass: string){
    if(pass == repeatedPass){
      const studentId = this.session.getItem('studentid', true);
      const payload = {
        matrikelnr: this.idNumber,
        username: this.username,
        password: pass,
        email: this.email,
        name: this.lastName,
        firstname: this.firstName,
        privacy: true,
        university: this.university,
        facultyid: this.facultyId,
        degreeprogamid: this.degreeProgramId,
      }
      this.apiService.put(payload, `students/${studentId}/`).subscribe(() =>{
        alert('New password has been set')
      },
        (error: any) =>{
          alert('Change password failed:' + error)
        })
    }else{
      alert('Repeated password must be identical to the password')
    }
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(['/login']) ;
    setTimeout(() =>
      alert('You logged out successfully  ')
    , 10);

  }
}
