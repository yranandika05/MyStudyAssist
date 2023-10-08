import { Injectable } from '@angular/core';
import {ScoresList} from "../scores/ScoresList";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ApiService} from "./api.service";
import {SessionService} from "./session.service";
import {ModulesService} from "./modules.service";
import {map, Observable} from "rxjs";
import {CoursesList} from "../courses/CoursesList";

@Injectable({
  providedIn: 'root'
})
export class ScoresService {
  serverAddress = ''; //SERVER address
  scoreList: ScoresList[] = [];
  estimationScoreList: ScoresList[] = [];

  constructor(
    public scoreModalService: NgbModal,
    private http: HttpClient,
    private httpService: ApiService,
    private session: SessionService,
    private apiService: ApiService,
    private moduleService: ModulesService
    ) {  }

  getScores(): Observable<ScoresList[]> {
    const studentId = sessionStorage.getItem('studentid');
    return this.apiService.get(`grades/studentid/${studentId}`).pipe(
      map((response: any[]) => {
        const scoreList: ScoresList[] = [];
        response.forEach((score: any) => {
          const module = this.moduleService.getModuleById(score.moduleid);
          const scoreItem = new ScoresList(
            score.gradeid,
            score.studentid,
            score.moduleid,
            module?.code ?? '',
            module?.title ?? '',
            score.passed,
            score.grade,
            score.pervent,
            score.prediction,
            score.estimate,
            module?.creditPoint ?? 0
          );
          scoreList.push(scoreItem);
        });
        return scoreList;
      })
    );
  }

  getScoreById(scoreId: number): ScoresList | undefined {
    console.log('Searching for score with ID:', scoreId);
    const storedCoursesList = sessionStorage.getItem('scores');
    if (storedCoursesList) {
      const scoreList: ScoresList[] = JSON.parse(storedCoursesList);
      const score = scoreList.find(score => score.gradeId === scoreId);
      console.log('Found Score:', score);
      return score;
    } else {
      return undefined;
    }
  }


  addScore(payload: any): Observable<any> {
    return new Observable((observer) => {
      this.apiService.post(payload, 'grades/').subscribe(
        () => {
          // Remove scores from session storage
          sessionStorage.removeItem('scores');

          // Fetch updated scores from the database
          this.getScores().subscribe((scores) => {
            // Store the scores using SessionService
            this.session.setItem('scores', scores, true);
            observer.next();
            observer.complete();
          });
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getScoresLists(): ScoresList[] {
    const storedScore = sessionStorage.getItem('scores');
    if (storedScore) {
      return JSON.parse(storedScore);

    } else {
      return [];
    }
  }

  delScore(gradeId: number){
    this.apiService.delete(`grades/${gradeId}/`).subscribe(
      () => {
        console.log('Score deleted successfully');
        sessionStorage.removeItem('scores');
        this.getScores().subscribe((scores) => {
          // Store the scores using SessionService
          this.session.setItem('scores', scores, true);
        });
      },
      (error: any) => {
        console.log('Error deleting score:', error);
      });
  }

  updateScore(payload: any, gradeId: number){
    this.apiService.put(payload, `grades/${gradeId}/`).subscribe(
      () => {
        console.log('Score updated successfully');
        sessionStorage.removeItem('scores');
        this.getScores().subscribe((scores) => {
          // Store the scores using SessionService
          this.session.setItem('scores', scores, true);
        });
      },
      (error: any) => {
        console.log('Error deleting score:', error);
      });
  }

  getGradeFromPercentage(percentageScore: number | null): number | null{
    if (percentageScore == null) {
      return null;
    } else if (percentageScore >= 95.0) {
      return 1;
    } else if (percentageScore >= 93.5) {
      return 1.1;
    } else if (percentageScore >= 92.0) {
      return 1.2;
    } else if (percentageScore >= 90.5) {
      return 1.3;
    } else if (percentageScore >= 89.0) {
      return 1.4;
    } else if (percentageScore >= 87.5) {
      return 1.5;
    } else if (percentageScore >= 86.0) {
      return 1.6;
    } else if (percentageScore >= 84.5) {
      return 1.7;
    } else if (percentageScore >= 83.0) {
      return 1.8;
    } else if (percentageScore >= 81.5) {
      return 1.9;
    } else if (percentageScore >= 80.0) {
      return 2;
    } else if (percentageScore >= 77.0) {
      return 2.2;
    } else if (percentageScore >= 75.5) {
      return 2.3;
    } else if (percentageScore >= 74.0) {
      return 2.4;
    } else if (percentageScore >= 72.5) {
      return 2.5;
    } else if (percentageScore >= 71.0) {
      return 2.6;
    } else if (percentageScore >= 69.5) {
      return 2.7;
    } else if (percentageScore >= 68.0) {
      return 2.8;
    } else if (percentageScore >= 66.5) {
      return 2.9;
    } else if (percentageScore >= 65.0) {
      return 3;
    } else if (percentageScore >= 63.5) {
      return 3.1;
    } else if (percentageScore >= 62.0) {
      return 3.2;
    } else if (percentageScore >= 60.5) {
      return 3.3;
    } else if (percentageScore >= 59.0) {
      return 3.4;
    } else if (percentageScore >= 57.5) {
      return 3.5;
    } else if (percentageScore >= 56.0) {
      return 3.6;
    } else if (percentageScore >= 54.5) {
      return 3.7;
    } else if (percentageScore >= 53.0) {
      return 3.8;
    } else if (percentageScore >= 51.5) {
      return 3.9;
    } else if (percentageScore >= 50) {
      return 4;
    } else {
      return 5;
    }
  }

}

