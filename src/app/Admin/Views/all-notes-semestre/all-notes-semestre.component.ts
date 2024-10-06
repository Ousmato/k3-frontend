import { Component, OnInit } from '@angular/core';
import { NoteDto, NoteModuleDto, Notes, StudentsNotesDto } from '../../Models/Notes';
import { EtudeService } from '../etudiants/etude.service';
import { ActivatedRoute } from '@angular/router';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { Ue } from '../../Models/UE';
import { Module } from '../../Models/Module';
import { Student } from '../../Models/Students';
import { ClassRoom } from '../../Models/Classe';
import { SchoolService } from '../../../Services/school.service';
import { SchoolInfo } from '../../Models/School-info';
import { SemestreService } from '../../../Services/semestre.service';
import { Semestres } from '../../Models/Semestre';
import { IconsService } from '../../../Services/icons.service';
import { NotesPages, StudentPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';

@Component({
  selector: 'app-all-notes-semestre',
  templateUrl: './all-notes-semestre.component.html',
  styleUrl: './all-notes-semestre.component.css'
})
export class AllNotesSemestreComponent implements OnInit {
  notes: NoteDto[] = []
  idClasse!: number
  idSemestre!: number
  ueListe: Ue[] = []
  modules: NoteModuleDto[] = []
  students: StudentsNotesDto[] = []
  classe?: ClassRoom
  school?: SchoolInfo
  semestres: Semestres[] = []

  studentspage?: NotesPages;
  searchTerm: string = '';
  page = 0;
  size = 10;
  anneeScolaire!: any
  filteredItems: StudentsNotesDto[] = []
  pages: number[] = []

  constructor(private etudiantService: EtudeService, public icons: IconsService,
    private semestreService: SemestreService, private clasService: ClassStudentService,
    private route: ActivatedRoute, private schollService: SchoolService, private sideBarService: SideBarService) { }
  ngOnInit(): void {
    this.getSchoolInfo();
    this.load_semestre();
    this.getClasse();


    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();

    });
  }

  // -----------------------------------------------------------
  // getStudentModuleScore(student: number, moduleId: number): number {

  //   // console.log(this.notes, "monn8888")
  //   const note = this.notes.find(note => note.idStudents.idEtudiant === student && note.idModule.id === moduleId);
  //   if (note) {
  //     const noteArrondi = (note.classeNote + note.examNote) / 2;
  //     return +noteArrondi.toFixed(2)
  //   } else {
  //     return 0; // Ou une valeur par défaut si aucune note trouvée pour ce module
  //   }
  // }


  // --------------------------------------get information of school
  getSchoolInfo() {
    this.schollService.getSchools().subscribe(data => {
      this.school = data;
      this.school.urlPhoto = `http://localhost/StudentImg/${this.school.urlPhoto}`;
      // const dte = new Date(this.school.anneeScolaire.debutAnnee);
      // const dtf = new Date(this.school.anneeScolaire.finAnnee);
      // const yearDte = dte.getFullYear();
      // const yearDtf = dtf.getFullYear();
      // this.school.anneeScolaire.;
      //  console.log(this.school.annee_de, "0000000000000000")

    })
  }
  load_semestre() {
    this.route.queryParams.subscribe(param =>{
      this.idClasse = param['id'];
    })
    this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasse).subscribe(result => {
      result.forEach(res => {
        if (!this.semestres.some(sem => sem.id == res.id)) {
          this.semestres.push(res)
        }
      })
      console.log(this.semestres, "semestre")
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
  onSelect(event: any){
    this.idSemestre = event.target.value;
   this.getNotes_classe();
  }

  getNotes_classe() {
    this.etudiantService.getAllNoteByClasse(this.page, this.size, this.idClasse, this.idSemestre).subscribe(data => {
        this.studentspage = data;
        this.students = this.studentspage.content;
        
        this.modules = []; // Initialise pour accumuler les modules
        this.notes = []; // Initialise pour accumuler les notes
        
        this.studentspage.content.forEach(stm => {
            if (stm.noteDTO && stm.noteDTO.length > 0) {
                stm.noteDTO.forEach(nt => {
                    // Ajoute la note uniquement si elle n'est pas déjà présente
                    if (!this.notes.some(n => n.nomUE === nt.nomUE)) {
                        this.notes.push(nt);
                    }
                    nt.modules.forEach(mod => {
                        // Ajoute uniquement des modules uniques
                        if (!this.modules.some(existingModule => existingModule.nomModule === mod.nomModule)) {
                            this.modules.push(mod);
                        }
                    });
                });
                console.log(this.modules, "modules");
                console.log(this.notes, "notes");
            } else {
                console.log(`Pas de modules pour ${stm.nom} ${stm.prenom}`);
            }
        });
        console.log(this.studentspage, "student note page");
    });
}

}

