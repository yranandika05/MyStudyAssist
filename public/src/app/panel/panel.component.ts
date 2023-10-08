import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LanguageModalComponent} from "../language-modal/language-modal.component";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";
import { ApiService } from '../services/api.service';
import { SessionService } from '../services/session.service';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  language: string = this.languageService.getSelectedLanguage()
  url: string = window.location.href;
  activePanel: string =  ''; // Set the default active item
  userInfo: any = {};

  constructor(
    public modal: NgbModal,
    private translate: TranslateService,
    private languageService: LanguageService,
    private apiService: ApiService,
    private storage: SessionService,
    private router: Router
    ) {

    translate.use(this.language);
  }

  ngOnInit(): void {
    this.setActivePanel();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActivePanel();
      }
    });

    //TODO show student name on panel
    this.apiService.get('students/' + this.storage.getItem("studentid", true)).subscribe((response: any) => {
      this.userInfo = JSON.stringify(response);
    });
    console.log(this.userInfo);
  }

  setActivePanel(){
    setTimeout(() => {
      this.url = window.location.href;
      const segments = this.url.split('/');

      if (segments.length > 1) {
        const argument = segments[4];
        this.activePanel = argument;
        console.log(this.activePanel);
        console.log(this.url);
      }
    }, 2);
  }

  async setLanguage(){
    try {
      const result = await this.modal.open(LanguageModalComponent).result;
      this.languageService.setSelectedLanguage(result);
      this.language = this.languageService.getSelectedLanguage();
      console.log(result);
      this.translate.use(this.language);
    }catch (err){

    }
  }
}
