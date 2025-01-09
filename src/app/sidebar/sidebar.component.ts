import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SideBarService } from './side-bar.service';
import { IconsService } from '../Services/icons.service';
import { SchoolService } from '../Services/school.service';
import { SchoolInfo } from '../Admin/Models/School-info';
import { Admin, Admin_role, AdminRoleDto } from '../Admin/Models/Admin';
import { PageTitleService } from '../Services/page-title.service';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MyAccuntComponent } from '../DG/my-accunt/my-accunt.component';
import { EventServiceService } from '../Services/event-service.service';
import { environment } from '../../environments/environment';
import { AuthServiceService } from '../auth-service.service';
import { AdminUSER } from '../Admin/Models/Auth';
import { AdminService } from '../Services/admin.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  title!: string;
  imageUrl!: string;
  isSidebarCollapsed = false;
  isSubmenuCollapsed = false;
  showSearchInput: boolean = false
  isConfirm: boolean = false

  show_admin: boolean = false

  routerEventsSubscription!: Subscription;

  searchTerm: string = '';
  postes: AdminRoleDto[] = [];

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
    this.isSubMenuOpen.etudiants = false
  }

  toggleSubMenuStudent() {
    this.isSubMenuOpen.etudiants = !this.isSubMenuOpen.etudiants
    this.isSubMenuOpen.enseignants = false
  }

  toggleSubMenuArchive() {
    this.isSubMenuOpen.archive = !this.isSubMenuOpen.archive
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
    private eventService: EventServiceService, private adminService: AdminService,
    private router: Router, public icons: IconsService, private route: ActivatedRoute) { }


  ngOnInit(): void {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        this.setTitle();
      });


    this.imageUrl = this.dataAdmin?.urlPhoto || 'assets/business-professional-icon.svg';

    this.load_school_info();
    this.load_admin();
    //  this.loa_page_title();
    this.setTitle()

    this.eventService.event$.subscribe((value: any) => {
      console.log('Événement reçu via le service:', value);
      this.refreshAdmin(value);
      this.load_admin();
    })
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
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }

  load_school_info() {
    this.schoolService.getSchools().subscribe(data => {
      this.school = data
      this.school.urlPhoto = `${environment.urlPhoto}${this.school.urlPhoto}`
      // console.log(data, "----------------------------");
    })
  }
  toggleAdminView(idAdmin: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idAdmin },
      // skipLocationChange: true
    }
    this.router.navigate(['/sidebar/my-accunt'], navigationExtras);
  }
  // ------------------------------------------load current admin
  load_admin() {
    // const admin = sessionStorage.getItem('user');
    // // console.log("admin :", admin)
    // if (admin) {

      this.dataAdmin = AdminUSER()?.admin;
      

      this.dataAdmin.urlPhoto = `${environment.urlPhoto}${this.dataAdmin.urlPhoto}`
      this.adminService.getPostesByIdCurrentAdmin(this.dataAdmin.idAdministra!).subscribe(res =>{
        this.postes = res
        console.log(this.postes, "postes")
      })
    // }
  }
 
  // --------------------------------shearch 
  onSearchChange() {
    this.sidebarService.changeSearchTerm(this.searchTerm);
  }

  show_adminSetting() {
    this.show_admin = !this.show_admin

  }
  close() {
    this.isConfirm = false
  }

  ngOnDestroy() {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  show_confirm() {
    this.isConfirm = true
  }
  refreshAdmin(admin: Admin) {
    console.log('Refreshing', admin)
    if (this.abreviateName(admin.idRole.nom) === Admin_role.DG.toString().toUpperCase()) {
      const adminDataString = JSON.stringify(admin)
      sessionStorage.setItem("user", adminDataString);
      return
    }
    // sessionStorage.clear();

  }

  // got to notifications
  toNotifications(){
    this.router.navigate(['/sidebar/notifications']);
  }

  // abrevigate name
  abreviateName(filiere: string): string {
    const nameWord = filiere.split(' ');
    const word = nameWord.filter(wd => wd.length > 3).map(word => word[0].toUpperCase()).join('')
    return word;
  }
}

