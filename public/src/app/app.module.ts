import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PanelComponent } from './panel/panel.component';
import { RegistrationComponent } from './registration/registration.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarComponent } from './calendar/calendar.component';
import { SimulationComponent } from './simulation/simulation.component';
import { CoursesComponent } from './courses/courses.component';
import { SettingsComponent } from './settings/settings.component';
import { CircleProgressComponent } from './circle-progress/circle-progress.component';
import { PerformanceGraphComponent } from './performance-graph/performance-graph.component';
import { ScoresComponent } from './scores/scores.component';

import {FullCalendarModule} from "@fullcalendar/angular";
import { CalendarModalComponent } from './calendar-modal/calendar-modal.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {LanguageModalComponent} from "./language-modal/language-modal.component";
import { ScoreModalComponent } from './score-modal/score-modal.component';
import { EditScoreModalComponent } from './edit-score-modal/edit-score-modal.component';
import { NewEstimateScoreModalComponent } from './new-estimate-score-modal/new-estimate-score-modal.component';
import { EditEstimateScoreModalComponent } from './edit-estimate-score-modal/edit-estimate-score-modal.component';
import { SumbitScoreModalComponent } from './sumbit-score-modal/sumbit-score-modal.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {CommonModule} from "@angular/common";
import { ModulToCalendarModalComponent } from './modul-to-calendar-modal/modul-to-calendar-modal.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';




export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    PanelComponent,
    CalendarComponent,
    SimulationComponent,
    CoursesComponent,
    SettingsComponent,
    CircleProgressComponent,
    PerformanceGraphComponent,
    ScoresComponent,
    CalendarModalComponent,
    LanguageModalComponent,
    ScoreModalComponent,
    EditScoreModalComponent,
    NewEstimateScoreModalComponent,
    EditEstimateScoreModalComponent,
    SumbitScoreModalComponent,
    ModulToCalendarModalComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    BrowserModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

