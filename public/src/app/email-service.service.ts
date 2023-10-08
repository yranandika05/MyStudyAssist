import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {

  private emailServiceId = 'msa2023';
  private emailTemplateId = 'template_u9jbryp';
  private emailUserId = 'fWc1aX24-J9pvtdg5';

  constructor() { }

  sendForgotPasswordEmail(email: string, name: string, matr: any): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_name: name,
      from_name: "My Study Assist",
      matrikelnr: matr,
      to_email: email
    };

    return emailjs.send(this.emailServiceId, this.emailTemplateId, templateParams, this.emailUserId);
  }
}
