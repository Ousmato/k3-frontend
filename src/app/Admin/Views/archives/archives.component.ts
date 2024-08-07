import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../Models/Teachers';
import { EnseiService } from '../enseignant/ensei.service';
import { IconsService } from '../../../Services/icons.service';
import { data } from 'jquery';
import { Presence } from '../../Models/Teacher-presence';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Seances } from '../../Models/Seances';
import { Paie } from '../../Models/paie';
import { Presence_pages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.css'
})
export class ArchivesComponent  implements OnInit{
  form_paie!: FormGroup;
  enseignants: Presence [] =[]
  diff_heure: number = 0;

  searchTerm : string = "";

  teachers_presence_pqge!: Presence_pages;
  page = 0;
  size = 10;
  filteredItems : Presence[] = []
  pages: number[] = []

  constructor (private teacherService: EnseiService, private root: Router,
    public icons: IconsService, private fb: FormBuilder, 
    private sideBareService: SideBarService){}

  ngOnInit(): void {
    this.form_paie = this.fb.group({
      coutHeure:[''],
      nbreHeures: [''],
      montant: [''],
      idPresenceTeachers: ['']
    })

    this.getAll();

    this.sideBareService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterTeachers();
    
    });
    
      
  }
  // -----------------------filter methode
  filterTeachers() {
    if (!this.searchTerm) {
     return this.filteredItems = this.enseignants;
    } else {
    return  this.filteredItems = this.enseignants.filter(enseignant =>
        enseignant.idSeance.idTeacher.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.idSeance.idTeacher.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.idSeance.idTeacher.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
// --------------------------------load teacher presence
  getAll(){

    this.teacherService.getAll_presence_ofMonth(this.page, this.size).subscribe(data =>{
      this.teachers_presence_pqge = data;
      this.enseignants = data.content;
      this.filteredItems = this.enseignants;

     this.pages = Array.from({length: data.totalPages!}, (_, i)=> i);
      this.enseignants.forEach(item => {
        item.idSeance.idTeacher.urlPhoto = `http://localhost/StudentImg/${item.idSeance.idTeacher.urlPhoto}`;
      });
      this.load_diff(this.enseignants)
    })
    
  }
  // -----------------------------------get difference of time
  load_diff(enseignant: Presence[]){
    console.log(enseignant, "heure diff")
    enseignant.forEach(item =>{
     
      // Convertir les heures de début et de fin en objets Date
      let heure_Debut = new Date('1970-01-01T' + item.idSeance.heureDebut);
      let heure_Fin = new Date('1970-01-01T' + item.idSeance.heureFin );

      // Calculer la différence en millisecondes
      let differenceMs = heure_Fin.getTime() - heure_Debut.getTime();

      // Convertir la différence de millisecondes en heures et minutes
      let differenceMinutes = Math.floor(differenceMs / (1000 * 60));
      let differenceHours = Math.floor(differenceMinutes / 60);
      let remainderMinutes = differenceMinutes % 60;

      item.heure = differenceHours;
      item.munite = remainderMinutes;
      this.diff_heure  = item.heure;

    })
  }
  // --------------------------------load input value automataclly
  loadInputValue(event: any, presnce: Presence){

    let valeurCoutHeure = this.form_paie.get('coutHeure')!.value;
    let heure = presnce.heure;
    const montant = +valeurCoutHeure * +heure!;
    this.form_paie.get('montant')?.setValue(montant +" FCFA");
    // var valeur = inputElement.value
  }
  // ------------------------------- 
 
  // -------------------------------------------------add paie

    add_paie(presence: Presence){
        const formData = this.form_paie.value;
        const paie: Paie = {
        coutHeure: +formData.coutHeure,
        nbreHeures: presence.heure!,
        
        idPresenceTeachers: presence
    }
    this.teacherService.addPaie(paie).subscribe((data) => {
      alert("Paiement effectuee avec succes!!");
      window.location.reload();
      
    })
  }
  //
  toggle_toPaie(idSeance: number){
    const navigationExtras : NavigationExtras ={
      queryParams: {id: idSeance}
    }
    this.root.navigate(['/sidebar/fiche-de-paie-component'], navigationExtras)
  } 
  // ------------------------------next page
  setPage(page: number): void {
    if (page >= 0 && page < this.teachers_presence_pqge.totalPages!) {
      this.page = page;
      this.getAll();
    }
  }

  nextPage(): void {
    if (this.page < this.teachers_presence_pqge.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }
}
