import { Component, OnInit } from '@angular/core';
import {ScoresService} from "../services/scores.service";
import {EditScoreModalComponent} from "../edit-score-modal/edit-score-modal.component";
import {ScoreModalComponent} from "../score-modal/score-modal.component";
import {ScoresList} from "../scores/ScoresList";
import {NewEstimateScoreModalComponent} from "../new-estimate-score-modal/new-estimate-score-modal.component";
import {EditEstimateScoreModalComponent} from "../edit-estimate-score-modal/edit-estimate-score-modal.component";
import {SumbitScoreModalComponent} from "../sumbit-score-modal/sumbit-score-modal.component";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {


  constructor( public scoreService: ScoresService, private translate: TranslateService, private languageService: LanguageService) {
    this.translate.use(this.languageService.getSelectedLanguage());
  }

  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
  }


  getAverageEstimateScore(): number | null {
    const scoreList = this.scoreService.scoreList;
    const estimateList = this.scoreService.estimationScoreList;

    const totalAcquiredScore = scoreList.reduce(
      (sum, item) => sum + ((item.percentage || 0) * (item.creditPoint || 0)), 0
    );

    const totalEstimateScore = estimateList.reduce(
      (sum, item) => sum + ((item.estimate || 0) * (item.creditPoint || 0)), 0
    );

    const totalAcquiredCreditPoints = scoreList.reduce((sum, item) => sum + (item.creditPoint || 0), 0);
    const totalEstimateCreditPoint = estimateList.reduce((sum, item) => sum + (item.creditPoint || 0), 0);

    const totalWeightedScore = totalAcquiredScore + totalEstimateScore;
    const totalCreditPoints = totalAcquiredCreditPoints + totalEstimateCreditPoint;

    if (totalCreditPoints === 0) {
      return null; // Avoid division by zero
    }

    const averageScore = totalWeightedScore / totalCreditPoints;
    const roundedAverageScore = Math.round(averageScore); // Round to the nearest whole number
    return roundedAverageScore;
  }






  getTotalEstimateCreditPoint(): number {
    const scoreList = this.scoreService.scoreList;
    const estimateList = this.scoreService.estimationScoreList;

    const acquiredCreditPoints = scoreList.reduce((sum, item) => sum + (item.creditPoint || 0), 0);
    const estimateCreditPoints = estimateList.reduce((sum, item) => sum + (item.creditPoint || 0), 0);

    const totalCreditPoints = acquiredCreditPoints + estimateCreditPoints;
    return totalCreditPoints;
  }


  async addNewEstimation(){
    try {
      const result = await this.scoreService.scoreModalService.open(NewEstimateScoreModalComponent).result;

    }catch(err){
      console.log("Window closed...", err);
    }
  }


  async updateEstimate(code: string) {
    try {
      const index = this.scoreService.estimationScoreList.findIndex(x => x.code == code);
      const currentObject = this.scoreService.estimationScoreList[index];

      //transfer the value of current object to the modal
      const modalRef = this.scoreService.scoreModalService.open(EditEstimateScoreModalComponent);
      modalRef.componentInstance.code = currentObject.code;
      modalRef.componentInstance.title = currentObject.title;
      modalRef.componentInstance.estimate = currentObject.estimate;
      modalRef.componentInstance.creditPoint = currentObject.creditPoint;

      //get the result of edit-score-modal
      const result = await modalRef.result;
      this.scoreService.estimationScoreList[index] = result;
    }catch (err){
      console.log("Window closed...", err)
    }
  }

  async submitScore(code:string){
    try {
      const index = this.scoreService.estimationScoreList.findIndex(x => x.code == code);
      const currentObject = this.scoreService.estimationScoreList[index];

      //transfer the value of current object to the modal
      const modalRef = this.scoreService.scoreModalService.open(SumbitScoreModalComponent);
      modalRef.componentInstance.code = currentObject.code;
      modalRef.componentInstance.title = currentObject.title;
      modalRef.componentInstance.estimate = currentObject.estimate;
      modalRef.componentInstance.creditPoint = currentObject.creditPoint;

      //get the result of edit-score-modal
      const result = await modalRef.result;

      //push the object to score list


      // Remove the transferred object from the estimationScoreList
      this.scoreService.estimationScoreList.splice(index, 1);
    }catch (err){
      console.log("Window closed...", err)
    }
  }
}
