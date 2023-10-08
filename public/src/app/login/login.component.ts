import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from "../services/api.service";
import {SessionService} from "../services/session.service";
import {ModulesService} from "../services/modules.service";
import {ScoresService} from "../services/scores.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  slideIndex = 1;
  private timer: any;
  emptyInput: boolean = false;
  falsePassword: boolean = false;
  constructor(
    private router: Router,
    private httpService: ApiService,
    private session: SessionService,
    private moduleService : ModulesService,
    private scoreService : ScoresService
  ) { }

  ngOnInit(): void {

    this.showSlides(this.slideIndex);
    this.startSlideShow()
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

  auth(uname: string, pass: string){

    if((uname != '') && (pass != '')){
      this.emptyInput = false;
      const formData = {password: pass};
      this.httpService.login(formData, 'students/matrikelnr/' + uname).subscribe(
        (isAuthenticated: boolean) => {
          if(isAuthenticated){
            this.falsePassword = false;
            console.log('Success');
            this.router.navigate(['panel']);
              this.moduleService.getModules().subscribe((modules) => {
                // Store the modules using SessionService
                this.session.setItem('modules', modules, true);
                this.scoreService.getScores().subscribe((scores) => {
                  // Store the scores using SessionService
                  this.session.setItem('scores', scores, true);
                });
              });

          }else{
            this.falsePassword = true;
            console.log('Authentication failed');
          }
        }
      );
    }else{
      this.emptyInput = true;
    }
  }

  regis(){
    this.router.navigate(['registration'])
  }
}
