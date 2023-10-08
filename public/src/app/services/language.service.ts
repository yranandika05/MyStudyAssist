import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private selectedLanguage: string = JSON.stringify(localStorage.getItem('lang')).replace(/"/g, '');

  getSelectedLanguage(): string {
    if(localStorage.getItem('lang') == null){
      return 'english';
    }
    return this.selectedLanguage;
  }

  setSelectedLanguage(language:string): void {
    this.selectedLanguage = language;
  }
}
