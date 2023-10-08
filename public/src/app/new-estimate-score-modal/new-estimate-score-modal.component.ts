import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-new-estimate-score-modal',
  templateUrl: './new-estimate-score-modal.component.html',
  styleUrls: ['./new-estimate-score-modal.component.scss']
})
export class NewEstimateScoreModalComponent implements OnInit {
  public code: string = '';
  public title: string = '';
  public estimate: any = '';
  public creditPoint: any;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService, private languageService: LanguageService) {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  save(){
    const result = { code: this.code, title: this.title, estimate: this.estimate, creditPoint: this.creditPoint};
    this.activeModal.close(result);
  }
}
