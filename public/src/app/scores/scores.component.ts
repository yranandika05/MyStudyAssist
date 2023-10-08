import { Component, OnInit } from '@angular/core';
import {ScoresService} from "../services/scores.service";
import {ScoreModalComponent} from "../score-modal/score-modal.component";
import {ScoresList} from "./ScoresList";
import {EditScoreModalComponent} from "../edit-score-modal/edit-score-modal.component";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";
import {ModulesService} from "../services/modules.service";
import {firstValueFrom} from "rxjs";
import {SumbitScoreModalComponent} from "../sumbit-score-modal/sumbit-score-modal.component";

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {
  scoreList: ScoresList[] = [];
  studentId = sessionStorage.getItem('studentid') as string;


  constructor( private scoreService: ScoresService, private translate: TranslateService, private languageService: LanguageService, private moduleService: ModulesService) {
    this.translate.use(this.languageService.getSelectedLanguage());
  }


  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
    this.scoreList = this.scoreService.getScoresLists();
  }

  //calculate average score of the score where prediction == false
  getAverageScore():number | null {
    return this.scoreService.getGradeFromPercentage(this.getAveragePercentage());
  }

  //calculate averqage score of all score
  getAverageEstimateScore(): number | null {
    let hasPrediction = this.scoreList.some(item => item.prediction);
    if (!hasPrediction) {
      return null; // Return null if no items with prediction = true
    }
    return this.scoreService.getGradeFromPercentage(this.getAverageEstimatePercentage());
  }

  //calculate average percentage of the score where prediction == false
  getAveragePercentage(): number | null {
    let scoresToAverage = this.scoreList.filter(item => !item.prediction);
    scoresToAverage = scoresToAverage.filter(item => item.passed);
    if (scoresToAverage.length === 0) {
      return null; // Return null if no scores to average
    }

    const totalWeightedScore = scoresToAverage.reduce((sum, item) => {
      const weightedScore = (item.percentage || 0) * (item.creditPoint || 0);
      return sum + weightedScore;
    }, 0);

    const totalCreditPoints = scoresToAverage.reduce((sum, item) => sum + (item.creditPoint || 0), 0);

    const averageScore = totalWeightedScore / totalCreditPoints;
    const roundedAverageScore = Math.round(averageScore);

    return roundedAverageScore;
  }

  //calculate averqage percentage of all score
  getAverageEstimatePercentage(): number | null {
    const hasPrediction = this.scoreList.some(item => item.prediction);
    if (!hasPrediction) {
      return null; // Return null if no items with prediction = true
    }

    const scoresToAverage = this.scoreList.filter(item => item.passed);
    const totalWeightedScore = scoresToAverage.reduce((sum, item) => {
      const weightedScore = (item.percentage || 0) * (item.creditPoint || 0);
      return sum + weightedScore;
    }, 0);
    const totalCreditPoints = scoresToAverage.reduce((sum, item) => sum + (item.creditPoint || 0), 0);
    const averageScore = totalWeightedScore / totalCreditPoints;
    const roundedAverageScore = Math.round(averageScore);
    return roundedAverageScore;
  }

  //calculate total credit point where prediction == false and passed == true
  getTotalCreditPoint(): number {
    let creditPoint = this.scoreList.filter(item => !item.prediction);
    creditPoint = creditPoint.filter(item => item.passed);
    const totalCreditPoints = creditPoint.reduce((sum, item) => sum + (item.creditPoint || 0), 0);
    return totalCreditPoints;
  }

  //calculate total credit point where passed == true
  getTotalEstimateCreditPoint(): number | null {
    const hasPrediction = this.scoreList.some(item => item.prediction);
    if (!hasPrediction) {
      return null; // Return null if no items with prediction = true
    }
    const creditPoint = this.scoreList.filter(item => item.passed);
    const totalCreditPoints = creditPoint.reduce((sum, item) => sum + (item.creditPoint || 0), 0);
    return totalCreditPoints;
  }


  async updateScore(gradeId: number, code: string, prediction: boolean) {
    try {
      const studentId = sessionStorage.getItem('studentid');
      const module = this.moduleService.getModuleByCode(code);
      const score = this.scoreService.getScoreById(gradeId);

      //transfer the value of current object to the modal
      const modalRef = this.scoreService.scoreModalService.open(EditScoreModalComponent);
      if(module != undefined){
        modalRef.componentInstance.code = module.code;
        modalRef.componentInstance.title = module.title;
        modalRef.componentInstance.creditPoint = module.creditPoint;
      }
      if(score != undefined){
        modalRef.componentInstance.percentage = score.percentage;
      }
      //get the result of edit-score-modal
      const result = await modalRef.result;
      const newModule = this.moduleService.getModuleByCode(result.code)
      const isPassed = result.percentage > 50;
      const payload = {
        grade: this.scoreService.getGradeFromPercentage(result.percentage),
        pervent: result.percentage,
        prediction: prediction,
        passed: isPassed,
        studentid: studentId,
        moduleid: newModule?.moduleid
      }
      this.scoreService.updateScore(payload, gradeId);
    }catch (err){
      console.log("Window closed...", err)
    }
  }

  //move the score to the real score table, change the value of prediction into false
  async submitScore(gradeId: number, code: string) {
    try {
      const studentId = sessionStorage.getItem('studentid');
      const module = this.moduleService.getModuleByCode(code);
      const score = this.scoreService.getScoreById(gradeId);

      //transfer the value of current object to the modal
      const modalRef = this.scoreService.scoreModalService.open(SumbitScoreModalComponent);
      if(module != undefined){
        modalRef.componentInstance.code = module.code;
        modalRef.componentInstance.title = module.title;
        modalRef.componentInstance.creditPoint = module.creditPoint;
      }
      if(score != undefined){
        modalRef.componentInstance.percentage = score.percentage;
      }
      //get the result of submit-score-modal
      const result = await modalRef.result;
      const isPassed = result.percentage > 50;
      const payload = {
        grade: this.scoreService.getGradeFromPercentage(result.percentage),
        pervent: result.percentage,
        prediction: false,
        passed: isPassed,
        studentid: studentId,
        moduleid: module?.moduleid
      }
      this.scoreService.updateScore(payload, gradeId);
    }catch (err){
      console.log("Window closed...", err)
    }
  }

  async delScore(gradeId: number, code: string){
    try{
      const confirmation = window.confirm('Delete ' + code + '?');
      if(confirmation){
        console.log(gradeId);
        this.scoreService.delScore(gradeId);
        alert('Delete' + code + 'succesfully')
        this.scoreList = this.scoreService.getScoresLists();
      }
    }catch(err){
      console.log("unable to delete...", err);
    }
  }


  async addNewScore() {
    try {

      const result = await this.scoreService.scoreModalService.open(ScoreModalComponent).result;

      const module = this.moduleService.getModuleByCode(result.code);
      const moduleId = module ? module.moduleid : null;
      const isPassed = result.percentage > 50;
      const score = this.scoreService.getGradeFromPercentage(result.percentage);

      const payload = {
        grade: score,
        pervent: result.percentage,
        prediction: false,
        passed: isPassed,
        studentid: this.studentId,
        moduleid: moduleId
      };

      this.scoreService.addScore(payload).subscribe(() => {
        console.log('success');
        this.scoreList = this.scoreService.getScoresLists();
      });
    } catch (err) {
      console.log('Error adding score:', err);
    }
  }

  async addNewEstimateScore() {
    try {
      const studentId = sessionStorage.getItem('studentid') as string;

      const result = await this.scoreService.scoreModalService.open(ScoreModalComponent).result;

      const module = this.moduleService.getModuleByCode(result.code);
      const moduleId = module ? module.moduleid : null;
      const isPassed = result.percentage > 50;
      const score = this.scoreService.getGradeFromPercentage(result.percentage);

      const payload = {
        grade: score,
        pervent: result.percentage,
        prediction: true,
        passed: isPassed,
        studentid: studentId,
        moduleid: moduleId
      };

      this.scoreService.addScore(payload).subscribe(() => {
        console.log('success');
        this.scoreList = this.scoreService.getScoresLists();
      });
    } catch (err) {
      console.log('Error adding score:', err);
    }
  }

}
