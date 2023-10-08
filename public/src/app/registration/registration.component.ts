import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";
import {SessionService} from "../services/session.service";
import {ModulesService} from "../services/modules.service";
import {ScoresService} from "../services/scores.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  slideIndex = 1;
  private timer: any;
  facultyList: any[] = [];
  degreeProgramList: any[] = [];
  constructor(
    private router: Router,
    private apiService: ApiService,
    private session: SessionService,
    private moduleService : ModulesService,
    private scoreService : ScoresService
  ) { }

  ngOnInit(): void {
    this.showSlides(this.slideIndex);
    this.startSlideShow()
    this.getFacultyList();
    this.getDegreeList();
  }
  ngOnDestroy(){
    this.stopSlideShow()
  }
  plusSlides(n:number){
    this.showSlides(this.slideIndex += n);
  }
  currentSlide(n:number){
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: number) {
    const slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    const dots = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex - 1].style.display = "block";
    dots[this.slideIndex - 1].className += " active";
  }

  startSlideShow(){
    this.timer = setInterval(() => {
      this.plusSlides(1);
    }, 10000);
  }

  stopSlideShow(){
    clearInterval(this.timer);
  }


  signUp(firstName: string, lastName: string, studentId: string, username: string, email: string, university: string, faculty: string, degree: string, pass: string, repeatedPass: string){
    if(pass == repeatedPass){
      if((firstName != '') && (lastName != '') && (studentId != null) && (username != '') && (email != '') && (faculty != '') && (degree != '') && (pass != '')){
        const data = {
          matrikelnr: studentId,
          username: username,
          password: pass,
          email: email,
          name: lastName,
          firstname: firstName,
          privacy: true,
          university: university,
          facultyid: faculty,
          degreeprogramid: degree
        }

        this.apiService.postFormData(data, `students/`).subscribe(
          () => {
            console.log('Registration complete');
            const formData = {password: pass};
            this.apiService.login(formData, 'students/matrikelnr/' + studentId).subscribe(
              (isAuthenticated: boolean) => {
                if(isAuthenticated){
                  console.log('Success');
                  this.router.navigate(['panel']);
                  this.moduleService.getModules().subscribe((modules) => {
                    // Store the modules using SessionService
                    this.session.setItem('modules', modules, true);
                  });
                  this.scoreService.getScores().subscribe((scores) => {
                    // Store the scores using SessionService
                    this.session.setItem('scores', scores, true);
                  });
                }else{
                  alert('Authentication failed')
                }
              }
            );
          },
          (error: any) => {
            alert('Registration failed')
          });
      }else{
        alert("Please fill all the the information")
      }
    }else{
      alert("Your password is not same as repeated password")
    }
  }

  getFacultyList(){
    this.apiService.get('faculties/').subscribe((faculties: any[]) => {
      this.facultyList = faculties;
      console.log(this.facultyList);
    },(error: any) =>{console.error('error get faculties', error)});
  }

  getDegreeList(){
    this.apiService.get('degreeprograms/').subscribe((degreePrograms: any[]) =>{
      this.degreeProgramList = degreePrograms;
    }, (error: any) =>{console.error('error get degree programs', error)});
  }
}
