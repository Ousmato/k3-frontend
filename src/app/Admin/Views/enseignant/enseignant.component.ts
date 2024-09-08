import { Component, OnInit } from '@angular/core';
import { Teacher, TeachersStatus } from '../../Models/Teachers';
import { IconsService } from '../../../Services/icons.service';
import { EnseiService } from './ensei.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TeacherPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.css'
})
export class EnseignantComponent implements OnInit {
  enseignants: Teacher [] =[];
  searchTerm : string = "";

  teachers!: TeacherPages;
  page = 0;
  size = 10;
  filteredItems : Teacher[] = []
  pages: number[] = []

  current_enseignat_create!: Teacher;
  
  

  constructor(public icons: IconsService, private root: Router, private sideBareService: SideBarService,
    private enseignantService: EnseiService) { }
  ngOnInit(): void {
    // this.load_enseignants();
    this.loadTeachers();

    this.sideBareService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterTeachers();
    
    });
  }

  filterTeachers() {
    if (!this.searchTerm) {
     return this.filteredItems = this.enseignants;
    } else {
    return  this.filteredItems = this.enseignants.filter(enseignant =>
        enseignant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // ---------------------------toggle to edit page
  toggle_toEdit(idEnseignant: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idEnseignant }
    };
    this.root.navigate(['/der/t-edit'], navigationExtras)
  }
  // -----------------------------load teacher by pages
  loadTeachers(): void {
    this.enseignantService.getTeachers(this.page, this.size).subscribe(data => {
      this.enseignants = data.content;
      this.enseignants.forEach((item, index) => {
        item.numero = index + 1;
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
      })
      this.teachers = data;
      this.filteredItems = this.enseignants;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);

      console.log(this.teachers, "pagenation teachers")
    });
  }
  // ------------------------------next page
  setPage(page: number): void {
    if (page >= 0 && page < this.teachers.totalPages!) {
      this.page = page;
      this.loadTeachers();
    }
  }

  nextPage(): void {
    if (this.page < this.teachers.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }

  timeWorks(){
    this.root.navigate(['/der/paiement']);
  }

  addTeacher(){
    this.root.navigate(['/der/t-singin']);
  }
}
