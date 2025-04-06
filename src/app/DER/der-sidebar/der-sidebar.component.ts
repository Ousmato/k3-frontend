import { Component, EnvironmentInjector, OnDestroy, OnInit } from '@angular/core';
import { Admin, Admin_role } from '../../Admin/Models/Admin';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PageTitleService } from '../../Services/page-title.service';
import { IconsService } from '../../Services/icons.service';
import { SchoolService } from '../../Services/school.service';
import { SideBarService } from '../../sidebar/side-bar.service';
import { SchoolInfo } from '../../Admin/Models/School-info';
import { filter, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUSER } from '../../Admin/Models/Auth';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'app-der-sidebar',
  templateUrl: './der-sidebar.component.html',
  styleUrl: './der-sidebar.component.css'
})
export class DerSidebarComponent implements OnInit, OnDestroy {

  urlAsset = environment.urlAssetsImage
  title!: string;
  isSubmenuCollapsed = false;
  desable_add_button = true;
  showSearchInput: boolean = false
  isConfirm: boolean = false
  urlLogo = ""
  sidebar: any

  show_admin: boolean = false
  show_add_form: boolean = false

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

 
 
  constructor(public auth: AuthServiceService, private schoolService: SchoolService, private sidebarService: SideBarService,
     private router: Router, public icons: IconsService, private route: ActivatedRoute){}

 
ngOnInit(): void {
  this.sidebar =  document.getElementById('sidebar');
  this.urlLogo = environment.assetUrlLogo
  this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
    this.setTitle();
  });

  this.setTitle();
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
// ------------------------------------------load current admin
load_admin(){
  this.dataAdmin = AdminUSER()?.der
    this.dataAdmin.urlPhoto = `${environment.urlPhoto}${this.dataAdmin.urlPhoto}`
}
// --------------------------------shearch 
  onSearchChange() {
    this.sidebarService.changeSearchTerm(this.searchTerm);
  }

  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = `${this.urlAsset}business-professional-icon.svg`;
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
    this.router.navigate(['/der/my-accunt'], {queryParams:{id: this.dataAdmin.idAdministra}})
  }


}
