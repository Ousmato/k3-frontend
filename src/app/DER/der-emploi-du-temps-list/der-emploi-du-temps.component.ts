import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ServiceService } from '../emplois-du-temps/service.service';
import { Emplois } from '../../Admin/Models/Emplois';
import { NavigationExtras, Router } from '@angular/router';
import { IconsService } from '../../Services/icons.service';

@Component({
  selector: 'app-der-emploi-du-temps',
  templateUrl: './der-emploi-du-temps.component.html',
  styleUrl: './der-emploi-du-temps.component.css'
})
export class DerEmploiDuTempsComponent implements OnInit {

  emplois: Emplois[] = [];
  @Output() refresh = new EventEmitter<any>();
  permission: boolean = false
  show_add: boolean = false
  constructor(private emploisService: ServiceService, private router: Router, public icons: IconsService) { }

  ngOnInit(): void {
    this.getPermission()
   
      this.load_all_emplois_actif();
   
  }

  load_all_emplois_actif() {
    this.emploisService.getAllEmploisActifs().subscribe(data => {
      this.emplois = data;

    })
  }
  // ----------------------------go to seance by id emplois
  toggle_toSeance(idClasse: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };

    const autorize_s = sessionStorage.getItem('secretaire');
    if (this.getPermission()) {
      this.router.navigate(['/der/emplois-seances'], navigationExtras);
    } else if (autorize_s) {
      this.router.navigate(['/secretaire/emplois-seances'], navigationExtras);
    } else {
      this.router.navigate(['/dga/emplois-seances'], navigationExtras);
    }

  }
  // -----------------------permission methode
  getPermission(): boolean {
    const autorize = sessionStorage.getItem('der');
    if (autorize) {
      this.permission = true
      return true;
    }
    return false
  }
  // ----------------back
  goBack() {
    window.history.back();
  }
  // ----------------------refresh
  nouveau() {
    this.show_add = !this.show_add
    this.load_all_emplois_actif();
  }


  updated(idEmploi: number){}
  deleted(idEmploi: number){}
}
