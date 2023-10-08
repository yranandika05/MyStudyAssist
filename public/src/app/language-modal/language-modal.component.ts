import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.component.html',
  styleUrls: ['./language-modal.component.scss']
})
export class LanguageModalComponent implements OnInit {

  public language: string = JSON.stringify(localStorage.getItem('lang'));;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService, private languageService: LanguageService) {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  save() {
      const result = this.language;
      localStorage.setItem('lang', result);
      this.activeModal.close(result);
  }
}
