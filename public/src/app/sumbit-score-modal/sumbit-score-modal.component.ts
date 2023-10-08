import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ScoresService} from "../services/scores.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-sumbit-score-modal',
  templateUrl: './sumbit-score-modal.component.html',
  styleUrls: ['./sumbit-score-modal.component.scss']
})
export class SumbitScoreModalComponent implements OnInit {
  public code: string = '';
  public title: string = '';
  public percentage: number | null = null;
  public creditPoint:  number | null = null;

  isSaveDisabled: boolean = this.percentage == null ? false : true;

  constructor(public activeModal: NgbActiveModal, private scoreService: ScoresService, private translate: TranslateService, private languageService: LanguageService) {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  checkValidity() {
    if (this.percentage !== null && !isNaN(parseFloat(this.percentage.toString()))) {
      this.isSaveDisabled = false; // Enable the save button
    } else {
      this.isSaveDisabled = true; // Disable the save button if any field is empty
    }
    console.log(this.isSaveDisabled)
  }

  isPercentageNegative(): boolean {
    return this.percentage !== null && this.percentage < 0  || this.percentage !== null && this.percentage > 100 ;
  }

  save(){
    const result = { code: this.code, title: this.title, score: this.scoreService.getGradeFromPercentage(this.percentage), percentage: this.percentage, creditPoint: this.creditPoint};
    this.activeModal.close(result);
  }
}
