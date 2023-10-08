import { Component, OnInit } from '@angular/core';
import {ModulesService} from "../services/modules.service";
import {CoursesList} from "./CoursesList";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModulToCalendarModalComponent} from "../modul-to-calendar-modal/modul-to-calendar-modal.component";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  coursesLists: CoursesList[] = []; //store the list of modules
  public filteredCourses: CoursesList[] = []; //store the list of modules based on search
  foundModulePlan: any[] = []; // store data of spesific modules
  planData: any[] = []; // store data of plan and plancourses

  public searchTerm: string = '';
  public selectedSemester: string = '';

  isModuleAddedToCalendar: boolean = false;

  constructor(private moduleService: ModulesService, public modal : NgbModal, private apiService: ApiService) { }

  ngOnInit() {
    this.coursesLists = this.moduleService.getCoursesLists();
    this.filteredCourses = this.coursesLists;
    this.getStudentModulePlan();
  }

  //filter the course based on title or code
  filterCourse() {
    this.filteredCourses = this.coursesLists.filter(course =>
      course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Apply additional filtering based on selected semester
    if (this.selectedSemester) {
      this.filteredCourses = this.filteredCourses.filter(course =>
        course.semester.toString() === this.selectedSemester
      );
    }
  }

  //filter the course based on semester
  filterCoursesBySemester(selectedSemester: string) {
    this.selectedSemester = selectedSemester;
    this.filterCourse();
  }

  //post the selected modul to database. post extra detail of start date and end date
  addToCalendar(moduleId: number) {

    // Get all courses and filter them by module ID
    this.moduleService.getModulePlan().subscribe(async (plan: any[]) => {
      this.foundModulePlan = plan.filter(item => item.moduleid === moduleId);


      // Open modul-to-calendar-modal
      try {
        const modalRef = this.modal.open(ModulToCalendarModalComponent);
        modalRef.componentInstance.title = moduleId;
        const result = await modalRef.result;
        const studentId = sessionStorage.getItem('studentid');
        const payload = {
          startdate: result.startDate,
          enddate: result.endDate,
          studentid: studentId,
        };

        // Add data to plans
        this.apiService.postFormData(payload, 'plans/').subscribe((response: any) => {
          const planId = response.planid; // Extract the planid from the response object

          // Loop through the foundModulePlan and post each course to plancourses
          this.foundModulePlan.forEach(course => {
            const plancoursePayload = {
              planid: planId,
              courseid: course.courseid,
            };

            // Add data to plancourses
            this.apiService.postFormData(plancoursePayload, 'plancourses/').subscribe((response: any) => {
            }, (error: any) => {
              console.log('add plancourse failed', error);
            });
          });
          alert("erfolgreich zum Kalender hinzufügen, bitte neu laden")
        }, (error: any) => {
          console.log('add plan failed', error);
        });


      } catch (err) {
        console.log('window closed...', err);
      }
    });


  }

  //delete plans and plancourses from database
  deleteFromCalendar(module: any) {
    this.apiService.get('courses/').subscribe((courses: any) =>{
      this.apiService.get('plancourses/').subscribe((plancourses: any) => {
        const foundCourse = courses.find((course: any) => course.moduleid === module.moduleid);
        const matchingPlanCourses = plancourses.filter((plancourse: any) => plancourse.courseid === foundCourse.courseid);
        const matchingPlanIds = matchingPlanCourses.map((plancourse: any) => plancourse.planid);

        this.apiService.delete(`plans/${matchingPlanIds[0]}/`).subscribe(() =>{
         alert("Erfolgreich aus dem Kalender entfernen, bitte neu laden")
        })
      })
    })
  }


  //Get plans and plancourses from database and store it in an array.
  // It also set the value of isModuleAddedToCalendar from modules in CourseList to true if the modules is in the planData
  getStudentModulePlan() {
    const studentId = sessionStorage.getItem('studentid');


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
                    day: matchingCourse.day,
                    starttime: matchingCourse.starttime,
                    endtime: matchingCourse.endtime,
                    startdate: planItem.startdate,
                    enddate: planItem.enddate
                  };
                  this.planData.push(data);
                });
              });
              this.coursesLists.forEach(course => {
                const foundModule = this.planData.find(module => module.number === course.code);
                if (foundModule) {
                  course.isModuleAddedToCalendar = true;
                }
              });
            });
          });
        });
      });
    });
  }




}
