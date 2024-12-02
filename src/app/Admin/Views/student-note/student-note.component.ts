import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Notes } from '../../Models/Notes';
import { Inscription, Student } from '../../Models/Students';
import { IconsService } from '../../../Services/icons.service';
import { EtudeService } from '../etudiants/etude.service';
import { ActivatedRoute, NavigationExtras, NavigationStart, Router } from '@angular/router';
import { SemestreService } from '../../../Services/semestre.service';
import { Semestres } from '../../Models/Semestre';
import { Module } from '../../Models/Module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Students_Module } from '../../Models/studends_modules';
import { SchoolService } from '../../../Services/school.service';
import { SchoolInfo } from '../../Models/School-info';
import { Location } from '@angular/common';
import { NotesPages, StudentPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { environment } from '../../../../environments/environment';
import { NoteService } from '../../../Services/note.service';

@Component({
  selector: 'app-student-note',
  templateUrl: './student-note.component.html',
  styleUrl: './student-note.component.css'
})
export class StudentNoteComponent implements OnInit {
  searchTerm: string = '';
  inscrits: Inscription [] = [];
  studentIds: number [] = [];
  inscrit_select!: Inscription
  notes: Notes[] = [];
  idUrl! : number;
  moduleSelect!: any

  semestres!: Semestres;
  modules: Module[] = [];

  moduleForm!: FormGroup;
  update_note_form!: FormGroup;
  student!: Student;
  // showFormId: number | null = null;
  schoolInfo!: SchoolInfo
  modules_of_student: Students_Module[] = [];
  isShow_modal: boolean = true
  
  
  studentPages?: StudentPages;
  page = 0;
  size = 10;
  filteredItems : Inscription[] = []
  pages: number[] = []

  show_widget_add_note: boolean = false;
  idSudent_select!: number; 
  

  constructor(public icons: IconsService, private fb: FormBuilder, private root: Router, private pageTitle: PageTitleService,
    private studentService: EtudeService, private schoolService: SchoolService, private sideBarService: SideBarService,
    private route: ActivatedRoute, private noteService: NoteService, private location: Location) {}
  ngOnInit(): void {
    this.getSchoolInfo();
    this.loadStudents();
  
  //  --------------------------------filter methode
  this.sideBarService.currentSearchTerm.subscribe(term => {
    this.searchTerm = term;
    this.filterStudents();
  
  });
  }

  goBack(){
    this.location.back();
  }
 
  // ---------------------------------get all module without notes
 
  loadStudents(){

    this.route.queryParams.subscribe(data =>{
     this.idUrl = data['id'];
     const idNivFiliere = data['idNivFil']
     this.studentService.getStudent_ByIdClasse(this.page, this.size, this.idUrl).subscribe(data => {
      this.inscrits = data.content;
      this.inscrits.forEach((item, index) => {
       
        item.idEtudiant.urlPhoto = `${environment.urlPhoto}${item.idEtudiant.urlPhoto}`;
        // this.noteService.getAllStudentIdsBySemestre()
      })
      this.studentPages = data;
      this.filteredItems = this.inscrits;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);

      console.log(this.inscrits, "les etudiants inscrit")
    });
    
   })
  
}
    // ---------------------------------get module without not of student
    load_module_without_note(inscrit: Inscription){
      this.show_widget_add_note = ! this.show_widget_add_note
      this.inscrit_select = inscrit!
      this.root.navigate(['/r-scolarite/add-note-student'], {queryParams:{id: inscrit.id, idClasse: inscrit.idClasse.idFiliere?.id}})
     
    }
    // ----------------------close widget add note modal
    close_widget(){
      this.load_module_without_note(this.inscrit_select)
      this.loadStudents();
      // this.loadSemestre();
    }
    //  -------------------------------load bulletin
    load_bulletin(idStudent: number){
      const navigationExtrat: NavigationExtras = {
        queryParams: {
          id: idStudent
        }

      }

      this.root.navigate(['/r-scolarite/student-bulletin'], navigationExtrat);
   
    }
// --------------------------------------------------------------------------method filter
filterStudents() {
  if (!this.searchTerm) {
   return this.filteredItems = this.inscrits;
  } else {
  return  this.filteredItems = this.inscrits.filter(inscrit =>
      inscrit.idEtudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      inscrit.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
  // ----------------------------------------------------methode get school informations
  getSchoolInfo() {
    this.schoolService.getSchools().subscribe(data => {
      this.schoolInfo = data;
    });
  }
  // ------------------------------------exit button
  exit(){
    this.moduleSelect = null
    this.loadStudents();
  }
  // -----------------------button pagination
  setPage(page: number): void {
    if (page >= 0 && page < this.studentPages!.totalPages!) {
      this.page = page;
      this.loadStudents();
    }
  }

  nextPage(): void {
    if (this.page < this.studentPages!.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }


  // pages visibles
 getVisiblePages(): number[] {
  const visiblePages: number[] = [];
  const totalPages = this.studentPages!.totalPages!;

  const startPage = Math.max(0, this.page - 1); 
  const endPage = Math.min(totalPages - 1, this.page + 1); 

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
}
  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }

  // abrevigate filiere name
  abrevigateFiliereName(filiereName: string): string {
    const nameSplit = filiereName.split(' ');
    return nameSplit.filter(word => word.length > 3).map(word => word[0].toUpperCase()).join('');
  }
}
