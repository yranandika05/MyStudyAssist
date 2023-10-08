import {EventEmitter, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {CoursesList} from "../courses/CoursesList";
import {map, Observable, switchMap} from "rxjs";
import {TeacherList} from "../courses/TeacherList";
import {CalendarComponent} from "../calendar/calendar.component";

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private coursesLists: CoursesList[] = [];
  private teacherList:TeacherList[] = [];
  addModuleToCalendarEvent: EventEmitter<{ foundModule: any[], startDate: string, endDate: string }> = new EventEmitter<{ foundModule: any[], startDate: string, endDate: string }>();

  constructor(private apiService: ApiService) { }



  getModules(): Observable<CoursesList[]> {
    const studentId = sessionStorage.getItem('studentid');

    return this.apiService.get('modules/').pipe(
      switchMap((modules: any[]) => {
        return this.apiService.get('teachers/').pipe(
          switchMap((teachers: any[]) => {
            return this.apiService.get(`students/${studentId}`).pipe(
              map((student: any) => {
                const degreeProgramId = student.degreeprogramid;
                const coursesLists: CoursesList[] = [];
                console.log(teachers);
                modules.forEach((item: any) => {
                  if (item.degreeprogramid === degreeProgramId) {
                    const teacher = teachers.find((teacher: any) => teacher.teacherid === item.teacherid);
                    const course = new CoursesList(
                      item.moduleid,
                      item.number,
                      item.name,
                      item.description,
                      item.creditpoints,
                      item.address,
                      item.requirement,
                      item.semester,
                      item.teacherid,
                      teacher?.teachername ?? '',
                      item.facutliyid,
                      item.degreeprogramid
                    );
                    coursesLists.push(course);
                  }
                });

                console.log(coursesLists);
                return coursesLists;
              })
            );
          })
        );
      })
    );
  }

  getCoursesLists(): CoursesList[] {
    const storedCoursesList = sessionStorage.getItem('modules');
    if (storedCoursesList) {
      return JSON.parse(storedCoursesList);
    } else {
      return [];
    }
  }

  getModulePlan(): Observable<any[]> {
    return this.apiService.get('courses/').pipe(
      map((plan: any[]) => {
        return plan;
      })
    );
  }

  getModuleById(moduleId: number): CoursesList | undefined {
    const storedCoursesList = sessionStorage.getItem('modules');
    if (storedCoursesList) {
      const coursesLists: CoursesList[] = JSON.parse(storedCoursesList);
      const module = coursesLists.find(course => course.moduleid === moduleId);
      return module;
    } else {
      return undefined;
    }
  }

  getModuleByCode(code: string): CoursesList | undefined {
    const storedCoursesList = sessionStorage.getItem('modules');
    if (storedCoursesList) {
      const coursesLists: CoursesList[] = JSON.parse(storedCoursesList);
      const module = coursesLists.find(course => course.code === code);
      return module;
    } else {
      return undefined;
    }
  }
}
