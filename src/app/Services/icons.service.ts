import { Injectable } from '@angular/core';
import { faUsers, faGear, faTable, faChartArea, faHome, faBars, faGraduationCap, faSchool, faUser, faCog, faAngleDown, faSearch, faBookOpen, faAngleUp, faEye, faTrashCan, faEdit, faPenToSquare, faArrowRight, faClock, faPlus, faCalendarCheck, faTrash, faHandHoldingDollar, faPaperPlane, faCircleChevronRight, faPlusCircle, faSquarePlus, faFolderOpen, faSquareCheck, faSquareXmark, faArrowsLeftRight, faArrowRightArrowLeft, faFolder, faBan, faXmark, faRotate, faRotateRight, faEyeSlash, faArrowLeft, faAngleRight, faAngleLeft, faSignOut, faList, faCableCar, faCalendarDay, faCalendarPlus, faUserPlus, faCloudArrowUp, faCreditCard, faUsersViewfinder, faFilePdf, faHandPointDown, faCircleCheck, faMinusCircle, faBoxArchive, faFileImport, faUserCheck, faCircleXmark, faTriangleExclamation, faCheckDouble, faSortUp, faSortDown, faCircle, faImage } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  image = faImage
  circle = faCircle
  sortUp = faSortUp
  sortDown = faSortDown
  error = faTriangleExclamation
  sucess = faCheckDouble
  userCheck = faUserCheck
  importFile =faFileImport
  boxarchive = faBoxArchive;
  actualise = faRotateRight
  menu = faBars; grade = faGraduationCap;
  home = faHome; scool = faSchool;
  user = faUser;
  mimus = faMinusCircle;
  plusCircle = faPlusCircle
  setting = faCog;
  users = faUsers;
  angleDown = faAngleDown;
  search = faSearch;
  bookOpen = faBookOpen;
  table = faTable;
  had_point_down = faHandPointDown
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
  circle_xmark = faCircleXmark
  eyeSlash = faEyeSlash
  back = faArrowLeft
  book = faBookOpen
  aout =faSignOut
  list = faList
  calandarday = faCalendarDay
  calandarPlus = faCalendarPlus
  user_plus = faUserPlus
  upload = faCloudArrowUp
  credit_card = faCreditCard
  user_surveillance = faUsersViewfinder
  pdf = faFilePdf
  circle_check = faCircleCheck
  constructor() { }
}
