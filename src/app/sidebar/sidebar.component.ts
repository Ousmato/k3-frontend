import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Admin, Admin_role, AdminRoleDto } from '../administrations/shared/models/Admin';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthServiceService } from '../auth-service.service';
import { IconsService } from '../Services/icons.service';
import { getUser } from '../administrations/shared/models/auth';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit{
 
  isConfirm: boolean = false

  show_admin: boolean = false

  sidebar: any
  dataAdmin!: Admin
  urlAsset = environment.urlAssetsImage

  constructor(public auth: AuthServiceService,
    
    private router: Router, public icons: IconsService, private route: ActivatedRoute) { }


  ngOnInit(): void {

    this.sidebar = document.getElementById('sidebar');
    this.dataAdmin = getUser()
    this.dataAdmin.urlPhoto = `${environment.urlPhoto}${this.dataAdmin.urlPhoto}`
    console.log(this.dataAdmin.urlPhoto, 'urlPhoto')

  }
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = `${this.urlAsset}business-professional-icon.svg`;
  }
  toggleAdminView(idAdmin: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idAdmin },
      // skipLocationChange: true
    }
    this.router.navigate(['/sidebar/my-accunt'], navigationExtras);
  }

  show_adminSetting() {
    this.show_admin = !this.show_admin

  }
  close() {
    this.isConfirm = false
  }


  show_confirm() {
    this.isConfirm = true
  }
  // refreshAdmin(admin: Admin) {
  //   console.log('Refreshing', admin)
  //   if (this.abreviateName(admin.idRole.nom) === Admin_role.DG.toString().toUpperCase()) {
  //     const adminDataString = JSON.stringify(admin)
  //     sessionStorage.setItem("user", adminDataString);
  //     return
  //   }
  //   // sessionStorage.clear();

  // }

}

