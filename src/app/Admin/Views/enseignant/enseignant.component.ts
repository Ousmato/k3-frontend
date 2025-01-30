import { Component, OnInit } from '@angular/core';
import {  Teacher, TeacherDto, TeachersStatus } from '../../Models/Teachers';
import { IconsService } from '../../../Services/icons.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TeacherPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { Filiere } from '../../Models/Filieres';
import { Admin } from '../../Models/Admin';
import { AdminUSER } from '../../Models/Auth';
import { EnseiService } from './ensei.service';

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
  size = 20;
  filteredItems: Teacher[] = []
  pages: number[] = []
  admin!: Admin
  index!: number 
  
  profiles: TeacherDto[] = []
  profilesItem: TeacherDto[] = []
  current_enseignat_create!: Teacher;
  permission: boolean = false
  show_form: boolean = false

  constructor(public icons: IconsService, private root: Router, private sideBareService: SideBarService,
    private enseignantService: EnseiService) { }
  ngOnInit(): void {
    this.loadTeachers();
    this.getPermission();
    this.sideBareService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterTeachers();

    });
  }

  filterTeachers() {
    if (!this.searchTerm) {
      return this.profilesItem = this.profiles;
    } else {
      return this.profilesItem = this.profiles.filter(p =>
        p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.specialitesList.some(pf => 
          this.abbreviateFiliereName(pf.nom).toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  // ---------------------------toggle to edit page
  toggle_toEdit(idEnseignant: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idEnseignant }
    };
    
    if(this.permission){
       this.root.navigate(['/der/t-edit'], navigationExtras)
    // }else if(der){
    //   this.root.navigate(['/der/t-edit'], navigationExtras)

    }else{
      this.root.navigate(['/sidebar/t-edit'], navigationExtras)
    }

   
  }

  toggle_toHours(id: number){
    
    this.root.navigate(['/der/paiement'], {queryParams : {id:id}})
  }
  // -----------------------------load teacher by pages
  loadTeachers(): void {
    this.enseignantService.getTeachers(this.page, this.size).subscribe(data => {
    
      data.content.forEach(p =>{
        if(!this.enseignants.some(en => en.idEnseignant === p.idEnseignant)){
        p.nom =  p.nom.charAt(0).toUpperCase() + p.nom.slice(1).toLowerCase();
         p.prenom = p.prenom.charAt(0).toUpperCase() + p.prenom.slice(1).toLowerCase();
        // this.enseignants.push(p);
          this.profiles.push(p)
        }
       
      })
      
      this.teachersPage = data;
      console.log(this.teachersPage, "teacher")
      this.profilesItem = this.profiles;
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

  getPermission() : boolean{
    const admin = AdminUSER()?.der
    this.admin = admin;
    if(admin){
      this.permission = true;
      return true
    }
    return false;
  }

  // show form
  showForm(index: number) {
    this.index = index;
    this.show_form = true
  }
  // cancel modal
  cancel(){
    this.show_form = false
    window.location.reload
  }
}
