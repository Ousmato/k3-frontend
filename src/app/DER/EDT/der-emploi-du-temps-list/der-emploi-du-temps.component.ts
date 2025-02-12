import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ServiceService } from '../emplois-du-temps/service.service';
import { Emplois } from '../../../Admin/Models/Emplois';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IconsService } from '../../../Services/icons.service';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { AdminUSER } from '../../../Admin/Models/Auth';
import { EventServiceService } from '../../../Services/event-service.service';

@Component({
  selector: 'app-der-emploi-du-temps',
  templateUrl: './der-emploi-du-temps.component.html',
  styleUrl: './der-emploi-du-temps.component.css'
})
export class DerEmploiDuTempsComponent implements OnInit, OnDestroy {

  searchTerm: string = '';
  emplois: Emplois[] = [];
  filteredItem: Emplois[] = [];
  emploiSelect!: Emplois
  @Output() refresh = new EventEmitter<any>();
  permission: boolean = false
  idClasse!: number
  idAnnee!: number
  show_add: boolean = false
  show_update: boolean = false
  constructor(private emploisService: ServiceService, private sideBarService: SideBarService, private root: ActivatedRoute,
    private router: Router, public icons: IconsService, private eventService: EventServiceService) { }

  ngOnInit(): void {
    this.getPermission()
    this.root.queryParams.subscribe(params =>{
      this.idClasse = params['id'];
      this.idAnnee = +params['idAnnee'];

     })
      this.load_all_emplois_actif();
      this.sideBarService.currentSearchTerm.subscribe(term => {
        this.searchTerm = term;
        this.filteredEmplois();
  
  
      });
   
  }
  ngOnDestroy(): void {
      this.eventService.emitEvent(this.idAnnee);
  }

  load_all_emplois_actif() {
   
    console.log("idClasse: " + this.idClasse)
    this.emploisService.getAllEmploisActifsByidClasse(this.idClasse).subscribe(data => {
      this.emplois = data;
      console.log(this.emplois, "list---- des emplois");
    
      this.emplois.forEach(emp => {
        const today = new Date();
        emp.status = this.getEmploiStatus(emp.dateDebut, emp.dateFin, today);
      });
    });
  }
  
  //go to seance by id emplois
  toggle_toSeance(idClasse: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };

    const autorize_s = AdminUSER()?.secretaire;
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
    const autorize = AdminUSER()?.der;
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

  close(){
    this.load_all_emplois_actif();
    this.show_add = false;
    this.show_update = false;
    
  }

  updated(emploi: Emplois){
    this.show_update = true;
    this.emploiSelect = emploi
  }
  deleted(idEmploi: number){}

  // --------------comapare date
  getEmploiStatus(dateDebut: Date, dateFin: Date, today: Date): string {
    const dateDebutParsed = new Date(dateDebut);
    const dateFinParsed = new Date(dateFin);
  
    // Réinitialiser l'heure pour comparer uniquement les dates
    today.setHours(0, 0, 0, 0);
    dateDebutParsed.setHours(0, 0, 0, 0);
    dateFinParsed.setHours(0, 0, 0, 0);
  
    if (today < dateDebutParsed) {
      return 'en_attente'; // L'emploi n'a pas encore commencé
    } else if (today >= dateDebutParsed && today <= dateFinParsed) {
      return 'en_cours'; // L'emploi est actif
    } else {
      return 'depasser'; // L'emploi est dépassé
    }
  }

  // -----------------search
  filteredEmplois(){
    if(!this.searchTerm){
      return this.filteredItem = this.emplois
    }
    return this.filteredItem = this.emplois.filter(emp =>emp.idClasse.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm) ||
    emp.idClasse.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm) ||
    emp.idModule.nomModule.toLowerCase().includes(this.searchTerm)
  )
   
  }
}
