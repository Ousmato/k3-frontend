import { Injectable } from '@angular/core';
import { faUsers, faGear, faTable, faChartArea, faHome, faBars, faGraduationCap, faSchool, faUser, faCog, faAngleDown, faSearch, faBookOpen, faAngleUp, faEye, faTrashCan, faEdit, faPenToSquare, faArrowRight, faClock, faPlus, faCalendarCheck, faTrash, faHandHoldingDollar, faPaperPlane, faCircleChevronRight, faPlusCircle, faSquarePlus, faFolderOpen, faSquareCheck, faSquareXmark, faArrowsLeftRight, faArrowRightArrowLeft, faFolder, faBan, faXmark, faRotate, faRotateRight, faEyeSlash, faArrowLeft, faAngleRight, faAngleLeft, faSignOut } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  actualise = faRotateRight
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
  nexte = faAngleRight
  previous = faAngleLeft
  clock = faClock
  plus = faPlus
  squarePlus = faSquarePlus
  cl_check = faCalendarCheck
  dollar = faHandHoldingDollar
  send = faPaperPlane
  nexte_circle = faCircleChevronRight
  archive = faFolderOpen
  active = faSquareCheck
  desactive = faSquareXmark
  arrow = faArrowRightArrowLeft
  recherche = faSearch
  folder = faFolder
  notFound = faBan
  xmark = faXmark
  eyeSlash = faEyeSlash
  back = faArrowLeft
  book = faBookOpen
  aout =faSignOut
  constructor() { }
}
