import { Component, Input, OnInit } from '@angular/core';
import { SideBarService } from './side-bar.service';
import { IconsService } from '../Services/icons.service';
import { SetService } from '../Admin/Views/settings/set.service';
import { SchoolService } from '../Services/school.service';
import { SchoolInfo } from '../Admin/Models/School-info';
import { Admin } from '../Admin/Models/Admin';
import { PageTitleService } from '../Services/page-title.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  title!: string;
  isSidebarCollapsed = false;
  isSubmenuCollapsed = false;

  school!: SchoolInfo;
  dataAdmin!: Admin

  
  isSubMenuOpen = {
    enseignants: false,
    etudiants: false,
    archive: false
  };

 
  
isSubMenuVisible: boolean = false;

toggleSubMenuEnseignant() {
  this.isSubMenuOpen.enseignants = !this.isSubMenuOpen.enseignants
}

toggleSubMenuStudent(){
  this.isSubMenuOpen.etudiants = !this.isSubMenuOpen.etudiants
}

toggleSubMenuArchive(){
  this.isSubMenuOpen.archive =!this.isSubMenuOpen.archive
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
 
  constructor(private pageTitle: PageTitleService, private schoolService: SchoolService,
     private settingService: SetService, public icons: IconsService){}

  
ngOnInit(): void {
   this.load_school_info();
   this.load_admin();
   this.loa_page_title();
}

refresh(){
  window.location.reload();
}
load_school_info(){
  this.schoolService.getSchools().subscribe(data => {
    this.school = data
    this.school.urlPhoto = "http://localhost/StudentImg/"+this.school.urlPhoto
    // console.log(data, "----------------------------");
  })
}
loa_page_title(){
  this.pageTitle.title$.subscribe(title => {
    this.title = title;
  });
}
// ------------------------------------------load current admin
load_admin(){
  const admin = localStorage.getItem('admin');
  if(admin){
    
    this.dataAdmin = JSON.parse(admin);
    this.dataAdmin.urlPhoto = "http://localhost/StudentImg/"+this.dataAdmin.urlPhoto
  }
}
}

