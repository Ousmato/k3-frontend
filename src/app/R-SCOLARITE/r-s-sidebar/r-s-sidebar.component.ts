import { Component, OnDestroy, OnInit } from '@angular/core';
import { Admin, Admin_role, AdminRoleDto } from '../../Admin/Models/Admin';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IconsService } from '../../Services/icons.service';
import { SchoolService } from '../../Services/school.service';
import { SideBarService } from '../../sidebar/side-bar.service';
import { filter, Subscription } from 'rxjs';
import { SchoolInfo } from '../../Admin/Models/School-info';
import { environment } from '../../../environments/environment';
import { AdminUSER } from '../../Admin/Models/Auth';
import { AuthServiceService } from '../../auth-service.service';
import { AdminService } from '../../Services/admin.service';
import { EventServiceService } from '../../Services/event-service.service';
import { utils } from '../../administrations/shared/utils/utils';

@Component({
  selector: 'app-r-s-sidebar',
  templateUrl: './r-s-sidebar.component.html',
  styleUrl: './r-s-sidebar.component.css'
})
export class RSSidebarComponent implements OnInit {

  isSubmenuCollapsed = false;
  isSwitch = false;

  postes: AdminRoleDto[] = []
  show_admin: boolean = false
  isConfirm: boolean = false
  urlAsset = `${environment.urlAssetsImage}`
  dataAdmin!: Admin


  isSubMenuOpen = {
    DGA: false,
    DER: false,
    archive: false
  };



  isSubMenuVisible: boolean = false;

  sidebar: any

  constructor(public auth: AuthServiceService, private adminService: AdminService,
    private router: Router, public icons: IconsService, public utils: utils) { }


  ngOnInit(): void {
    this.sidebar = document.getElementById('sidebar');
    this.adminService.getPostesByIdCurrentAdmin(this.dataAdmin.idAdministra!).subscribe(res => {
      this.postes = res
      console.log(this.postes, "postes")
    })

  }


  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = `${this.urlAsset}business-professional-icon.svg`;
  }
  show_confirm() {
    this.isConfirm = true

  }
  close() {
    this.isConfirm = false;
  }

  toAccunt() {
    this.router.navigate(['/r-scolarite/my-accunt'], { queryParams: { id: this.dataAdmin.idAdministra } })
  }


  submenuOpen() {
    this.isSubMenuVisible = !this.isSubMenuVisible
  }
  switchAccuntDGA() {
    this.isSwitch = !this.isSwitch

    this.isSubMenuOpen.DGA = !this.isSubMenuOpen.DGA
    this.isSubMenuOpen.DER = false
  }

  switchToDER() {
    this.isSubMenuOpen.DER = !this.isSubMenuOpen.DER
    this.isSubMenuOpen.DGA = false
  }

  toggleSubMenuArchive() {
    this.isSubMenuOpen.archive = !this.isSubMenuOpen.archive
  }

}
