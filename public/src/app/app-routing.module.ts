import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';
import {RegistrationComponent} from "./registration/registration.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {SimulationComponent} from "./simulation/simulation.component";
import {CoursesComponent} from "./courses/courses.component";
import {SettingsComponent} from "./settings/settings.component";
import { ScoresComponent } from './scores/scores.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {path: 'panel',component: PanelComponent, children:[
      {path: '', redirectTo:'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'calendar', component: CalendarComponent},
      {path: 'simulation', component: SimulationComponent},
      {path: 'courses', component: CoursesComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'score', component: ScoresComponent}
      // Add other main view components here
      ]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'forgotpass', component: ForgotPasswordComponent},
  {path: 'resetpassword/:id', component: ResetPasswordComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routerComponents = [
  DashboardComponent,
  LoginComponent,
  RegistrationComponent, 
  PanelComponent,
  ScoresComponent
]

