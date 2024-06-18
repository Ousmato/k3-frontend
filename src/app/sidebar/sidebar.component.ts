import { Component, Input, OnInit } from '@angular/core';
import { SideBarService } from './side-bar.service';
import { IconsService } from '../Services/icons.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

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
 
  constructor(private sidebarService: SideBarService, public icons: IconsService){}

  
ngOnInit(): void {
   
}

}

