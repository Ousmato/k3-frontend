import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SideBarService } from './side-bar.service';
import { IconsService } from '../Services/icons.service';
import { SchoolService } from '../Services/school.service';
import { SchoolInfo } from '../Admin/Models/School-info';
import { Admin } from '../Admin/Models/Admin';
import { PageTitleService } from '../Services/page-title.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  title!: string;
  isSidebarCollapsed = false;
  isSubmenuCollapsed = false;
  showSearchInput: boolean = false
  showTitle: boolean = false

  show_admin: boolean = false
  show_add_form: boolean = false

  routerEventsSubscription!: Subscription;

  component_Name: string [] = ['_EnseignantComponent',  '_EtudiantsComponent', '_TeachersPresenceComponent', '_FichePaieComponent', '_ArchivesComponent']
 

  searchTerm: string = '';

  school?: SchoolInfo;
  dataAdmin!: Admin

  
  isSubMenuOpen = {
    enseignants: false,
    etudiants: false,
    archive: false
  };

 
  
isSubMenuVisible: boolean = false;

toggleSubMenuEnseignant() {
  this.isSubMenuOpen.enseignants = !this.isSubMenuOpen.enseignants
  this.isSubMenuOpen.etudiants  = false
}

toggleSubMenuStudent(){
  this.isSubMenuOpen.etudiants = !this.isSubMenuOpen.etudiants
  this.isSubMenuOpen.enseignants = false
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
 
  constructor(private pageTitle: PageTitleService, private schoolService: SchoolService, private sidebarService: SideBarService,
     private router: Router, public icons: IconsService, private route: ActivatedRoute){}

  
ngOnInit(): void {

  this.routerEventsSubscription = this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      // Vérifier la route active
      const childRoute = this.route.firstChild;
      if (childRoute) {
        const componentName: any = childRoute.snapshot.component?.name; 
        console.log(componentName, "nam componenrt")
        this.showSearchInput = false; // Par défaut, masquer la barre de recherche
        for (let cn of this.component_Name) {
          if (cn === componentName) {
            this.showSearchInput = true;
          
            break;
          } else{
            this.showTitle = true
          }
        }
      } 
    }
  });

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
    console.log(this.title, "sid tit")
  });
}
// ------------------------------------------load current admin
load_admin(){
  const admin = sessionStorage.getItem('admin');
  if(admin){
    
    this.dataAdmin = JSON.parse(admin);
    this.dataAdmin.urlPhoto = "http://localhost/StudentImg/"+this.dataAdmin.urlPhoto
  }
}
// --------------------------------shearch 
  onSearchChange() {
    this.sidebarService.changeSearchTerm(this.searchTerm);
  }

  show_adminSetting(){
    this.show_admin =! this.show_admin
   
  }
 close(){
  this.show_admin = false
 }

  ngOnDestroy() {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }


}

