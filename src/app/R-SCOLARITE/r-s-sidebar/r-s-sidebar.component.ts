import { Component, inject, OnInit } from '@angular/core';
import { Admin, AdminRoleDto } from '../../administrations/shared/models/Admin';

import { environment } from '../../../environments/environment';
import { contructor_dependencies } from '../../administrations/dependencies/dependencies';
import { getUser } from '../../administrations/shared/models/auth';

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
    ETUDIANTS: false,
  };

  public dependencies = inject(contructor_dependencies)

  isSubMenuVisible: boolean = false;

  sidebar: any

  
  ngOnInit(): void {
    this.dataAdmin = getUser();
    console.log(this.dataAdmin, "admin")
    this.sidebar = document.getElementById('sidebar');
    // this.dependencies.adminService.getPostesByIdCurrentAdmin(this.dataAdmin.id!).subscribe(res => {
    //   this.postes = res
    // })

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

  // toAccunt() {
  //   this.router.navigate(['/r-scolarite/my-accunt'], { queryParams: { id: this.dataAdmin.idAdministra } })
  // }


  submenuOpen() {
    this.isSubMenuVisible = !this.isSubMenuVisible
  }
  // switchAccuntDGA() {
  //   this.isSwitch = !this.isSwitch

  //   this.isSubMenuOpen.DGA = !this.isSubMenuOpen.DGA
  //   this.isSubMenuOpen.DER = false
  // }

  // switchToDER() {
  //   this.isSubMenuOpen.DER = !this.isSubMenuOpen.DER
  //   this.isSubMenuOpen.DGA = false
  // }

  toggleSubMenuStudent(){
    this.isSubMenuOpen.ETUDIANTS = !this.isSubMenuOpen.ETUDIANTS
  }

}
