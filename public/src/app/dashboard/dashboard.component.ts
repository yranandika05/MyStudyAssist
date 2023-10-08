import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {ScoresService} from "../services/scores.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../services/language.service";
import {ScoresComponent} from "../scores/scores.component";
import {ModulesService} from "../services/modules.service";
import {ApiService} from "../services/api.service";
import {map, Observable, switchMap} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  progressVal: number = this.getTotalCreditPoint();
  percentage: number = (this.progressVal / 180) *100;
  dashoffsetVal: number = 472 - (472 * this.percentage / 100);

  module3Semester: any[] = [];
  totalCreditPoint: number;
  degreeProgramName: string = '';

  activityData: any[] = [];




  constructor(public scoreService: ScoresService, private moduleService: ModulesService, private translate: TranslateService, private languageService: LanguageService, private router: Router, private apiService: ApiService) {;
    this.translate.use(this.languageService.getSelectedLanguage());
    this.totalCreditPoint = 0;
    console.log(this.percentage)
  }


  ngOnInit(): void {
    this.translate.use(this.languageService.getSelectedLanguage());
    this.getModulesFrom3Semester();
    this.getStudentInfo().subscribe((degreeProgramName: string) => {
      this.degreeProgramName = degreeProgramName;
    });
    this.getStudentModulePlan();

  }


  private getScoresFromSessionStorage(): any[] {
    const storedScores = sessionStorage.getItem('scores');
    return storedScores ? JSON.parse(storedScores) : [];
  }


  getAverageScore(): number | null {
    const scores = this.getScoresFromSessionStorage();
    let scoresToAverage = scores.filter(item => !item.prediction);
    scoresToAverage = scoresToAverage.filter(item => item.passed);
    const totalScores = scoresToAverage.length;
    if (totalScores === 0) {
      return 0;
    }
    const totalWeightedScore = scoresToAverage.reduce((sum, item) => {
      const weightedScore = (item.percentage || 0) * (item.creditPoint || 0);
      return sum + weightedScore;
    }, 0);
    const totalCreditPoints = scoresToAverage.reduce((sum, item) => sum + (item.creditPoint || 0), 0);
    const averageScore = totalWeightedScore / totalCreditPoints;
    const roundedAverageScore = Math.round(averageScore);
    return this.scoreService.getGradeFromPercentage(roundedAverageScore);
  }

  getAveragePercentage(): number | null {
    const scores = this.getScoresFromSessionStorage();
    let scoresToAverage = scores.filter(item => !item.prediction);
    scoresToAverage = scoresToAverage.filter(item => item.passed);
    const totalScores = scoresToAverage.length;
    if (totalScores === 0) {
      return 0;
    }
    const totalWeightedScore = scoresToAverage.reduce((sum, item) => {
      const weightedScore = (item.percentage || 0) * (item.creditPoint || 0);
      return sum + weightedScore;
    }, 0);
    const totalCreditPoints = scoresToAverage.reduce((sum, item) => sum + (item.creditPoint || 0), 0);
    const averageScore = totalWeightedScore / totalCreditPoints;
    return Math.round(averageScore);
  }

  getTotalCreditPoint(): number {
    const scores = this.getScoresFromSessionStorage();
    let scoresToAverage = scores.filter(item => !item.prediction);
    scoresToAverage = scoresToAverage.filter(item => item.passed)
    this.totalCreditPoint = scoresToAverage.reduce((total, score) => total + score.creditPoint, 0);
    return this.totalCreditPoint;
  }


  course(){
    this.router.navigate(['/panel/courses'])
  }

  getModulesFrom3Semester() {
    const storedModules = sessionStorage.getItem('modules');
    if (storedModules) {
      const modules = JSON.parse(storedModules);
      const scoreList = this.scoreService.getScoresLists();
      const scoreCodes = scoreList.map((score) => score.code);

      this.module3Semester = modules.filter((module: any) => {
        const moduleCode = module.code;
        return module.semester >= 1 && module.semester <= 3 && !scoreCodes.includes(moduleCode);
      });
    } else {
      this.module3Semester = []; // Set an empty array if modules are not found in session storage
    }
  }

  getStudentInfo(): Observable<string> {
    const studentId = sessionStorage.getItem('studentid');
    return this.apiService.get(`students/${studentId}`).pipe(
      switchMap((student: any) => {
        return this.apiService.get('degreeprograms').pipe(
          map((degreePrograms: any[]) => {
            const degreeProgramId = student.degreeprogramid;
            const degreeProgram = degreePrograms.find((program: any) => program.degreeprogramid === degreeProgramId);
            return degreeProgram ? degreeProgram.name : '';
          })
        );
      })
    );
  }

  getStudentModulePlan() {
    const studentId = sessionStorage.getItem('studentid');
    let planData: any[] = [];

    this.apiService.get('plans/').subscribe((plan: any[]) => {
      const studentPlan = plan.filter(item => item.studentid == studentId);

      this.apiService.get('plancourses/').subscribe((planCourse: any[]) => {
        const studentPlanCourse = planCourse;

        this.apiService.get('courses/').subscribe((course: any[]) => {
          const courses = course;

          this.apiService.get('modules/').subscribe((module: any[]) => {
            const modules = module;

            this.apiService.get('types/').subscribe((type: any[]) => {
              const types = type;

              studentPlan.forEach((planItem) => {
                const filteredCourses = studentPlanCourse.filter(item => item.planid === planItem.planid);

                filteredCourses.forEach((course) => {
                  const matchingCourse = courses.find(c => c.courseid === course.courseid);
                  const matchingModule = modules.find(m => m.moduleid === matchingCourse.moduleid);
                  const matchingType = types.find(t => t.typeid === matchingCourse.typeid);

                  const data = {
                    planid: planItem.planid,
                    courseid: course.courseid,
                    number: matchingModule.number,
                    name: matchingModule.name,
                    type: matchingType.description,
                    room: matchingCourse.room,
                    day: this.getDayNumber(matchingCourse.day), // Convert day to number
                    starttime: matchingCourse.starttime,
                    endtime: matchingCourse.endtime,
                    startdate: planItem.startdate,
                    enddate: planItem.enddate
                  };
                  planData.push(data);
                });
              });

              console.log(planData);
              // Set the current date and time
              const currentTime = new Date();

              /* //manipulate current date and time to check the functioality of code
              currentTime.setFullYear(2023, 6, 5); // Set to June 5, 2023 (months are zero-based)
              currentTime.setHours(12, 0, 0); // Set to 12:00 AM
              console.log(currentTime);

               */

              // Get all activities occurring at the current time
              const upcomingActivities = planData.filter(data => this.isEventOccurringNow(data, currentTime));

              console.log(upcomingActivities);
              // Display the activities
              this.displayActivities(upcomingActivities);

            });
          });
        });
      });
    });
  }

  isEventOccurringNow(event: any, currentTime: Date): boolean {
    const eventStartTime = this.calculateDateTime(event.day, event.starttime, "start");
    const eventEndTime = this.calculateDateTime(event.day, event.endtime, "end");

    // Get the start and end dates of the plan
    const startDate = new Date(event.startdate);
    const endDate = new Date(event.enddate);


    // Check if today's date is within the start and end dates of the plan
    const isTodayInRange = currentTime >= startDate && currentTime <= endDate;

    // Check if the current time is within the event's time range and today is within the plan's date range
    return currentTime >= eventStartTime && currentTime <= eventEndTime && isTodayInRange;
  }

  calculateDateTime(day: number, time: string, status: string): Date {
    const currentDate = new Date(); // Create a new date object with the current date
    currentDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00

    // Calculate the target date based on the current day of the week and the target day
    const targetDate = currentDate.getDate() + (day - currentDate.getDay());
    currentDate.setDate(targetDate);

    // Extract the hours and minutes from the time string
    const [hours, minutes] = time.split(':').map(Number);

    // Set the hours and minutes to the target date
    if(status == "start"){
      currentDate.setHours(hours - 1, minutes);
    }else {
      currentDate.setHours(hours, minutes);
    }


    return currentDate;
  }
  displayActivities(activities: any[]) {
    if (activities && activities.length > 0) {
      this.activityData = activities.map(activity => ({
        title: activity.name,
        startTime: activity.starttime,
        endTime: activity.endtime,
        room: activity.room
      }));
    } else {
      this.activityData = []; // Set activityData to null when there are no upcoming activities
    }
  }

  getDayNumber(day: string): number {
    // Map the day string to corresponding number
    const dayMap: { [key: string]: number } = {
      Montag: 1,
      Dienstag: 2,
      Mittwoch: 3,
      Donnerstag: 4,
      Freitag: 5,
      Samstag: 6,
      Sonntag: 0
    };

    return dayMap[day] || 0; // Return 0 for unknown days
  }








}
