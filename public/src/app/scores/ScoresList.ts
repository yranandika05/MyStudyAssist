export class ScoresList{
  gradeId: number;
  studentId: number;
  moduleId: number;
  code: string;
  title?: string;
  passed: boolean;
  grade: number | null;
  percentage: number;
  prediction: boolean;
  estimate: number | null;
  creditPoint?: number;





  constructor(gradeId: number, studentId: number, moduleId:number, code: string, title: string,passed: boolean, grade: number | null, percentage: number,prediction: boolean, estimate: number | null, creditPoint: number) {
    this.gradeId = gradeId;
    this.studentId = studentId;
    this.moduleId = moduleId;
    this.code = code;
    this.title = title;
    this.passed = passed
    this.grade = grade;
    this.percentage = percentage;
    this.prediction = prediction;
    this.estimate = estimate;
    this.creditPoint = creditPoint;
  }
}
