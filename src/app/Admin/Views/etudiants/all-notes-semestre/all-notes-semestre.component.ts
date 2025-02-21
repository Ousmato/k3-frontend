import { Component, OnDestroy, OnInit } from '@angular/core';


import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { GetNoteDto, StudentMoyenne, StudentsNotesDto } from '../../../Models/Notes';
import { Module } from '../../../Models/Module';
import { Ue } from '../../../Models/UE';
import { ClassRoom } from '../../../Models/Classe';
import { Semestres } from '../../../Models/Semestre';
import { SchoolInfo } from '../../../Models/School-info';
import { NotesPages } from '../../../Models/Pagination-module';
import { PageTitleService } from '../../../../Services/page-title.service';
import { SemestreService } from '../../../../Services/semestre.service';
import { ActivatedRoute } from '@angular/router';
import { EventServiceService } from '../../../../Services/event-service.service';
import { IconsService } from '../../../../Services/icons.service';
import { ClassStudentService } from '../../../../DGA/class-students/class-student.service';
import { Class_shared } from '../../../../DGA/class-students/Utils/Class-shared-methods';
import { NoteService } from '../../../../Services/note.service';
import { SideBarService } from '../../../../sidebar/side-bar.service';
import { JsonExcelFileService } from '../../../../Services/json-excel-file.service';
import { StudentSharedMethods } from '../Utils/Student-shared-methode';
import { Admin } from '../../../Models/Admin';
@Component({
  selector: 'app-all-notes-semestre',
  templateUrl: './all-notes-semestre.component.html',
  styleUrl: './all-notes-semestre.component.css'
})
export class AllNotesSemestreComponent implements OnInit, OnDestroy {
  notes: GetNoteDto[] = []
  idClasse!: number
  idNivFiliere!: number
  idAnnee!: number
  idSemestre!: number
  ueListe: Ue[] = []
  modules: Module[] = []
  moyenne: StudentMoyenne[] = []
  students: StudentsNotesDto[] = []
  classe?: ClassRoom
  admin!: Admin
  specialite?: string
  semestres: Semestres[] = []

  studentspage?: NotesPages;
  searchTerm: string = '';
  page = 0;
  size = 100;
  anneeScolaire!: any
  semestreSelect?: Semestres
  filteredItems: StudentsNotesDto[] = []
  pages: number[] = []

  constructor(private pageTitle: PageTitleService, public icons: IconsService, private eventService: EventServiceService, private jsonExcelService: JsonExcelFileService,
    private semestreService: SemestreService, private clasService: ClassStudentService, private noteService: NoteService, public student_shared: StudentSharedMethods,
    private route: ActivatedRoute, public share_methode: Class_shared, private sideBarService: SideBarService) { }
  ngOnInit(): void {
    this.admin = this.share_methode.getUseSessionStorage()
    this.load_semestre();
    this.getClasse();


    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();

    });
    
  }

  ngOnDestroy(): void {
    this.eventService.emitEvent(this.idAnnee);
  }

  load_semestre() {
    this.route.queryParams.subscribe(param => {
      this.idClasse = param['id'];
      this.idNivFiliere = param['idNivFiliere'];
      this.idAnnee = param['idAnnee'];
    })
    this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasse).subscribe(result => {
      result.forEach(res => {
        if (!this.semestres.some(sem => sem.id == res.id)) {
          this.semestres.push(res)
        }
      })
      this.idSemestre = this.semestres[0].id!
      this.semestreSelect = this.semestres[0]
      this.getNotes_classe();
      // console.log(this.semestres, "semestre")

    })

  }
  // -------------------------------------------get classe
  getClasse() {
    this.clasService.getClassById(this.idClasse).subscribe(data => {
      this.classe = data;
    })
  }
  // -------------------------------------button got back
  goBack() {
    window.history.back();
  }
  // -----------------------------method filter
  filterStudents() {
    if (!this.searchTerm) {
      return this.filteredItems = this.students;
    } else {
      return this.filteredItems = this.students.filter(student =>
        student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())

      );
    }
  }
  // ----------------------button pagination
  setPage(page: number): void {
    if (page >= 0 && page < this.studentspage!.totalPages!) {
      this.page = page;
      this.getNotes_classe();
    }
  }

  nextPage(): void {
    if (this.page < this.studentspage!.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }

  // ------------------------select semestre
  onSelect(idSemestre: number) {
    this.idSemestre = idSemestre
    this.semestreSelect = this.semestres.find(sem => sem.id === this.idSemestre)!;
    this.getNotes_classe();

  }

  getNotes_classe() {
    this.noteService.getAllNoteByClasse(this.page, this.size, this.idClasse, this.idSemestre).subscribe(data => {
      this.studentspage = data;
      this.students = this.studentspage.content;
      console.log(this.students, "students notes")

      this.modules = []; // Initialise pour accumuler les modules
      this.notes = []; // Initialise pour accumuler les notes

      this.studentspage.content.forEach(stm => {
        if (stm.noteDTO && stm.noteDTO.length > 0) {
          this.notes = stm.noteDTO;
          stm.noteDTO.forEach(nt => {
            
            this.modules = nt.ues.modules;
          });
          // console.log(this.modules, "modules");
          // console.log(this.notes, "notes");
        } else {
          // console.log(`Pas de modules pour ${stm.nom} ${stm.prenom}`);
        }
      });
    this.getMoyenne(this.students);

      // console.log(this.studentspage, "student note page");
    });
  }


  // sort students
  onSort(event: any) {
    const value: keyof StudentsNotesDto = event.target.value;
   
    this.students = [...this.students].sort((a, b) => {
    
      const valA = a[value]?.toString().toLowerCase() || '';
      const valB = b[value]?.toString().toLowerCase() || '';
      
      if (valA < valB) return -1; // a avant b
      if (valA > valB) return 1;  // a après b
      return 0; // a égal à b
    });
  }
  // downlod to pdf
  downloadToPdf(){
    this.jsonExcelService.exportAsExcelFile_all_semestre_note(
      this.notes, this.students, this.classe!,
       this.specialite!, this.semestreSelect!);
  }

// calculer moyene
calculate(){
  this.noteService.calculateNote(this.idClasse, this.idSemestre).subscribe({
    next: (data) => {
     this.getNotes_classe()
    },
    error: (error) => {
      this.pageTitle.showErrorToast(error.error.message);
    }
  })
}

// get all modules have session
// getModulesSession(idClasse: number, idSemestre: number){
//   this.noteService.getModulesSession(idClasse, idSemestre).subscribe({})
// }

// get moyenne of class
getMoyenne(students: StudentsNotesDto[]){
  this.noteService.getAllMoyenneByIdClassAndSemestre(this.idClasse, this.idSemestre).subscribe(moyenne =>{
    this.moyenne = moyenne
    students.forEach(st =>{
      st.moyenGeneral = moyenne.find(m => m.idInscription.id! == st.id!)!.moyenGenerale
    })
    console.log("moyenne", students)
  })
}

// close modal reinscription

}


