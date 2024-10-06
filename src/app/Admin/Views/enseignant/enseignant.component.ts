import { Component, OnInit } from '@angular/core';
import { ProfilDto, Teacher, TeachersStatus } from '../../Models/Teachers';
import { IconsService } from '../../../Services/icons.service';
import { EnseiService } from './ensei.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TeacherPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { Filiere } from '../../Models/Filieres';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.css'
})
export class EnseignantComponent implements OnInit {
  enseignants: Teacher[] = [];
  searchTerm: string = "";

  teachersPage!: TeacherPages;
  page = 0;
  size = 10;
  filteredItems: Teacher[] = []
  pages: number[] = []

  profiles: ProfilDto[] = []
  // profiles: ProfilDto[] = []
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
      return this.filteredItems = this.enseignants.filter(enseignant =>
        enseignant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // ---------------------------toggle to edit page
  toggle_toEdit(idEnseignant: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idEnseignant }
    };
    this.root.navigate(['/der/t-edit'], navigationExtras)
  }
  // -----------------------------load teacher by pages
  loadTeachers(): void {
    this.enseignantService.getTeachers(this.page, this.size).subscribe(data => {
    
      data.content.forEach(p =>{
        if(!this.enseignants.some(en => en.idEnseignant === p.teachers.idEnseignant)){
          this.enseignants.push(p.teachers);
          this.profiles.push(p)
        }
       
      })
      
      this.teachersPage = data;
      console.log(this.teachersPage, "teacher")
      this.filteredItems = this.enseignants;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);
      console.log(this.pages, "pages")
    });
  }
  // ------------------------------next page
  setPage(page: number): void {
    if (page >= 0 && page < this.teachersPage.totalPages!) {
      this.page = page;
      this.loadTeachers();
    }
  }

  nextPage(): void {
    if (this.page < this.teachersPage.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }

  timeWorks() {
    this.searchTerm = ''
    this.ngOnInit()
    this.root.navigate(['/der/paiement']);
  }

  addTeacher() {
    this.root.navigate(['/der/t-singin']);
  }

  // ----------------------abreviation name filiere
  abbreviateFiliereName(nomFiliere: string): string {
    // Découper le nom de la filière en mots
    const words = nomFiliere.split(' ');
  
    // Garder uniquement les mots de plus de 3 lettres pour l'abréviation
    const abbreviation = words
      .filter(word => word.length > 3) // Ne prendre que les mots significatifs
      .map(word => word[0].toUpperCase()) // Prendre la première lettre en majuscule
      .join(''); // Joindre les lettres pour former l'abréviation
  
    return abbreviation;
  }

   // ------------------------------pages visibles
   getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const totalPages = this.teachersPage!.totalPages!;

    const startPage = Math.max(0, this.page - 1); // Une page avant la courante
    const endPage = Math.min(totalPages - 1, this.page + 1); // Une page après la courante

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }
}
