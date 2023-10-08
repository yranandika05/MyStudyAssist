import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-modul-to-calendar-modal',
  templateUrl: './modul-to-calendar-modal.component.html',
  styleUrls: ['./modul-to-calendar-modal.component.scss']
})
export class ModulToCalendarModalComponent {
  public title: string = '';
  public startDate: string = '';
  public endDate: string = '';
  public isSaveDisabled: boolean = true;
  planData: any[] = [];


  constructor(public activeModal: NgbActiveModal, private translate: TranslateService, private languageService: LanguageService, private apiService: ApiService) {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
    console.log(this.title);
    this.getStudentModulePlan();
  }

  checkValidity() {
    if (this.startDate.trim() !== '' && this.endDate.trim() !== '') {
      this.isSaveDisabled = false; // Enable the save button
    } else {
      this.isSaveDisabled = true; // Disable the save button if any field is empty
    }
    console.log(this.isSaveDisabled)
  }

  isEndDateBeforeStartDate(): boolean {
    const startDateObj = new Date(this.startDate);
    const endDateObj = new Date(this.endDate);
    return endDateObj < startDateObj;
  }

  save(){
    const result = { startDate: this.startDate, endDate: this.endDate};
    this.activeModal.close(result);
  }

  getStudentModulePlan() {
    // Your existing code to filter courses based on moduleid and this.title...
    this.apiService.get('courses/').subscribe((course: any[]) => {
      const courses = course;

      // Filter courses based on moduleid and this.title
      this.planData = courses.filter(item => item.moduleid === this.title);
      // Map the typeid to the corresponding type
      this.planData.forEach(item => {
        item.type = this.getType(item.typeid);
      });
      console.log(this.planData);
    });
  }

    getType(id: number): string {
      // Map the typeid to the corresponding type
      const typeMap: { [key: number]: string } = {
        1: '(Vorlesung)',
        2: '(Praktikum)',
        3: '(Tutorium)',
        4: '(Übung)',
        5: '(Seminaristischer Unterricht)',
        6: '(Seminar)',
      };

      return typeMap[id] || ''; // Return empty string for unknown typeid
    }
}
