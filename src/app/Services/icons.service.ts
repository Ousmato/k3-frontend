import { Injectable } from '@angular/core';
import { faUsers, faGear, faTable, faChartArea, faHome, faBars, faGraduationCap, faSchool, faUser, faCog, faAngleDown, faSearch, faBookOpen, faAngleUp, faEye, faTrashCan, faEdit, faPenToSquare, faArrowRight, faClock, faPlus, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  menu = faBars; grade = faGraduationCap;
  home = faHome; scool = faSchool;
  user = faUser;
  setting = faCog;
  users = faUsers;
  angleDown = faAngleDown;
  search = faSearch;
  bookOpen = faBookOpen;
  table = faTable;
  chartArea = faChartArea;
  angleUp = faAngleUp
  eye = faEye
  delete = faTrashCan
  edit = faPenToSquare
  next = faArrowRight
  clock = faClock
  plus = faPlus
  cl_check = faCalendarCheck
  constructor() { }
}
