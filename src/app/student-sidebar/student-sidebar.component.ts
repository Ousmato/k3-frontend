import { Component } from '@angular/core';
import { faBars, faHome, faUser, faCog, faUsers, faAngleDown, 
  faSearch, faBookOpen, faTable, faChartArea, faAngleUp, faGraduationCap, faSchool } from '@fortawesome/free-solid-svg-icons';




@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrl: './student-sidebar.component.css'
})
export class StudentSidebarComponent {
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


  isSidebarCollapsed = false;
  isSubmenuCollapsed = false;
  isSubMenuOpen = {
    enseignants: false,
    etudiants: false
  };

 
  
isSubMenuVisible: boolean = false;

toggleSubMenuEnseignant() {
  this.isSubMenuOpen.enseignants = !this.isSubMenuOpen.enseignants
}

toggleSubMenuStudent(){
  this.isSubMenuOpen.etudiants = !this.isSubMenuOpen.etudiants
}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    const sidebar = document.getElementById('sidebar');
    if (this.isSidebarCollapsed) {
      sidebar!.classList.add('active');
    } else {
      sidebar!.classList.remove('active');
    }
  }
}
