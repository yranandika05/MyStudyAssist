import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";
import {ModulesService} from "../services/modules.service";
import {SessionService} from "../services/session.service";
@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss']
})
export class CalendarModalComponent implements OnInit {
  public title: string = '';
  public startTime: string = '';
  public endTime: string = '';
  public startDate: string = '';
  public endDate: string = '';
  public isModule: boolean = false;
  public code: string = '';



  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService,
    private languageService: LanguageService,
    private moduleService: ModulesService,
    private session: SessionService
    )
  {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  addModulEvent(){
    this.isModule = true
  }

  updateTitle(): void{
    const module = this.moduleService.getModuleByCode(this.code);
    if(module) {
      this.title = module.title;
    }else{
      this.title = ""
    }
  }

  save() {
    if (this.title.trim().length > 0 && this.startTime && this.endTime){
      let result = {};
      if(this.isModule){
        result = {
          title: this.title,
          startTime: this.startTime,
          endTime: this.endTime,
          start: 'T00:00:00',
          end: this.endDate + 'T24:00:00',
          isModule: this.isModule
        };
      }else{
        result = {
          title: this.title,
          startTime: this.startTime,
          endTime: this.endTime,
          isModule: this.isModule
        };
      }
      this.activeModal.close(result);
    }
  }
}
