import { Component, inject, OnInit } from '@angular/core';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { DtoWeek_Emplois, Emplois } from '../../models/Emplois';
import { Admin } from '../../../shared/models/Admin';
import { AdminUSER, getUser } from '../../../shared/models/auth';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-der-emploi-du-temps',
  templateUrl: './der-emploi-du-temps.component.html',
  styleUrl: './der-emploi-du-temps.component.css'
})
export class DerEmploiDuTempsComponent implements OnInit {

  filteredItems: any[] = []
  filteredItemsWithouJournee: any[] = []
  emplois: any[] = []
  index !: number
  emploiSelect !: Emplois
  activeIndex: number | null = null;
  filteredEmplois: any[] = []
  weekEmplois: DtoWeek_Emplois[] = []
  weekEmploi !: DtoWeek_Emplois
  is_showEdt: boolean = false
  permission: boolean = false
  show_update: boolean = false
  admin!: Admin
  filterValueDefault: any = ""

  public dependencies = inject(contructor_dependencies)
  ngOnInit(): void {
    this.getPermission()
    this.admin = getUser()

    this.getAllEmploiActif("Default")

  }

  getAllEmploiActif(value : string) {
    
    this.dependencies.emploiService.getAllEmploisHaveJourneeOfWeek(value).subscribe(data => {
      this.weekEmplois = data
      this.filteredItems = this.weekEmplois
      console.log(this.weekEmplois, "emplois du temps par semaine")

    })
  }

  getWeeksPlaning(value : string){
    value = "Default"
    this.filterValueDefault = value
      this.getAllEmploiActif(this.filterValueDefault)
    
    
  }

  getWeeksNotPlaning(value : string){
    value = 'empty'
    this.filterValueDefault = value
     this.getAllEmploiActif(this.filterValueDefault)
  }

  open_week(week: any) {
    this.activeIndex = week;
    this.is_showEdt = true;
    this.emplois = week.emplois;
    this.filteredItems = [week];
  }

  close_week() {
    this.activeIndex = null;
    this.is_showEdt = false;
    this.emplois = [];
    this.filteredItems = [...this.weekEmplois];
  }


  onSearch(searchTerm: string) {
    const emploisFiltered = this.emplois.filter(item =>
      item.nom.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const weekEmploisFiltered = this.weekEmplois.filter(item =>
      item.weekEnd.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.weekStart.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.filteredItems = [...emploisFiltered, ...weekEmploisFiltered];
  }

  //go to seance by id emplois
  toggle_toSeance(idClasse: number, value: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse , value: value },
    };

    const autorize_s = AdminUSER()?.secretaire;
    if (this.getPermission()) {
      this.dependencies.router.navigate(['/der/emplois-seances'], navigationExtras);
    } else if (autorize_s) {
      this.dependencies.router.navigate(['/secretaire/emplois-seances'], navigationExtras);
    } else {
      this.dependencies.router.navigate(['/dga/emplois-seances'], navigationExtras);
    }

  }
  // -----------------------permission methode
  getPermission(): boolean {
    const autorize = AdminUSER()?.der;
    if (autorize) {
      this.permission = true
      return true;
    }
    return false
  }

  close() {
    this.show_update = false;

  }

  updated(emploi: Emplois) {
    this.show_update = true;
    this.emploiSelect = emploi
  }
}
