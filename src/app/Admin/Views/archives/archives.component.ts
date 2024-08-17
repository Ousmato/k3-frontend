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
import { PageTitleService } from '../../../Services/page-title.service';

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
    private sideBareService: SideBarService, private pageTitle: PageTitleService){}

  ngOnInit(): void {
   
    this.getAll();
    this.load_strim_search();
      
  }

  // -------------------load seaech strim
  load_strim_search(){
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
      // this.load_diff(this.enseignants)
    })
    
  }
  // -----------------------------------get difference of time
 
  // --------------------back button
  goBack(){
    window.history.back();
  }
  //
  toggle_toPaie(idSeance: number){
    const navigationExtras : NavigationExtras ={
      queryParams: {id: idSeance}
    }
    this.root.navigate(['/secretaire/fiche-de-paie-component'], navigationExtras)
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
