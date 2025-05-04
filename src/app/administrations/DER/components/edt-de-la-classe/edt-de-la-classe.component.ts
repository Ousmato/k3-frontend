import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { Emplois } from '../../models/Emplois';
import { NavigationExtras } from '@angular/router';
import { AdminUSER } from '../../../shared/models/auth';

@Component({
  selector: 'app-edt-de-la-classe',
  templateUrl: './edt-de-la-classe.component.html',
  styleUrl: './edt-de-la-classe.component.css'
})
export class EDTDeLaClasseComponent implements OnInit {

  
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

    public dependencies = inject(contructor_dependencies)
   
    ngOnInit(): void {
      this.getPermission()
      this.dependencies.root.queryParams.subscribe(params =>{
        this.idClasse = params['id'];
        this.idAnnee = +params['idAnnee'];
  
       })
        this.load_all_emplois_actif();
        this.dependencies.sideBareService.currentSearchTerm.subscribe(term => {
          this.searchTerm = term;
          this.filteredEmplois();
    
    
        });
     
    }
    load_all_emplois_actif() {
     
      console.log("idClasse: " + this.idClasse)
      this.dependencies.emploiService.getAllEmploisActifsByidClasse(this.idClasse).subscribe(data => {
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
