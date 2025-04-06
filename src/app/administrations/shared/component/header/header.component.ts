import { Component, Input, OnInit } from '@angular/core';
import { AdminUSER, getUser } from '../../../../Admin/Models/Auth';
import { environment } from '../../../../../environments/environment';
import { Admin } from '../../../../Admin/Models/Admin';
import { IconsService } from '../../../../Services/icons.service';
import { filter } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { utils } from '../../utils/utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  
  isSidebarCollapsed = false;
  @Input() sidbar : any
  
  urlAsset = environment.urlAssetsImage
  title!: string;
  dataAdmin!: Admin;
  constructor(public icons : IconsService, private route : ActivatedRoute, private router: Router, public utils: utils) { }

  ngOnInit(): void {
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
  load_admin(){
    this.dataAdmin = getUser();
      this.dataAdmin.urlPhoto = `${environment.urlPhoto}${this.dataAdmin.urlPhoto}`
    console.log(this.dataAdmin.urlPhoto, "url photo")
  }

  
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = `${this.urlAsset}business-professional-icon.svg`;
  }
  // got to notifications
  toNotifications(){
    // this.router.navigate(['/s/notifications']);
  }

   toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      // const sidebar =
      if (this.isSidebarCollapsed) {
        this.sidbar!.classList.add('active');
      } else {
        this.sidbar!.classList.remove('active');
      }
    }
}
