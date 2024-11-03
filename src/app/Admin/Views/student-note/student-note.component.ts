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

@Component({
  selector: 'app-student-note',
  templateUrl: './student-note.component.html',
  styleUrl: './student-note.component.css'
})
export class StudentNoteComponent implements OnInit {
  searchTerm: string = '';
  inscrits: Inscription [] = [];
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
    private route: ActivatedRoute, private semestreService: SemestreService, private location: Location) {}
  ngOnInit(): void {
    this.getSchoolInfo();
    this.loadStudents();
    // this.loadSemestre();
    this.load_update_form();
  
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
     this.studentService.getStudent_ByIdClasse(this.page, this.size, this.idUrl).subscribe(data => {
      this.inscrits = data.content;
      this.inscrits.forEach((item, index) => {
       
        item.idEtudiant.urlPhoto = `${environment.urlPhoto}${item.idEtudiant.urlPhoto}`;
      })
      this.studentPages = data;
      this.filteredItems = this.inscrits;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);

      console.log(this.inscrits, "pagenation teachers")
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
  // ---------------------update note
  load_update(student: Student){
    this.isShow_modal = true
    this.semestreService.getCurentSemestre().subscribe(semestre =>{
      const idSemestre = semestre
      // this.studentService.getAllNoteByIdStudent(student.idEtudiant!, idSemestre.id!).subscribe(note =>{
      //   note.forEach(n => {
      //     if(!this.modules.some(module => module.id === n.idModule.id)){
      //       this.modules.push(n.idModule)
      //     }
      //     this.moduleSelect = n
          
      //   });
      //   this.notes = note
        
      // })
    })
  }
  // ---------------------load update form
  load_update_form(){
    this.update_note_form = this.fb.group({
      examNote: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      classeNote: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      idModule: ['', Validators.required],
      // idSemestre: ['']
    })
  }
  // --------------------------------------------method update
  update_note(student: Student){
    // const formData = this.update_note_form.value
    // const note : Notes = {
    //   id: this.moduleSelect!.id,
    //   idStudents: student,
    //   idModule: this.moduleSelect.idModule,
    //   idSemestre: this.moduleSelect.idSemestre,
    //   classeNote: formData.classeNote,
    //   examNote: formData.examNote
    // }
    // if(this.update_note_form.valid){
    //   this.studentService.update_note(note).subscribe({
    //     next: (response) =>{
    //       this.pageTitle.showSuccessToast(response.message);
    //       // // this.loadStudents();
    //       // this.load_update(student);
    //     },
    //     error: (erreur) => {
    //       this.pageTitle.showErrorToast(erreur.error.message);
    //     }
    //   })
    //   console.log(note, "note-up")
    // }else{
    //   this.update_note_form.markAllAsTouched();
    //   console.log("invalid", this.update_note_form.value)
    // }


  }
  // -------------------------------
  onSelecteModule(event: any){
    console.log("clic ici")
    const evenSelect = event.target.value
    this.notes.forEach(n =>{
       console.log(this.moduleSelect, "module-select");
      if(evenSelect == n.idModule.id){
        if(this.moduleSelect == null){

        }
          this.moduleSelect = n
        
        console.log(this.moduleSelect, "module-select")
      }
    })
    this.update_note_form.get('examNote')?.setValue(this.moduleSelect.examNote);
    this.update_note_form.get('classeNote')?.setValue(this.moduleSelect.classeNote);
    
    // console.log(this.notesSelectModule, "module-select")
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
}
