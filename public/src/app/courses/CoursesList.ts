export class CoursesList{
  moduleid: number;
  code: string;
  title: string;
  description: string;
  creditPoint: number;
  address: string;
  requirement: string;
  semester: number;
  teacherId: number;
  teacherName: string;
  facultyId: number;
  degreeProgramId: number;
  isModuleAddedToCalendar: boolean;

  constructor(moduleid: number, code: string, title: string, description: string, creditPoint: number, address: string, requirement: string, semester: number, teacherId: number, teacherName: string, facultyId: number, degreeProgramId: number) {
    this.moduleid = moduleid;
    this.code = code;
    this.title = title;
    this.description = description;
    this.creditPoint = creditPoint;
    this.address = address;
    this.requirement = requirement;
    this.semester = semester;
    this.teacherId = teacherId;
    this.teacherName = teacherName;
    this.facultyId = facultyId;
    this.degreeProgramId = degreeProgramId;
    this.isModuleAddedToCalendar = false;
  }
}
