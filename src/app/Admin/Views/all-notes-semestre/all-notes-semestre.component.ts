import { Component, OnInit } from '@angular/core';
import { Notes } from '../../Models/Notes';
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
import { StudentPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';

@Component({
  selector: 'app-all-notes-semestre',
  templateUrl: './all-notes-semestre.component.html',
  styleUrl: './all-notes-semestre.component.css'
})
export class AllNotesSemestreComponent  implements OnInit{
  notes: Notes[] = []
  idClasse!: number
  ueListe : Ue[] =[]
  modules: Module[] = []
  students: Student[] =[]
  classe ?: ClassRoom
  school?: SchoolInfo
  semestre?: Semestres

  studentspage?: StudentPages;
  searchTerm: string = '';
  page = 0;
  size = 10;
  filteredItems : Student[] = []
  pages: number[] = []

  constructor(private etudiantService: EtudeService, public icons: IconsService,
    private semestreService: SemestreService, private clasService: ClassStudentService,
    private route: ActivatedRoute, private schollService: SchoolService, private sideBarService: SideBarService) { }
  ngOnInit(): void {
    this.getNotes_classe();
    this.getSchoolInfo();
    this.getCurrentSemestre();
    this.getClasse();


    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();
    
    });
  }

  // -----------------------get all notes of classe
  getNotes_classe(){
    this.route.queryParams.subscribe(param =>{
      this.idClasse = param['id'];
    })
    let sts : Student[] =[]
    this.etudiantService.getAllNoteByClasse(this.page, this.size, this.idClasse).subscribe(data => {
      this.notes = data.content;
      data.content.forEach(item =>{
       this.modules.push(item.idModule)
       
       sts.push(item.idStudents)
      })
      this.students = this.extractUniqueStudents(sts)
      // this.students = sts;
    })

  }
// -----------------------------------------------------------
  getStudentModuleScore(student: number, moduleId: number): number {
    
    // console.log(this.notes, "monn8888")
    const note = this.notes.find(note => note.idStudents.idEtudiant === student && note.idModule.id === moduleId);
    if (note) {
      const noteArrondi = (note.classeNote + note.examNote) /2;
        return  +noteArrondi.toFixed(2)
    } else {
        return 0; // Ou une valeur par défaut si aucune note trouvée pour ce module
    }
}


  calculateAverage(student: Student): number {
   
      let totalPonderedScore = 0;
      let totalCoefficient = 0;
      let noteCoef =0
  
      this.notes.forEach((note: Notes) => {
        if (student.idEtudiant === note.idStudents.idEtudiant) {
          const coefficient = note.idModule.coefficient;

          noteCoef = ((note.examNote + note.classeNote )/2) * coefficient;
          totalPonderedScore += noteCoef; 

          totalCoefficient += coefficient;
        }
      });

    if (totalCoefficient > 0) {
      const average = totalPonderedScore / totalCoefficient;
      const noteArrondi = +average.toFixed(2);
        return noteArrondi;
    } else {
        return 0; // Ou une valeur par défaut si aucune note disponible
    }
}

  // --------------------------methode get observation
  determineObservation(student: any): string {
    const average = this.calculateAverage(student);

    if (average >= 10) {
        return 'Admis';
    } else {
        return 'Ajounee';
    }
}
// ----------------------------------extration 
  private extractUniqueStudents(notes: Student[]): Student[] {
    const uniqueStudents = new Set<number>(); // Utilise un Set pour stocker les idEtudiant uniques
    const result: Student[] = [];
    
    notes.forEach(item => {
      if (!uniqueStudents.has(item.idEtudiant!)) { // Vérifie si l'idEtudiant n'est pas déjà dans le Set
        uniqueStudents.add(item.idEtudiant!); 
        result.push(item); // Ajoute l'étudiant au tableau résultant des étudiants uniques
      }
    });
    result.forEach((student, index) => {
      student.numero = index + 1; // Ajoute 1 pour commencer à partir de 1 (si nécessaire)
    });

    return result;
  }
  // --------------------------------------get information of school
  getSchoolInfo(){
    this.schollService.getSchools().subscribe(data => {
      this.school = data;
      this.school.urlPhoto = `http://localhost/StudentImg/${this.school.urlPhoto}`;
      const dte = new Date(this.school.anneeScolaire.debutAnnee);
      const dtf = new Date(this.school.anneeScolaire.finAnnee);
      const yearDte = dte.getFullYear();
      const yearDtf = dtf.getFullYear();
      this.school.annee = yearDte + '-' + yearDtf;
    //  console.log(this.school.annee_de, "0000000000000000")

    })
  }
  // -------------------------------------------get currente semestre
  getCurrentSemestre(){
    this.semestreService.getCurentSemestre().subscribe(data => {
      this.semestre = data;
    })
  }
  // -------------------------------------------get classe
  getClasse(){
    this.clasService.getClassById(this.idClasse).subscribe(data => {
      this.classe = data;
    })
  }
  // -------------------------------------button got back
  goBack(){
    window.history.back();
  }
  // -----------------------------method filter
  filterStudents() {
    if (!this.searchTerm) {
     return this.filteredItems = this.students;
    } else {
    return  this.filteredItems = this.students.filter(student =>
        student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase())
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
}

