import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { find } from 'rxjs';
import { EmailServiceService } from '../email-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = "";
  loading: boolean = false;
  successMessage: string = "";
  errorMessage: string = "";
  slideIndex = 1;
  private timer: any;

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private emailService: EmailServiceService
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

  sendForgotPasswordEmail() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    let isIDExist = 0;

    this.api.get('students/').subscribe((response: any) =>{
      const toObj = JSON.parse(JSON.stringify(response));
      for(let i = 0; i < toObj.length; i++){
        if(toObj[i].matrikelnr == this.email || toObj[i].username == this.email){
          this.emailService.sendForgotPasswordEmail(toObj[i].email, toObj[i].name, toObj[i].matrikelnr)
        .then(() => {
          this.loading = false;
          this.successMessage = 'Forgot password email sent successfully.';
        })
        .catch((error) => {
          this.loading = false;
          this.errorMessage = 'Failed to send forgot password email.';
          console.error('Error sending email:', error);
        });
          break;
        }
      }
      
    });

    
  }
}
