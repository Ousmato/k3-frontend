import { Component, Input, OnInit } from '@angular/core';
import { SideBarService } from './side-bar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
 
  constructor(private sidebarService: SideBarService){}
  ngOnInit(): void {
    if (this.sidebarService.isToggled) {
      document.body.classList.toggle('sb-sidenav-toggled');
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
    document.body.classList.toggle('sb-sidenav-toggled');
  }


}

