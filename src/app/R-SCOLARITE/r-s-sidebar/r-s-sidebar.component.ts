import { Component, OnDestroy, OnInit } from '@angular/core';
import { Admin, Admin_role } from '../../Admin/Models/Admin';
import { PageTitleService } from '../../Services/page-title.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IconsService } from '../../Services/icons.service';
import { SchoolService } from '../../Services/school.service';
import { SideBarService } from '../../sidebar/side-bar.service';
import { filter, Subscription } from 'rxjs';
import { SchoolInfo } from '../../Admin/Models/School-info';
import { environment } from '../../../environments/environment';
import { AdminUSER } from '../../Admin/Models/Auth';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'app-r-s-sidebar',
  templateUrl: './r-s-sidebar.component.html',
  styleUrl: './r-s-sidebar.component.css'
})
export class RSSidebarComponent implements OnInit, OnDestroy {

  
  title!: string;
  isSidebarCollapsed = false;
  isSubmenuCollapsed = false;
  desable_add_button = true;
  showSearchInput: boolean = false
  showTitle: boolean = false

  show_admin: boolean = false
  isConfirm: boolean = false

  routerEventsSubscription!: Subscription;


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
 
  constructor(public auth: AuthServiceService, private schoolService: SchoolService, private sidebarService: SideBarService,
     private router: Router, public icons: IconsService, private route: ActivatedRoute){}

  
ngOnInit(): void {

  this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
    this.setTitle();
  });

  this.setTitle();
   this.load_school_info();
   this.load_admin();
}

setTitle(): void {
  let route = this.route.firstChild;

  while (route?.firstChild) {
    route = route.firstChild;
  }

  // Retrieve the title from the route data if it exists
  this.title = route?.snapshot.data['title'] || '';
  console.log(this.title, "le titre")
}
load_school_info(){
  this.schoolService.getSchools().subscribe(data => {
    this.school = data    
    // console.log(data, "----------------------------");
  })
}
// ------------------------------------------load current admin
load_admin(){
  this.dataAdmin = AdminUSER()?.scolarite;
  this.dataAdmin.urlPhoto = `${environment.urlPhoto}${this.dataAdmin.urlPhoto}`

}
// --------------------------------shearch 
  onSearchChange() {
    this.sidebarService.changeSearchTerm(this.searchTerm);
  }

  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }
  show_confirm(){
    this.isConfirm = true
   
  }
 close(){
  this.isConfirm = false;
 }

  ngOnDestroy() {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  toAccunt(){
    this.router.navigate(['/r-scolarite/my-accunt'], {queryParams:{id: this.dataAdmin.idAdministra}})
  }
}
