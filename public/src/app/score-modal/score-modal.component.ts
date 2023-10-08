import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ScoresService} from "../services/scores.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";
import {ModulesService} from "../services/modules.service";
import { SessionService } from '../services/session.service';
import {empty} from "rxjs";

@Component({
  selector: 'app-score-modal',
  templateUrl: './score-modal.component.html',
  styleUrls: ['./score-modal.component.scss']
})
export class ScoreModalComponent implements OnInit {
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef<HTMLInputElement>;
  public code: string = '';
  public title: string = '';
  public percentage: number | null = null;
  public creditPoint: number | null = null;
  showDropdown: boolean = false;
  autocompleteOptions: string[] = [];
  private options: string[] = [];
  private myScores: number[] = [];
  private modulelists = this.storage.getItem("modules", true);
  private scorelists = this.storage.getItem("scores", true);

  isSaveDisabled: boolean = true;
  isScoreExist: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private scoreService: ScoresService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private moduleService: ModulesService,
    private storage: SessionService
    ) {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
    for(let i = 0; i < this.modulelists.length; i++){
      this.options.push(this.modulelists[i].title);
    }

    for(let i = 0; i < this.scorelists.length; i++){
      this.myScores.push(this.scorelists[i].code);
    }

  }

  updateTitle(): void{
    const module = this.moduleService.getModuleByCode(this.code);
    if(module) {
      this.title = module.title;
    }else{
      this.title = ""
    }
  }

  updateCreditPoint(): void{
    const module = this.moduleService.getModuleByCode(this.code);
    if(module) {
      this.creditPoint = module.creditPoint;
    }
  }

  updateModuleCode(position: any){
    this.code = this.modulelists[position].code;
    this.updateCreditPoint();
  }

  onInputChange() {
    this.showDropdown = false;
    this.autocompleteOptions = this.getAutocompleteOptions(this.title);
    this.showDropdown = this.title.length > 0;
  }

  selectOption(option: string) {
    this.title = option;
    this.showDropdown = false;
    let position;
    for(let i = 0; i < this.modulelists.length; i++){
      if(this.title == this.modulelists[i].title){
        position = i;
      }
    }
    this.updateModuleCode(position);
  }

  getAutocompleteOptions(query: string): string[] {
    return this.options.filter(option => option.toLowerCase().includes(query.toLowerCase()));
  }

  //Check if the selected module already exist in score table and already passed, this behaviour return true.
  //Return false if the module does not exist in score table, or it exist but the the percentage < 50%.
  isExist(): boolean{
    for(let i = 0; i < this.scorelists.length; i++){
      if(this.code == this.scorelists[i].code && this.scorelists[i].passed){
        return true;
      }
    }
    return false;
  }

  //check if the selected modul has any requirements that the student has not fulfilled
  hasMissingRequirements(): boolean {
    if (!this.code || this.code.trim() === '') {
      return false;
    }

    const module = this.moduleService.getModuleByCode(this.code);
    if (!module) {
      return false;
    }

    const requirements = this.extractRequirements(module.requirement);
    const takenModules = this.scoreService.getScoresLists().map(score => score.code);
    const missingRequirements = requirements.filter(req => !takenModules.includes(req));

    return missingRequirements.length > 0;
  }

  //return requirements that the student has not fulfilled
  getMissingRequirements(): string {
    const module = this.moduleService.getModuleByCode(this.code);
    if (!module) {
      return '';
    }

    const requirements = this.extractRequirements(module.requirement);

    const takenModules = this.scoreService.getScoresLists().map(score => score.code);
    const missingRequirements = requirements.filter(req => !takenModules.some(code => req.includes(code)));


    return missingRequirements.join(', ');
  }

  //split the requirement string and compare it with existing modules. return the requirements is match the existing modules
  extractRequirements(requirementsString: string): string[] {
    if (!requirementsString || requirementsString.trim() === '') {
      return [];
    }

    const requirements = requirementsString.split(',').map(req => req.trim());

    const moduleList = sessionStorage.getItem('modules');
    const moduleListData: any[] = moduleList ? JSON.parse(moduleList) : [];

    const uniqueRequirements: string[] = [];

    for (const requirement of requirements) {
      const matchingModule = moduleListData.find(module => {
        const combinedTitleCode = `${module.title} (${module.code})`;
        return requirement === combinedTitleCode;
      });

      if (matchingModule) {
        uniqueRequirements.push(requirement);
      }
    }

    return uniqueRequirements;
  }

  checkValidity() {
    if (this.code.trim() !== '' && this.title.trim() !== '' && this.percentage !== null && this.percentage && !isNaN(parseFloat(this.percentage.toString())) ) {
      this.isSaveDisabled = false; // Enable the save button
    } else {
      this.isSaveDisabled = true; // Disable the save button if any field is empty
    }
  }

  isPercentageNegative(): boolean {
    return this.percentage !== null && this.percentage < 0 || this.percentage !== null && this.percentage > 100;
  }

  save(){
    if(this.isExist()){
      this.isScoreExist = true;
    }else{
      this.isScoreExist = false;
      const result = { code: this.code, title: this.title, score: this.scoreService.getGradeFromPercentage(this.percentage), percentage: this.percentage, creditPoint: this.creditPoint};
      this.activeModal.close(result);
    }
  }
}
