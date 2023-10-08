import {Component, OnInit, ViewChild} from '@angular/core';
import {CalendarOptions, EventContentArg, EventInput, formatRange} from "@fullcalendar/core";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CalendarModalComponent} from "../calendar-modal/calendar-modal.component";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {ModulesService} from "../services/modules.service";
import {ApiService} from "../services/api.service";


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],

})
export class CalendarComponent implements OnInit{
  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;
  events: EventInput = [];
  isMonthView: boolean = true;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    //dateClick: this.handleDateClick.bind(this), // MUST ensure `this` context is maintained
    eventContent: this.handleEventContent.bind(this),
    events: this.events,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    },
    displayEventEnd: true,
    headerToolbar: {
      start: 'title',
      center: 'today prev,next',
      end: 'dayGridMonth,dayGridWeek' // Add the view buttons to the header
    },
    eventDisplay: 'block',
  }
  constructor(public modal : NgbModal, private moduleService: ModulesService, private apiService: ApiService) {
  }
  ngOnInit(): void {
    this.getStudentModulePlan();
  }

  async handleDateClick(arg: any) {
    try{
      const result = await this.modal.open(CalendarModalComponent).result;
      const eventBackgroundColor = result.isModule ? 'blue' : 'orange';
      let Data: EventInput = {};
      if(result.isModule){
        const selectedDate = new Date(arg.dateStr);
        const dayOfWeek = selectedDate.getDay();
        console.log("hari= " + dayOfWeek);
        Data = {
          title:result.title,
          startRecur: arg.dateStr + result.start,
          endRecur: result.end,
          startTime: result.startTime,
          endTime: result.endTime,
          daysOfWeek: [dayOfWeek],
          recurring: 'true',
          borderColor: eventBackgroundColor,
          backgroundColor: eventBackgroundColor
        };
      }else{
        Data = {
          title:result.title,
          start: arg.dateStr + 'T' + result.startTime,
          end: arg.dateStr + 'T' + result.endTime,
          borderColor: eventBackgroundColor,
          backgroundColor: eventBackgroundColor
        };
      }

      this.events = [...(<EventInput[]>this.events), Data];
      this.calendarOptions.events = this.events;
      console.log(this.events);
    } catch (err){
      console.log("window closed...", err);
    }
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
              this.addPlanToCalendar(planData, 'red');
              console.log(planData); // List of objects with planid, courseid, number, name, type, room, day, starttime, endtime, startdate, enddate
            });
          });
        });
      });
    });
  }

  addPlanToCalendar(planData: any[], color: string) {
    planData.forEach((data) => {
      const eventBackgroundColor = color; // Set the desired background color for the event


      const eventData = {
        title:data.name,
        startRecur: data.startdate + 'T' + data.starttime,
        endRecur: data.enddate + 'T' + data.endtime,
        startTime: data.starttime,
        endTime: data.endtime,
        daysOfWeek: [data.day],
        recurring: 'true',
        borderColor: eventBackgroundColor,
        backgroundColor: eventBackgroundColor,
        extendedProps: {
          room: data.room,
          type: data.type
        }
      };

      this.events = [...(<EventInput[]>this.events), eventData];
    });

    this.calendarOptions.events = this.events;
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
      Sonntag: 7
    };

    return dayMap[day] || 0; // Return 0 for unknown days
  }
  handleEventContent(arg: EventContentArg) {
    const { event } = arg;

    const room = event.extendedProps['room'];
    const type = event.extendedProps['type'];
    const start = event.start as Date; // Type assertion to ensure event.start is a Date object
    const end = event.end as Date; // Type assertion to ensure event.end is a Date object
    const startTime = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
    const endTime = end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
    const roomHTML = room ? `<div>room: ${room}</div>` : '';
    const typeHTML = type ? `<div>${type}</div>` : '';

    const eventContent = `
    <div>
      <div>${event.title}</div>
      <div>${startTime} - ${endTime}</div>
      ${typeHTML}
      ${roomHTML}
    </div>
  `;

    const eventContentElement = document.createElement('div');
    eventContentElement.innerHTML = eventContent;

    return { domNodes: [eventContentElement] };
  }

}
