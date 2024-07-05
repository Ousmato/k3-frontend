import { Component, OnInit } from '@angular/core';
import { Notes } from '../../Models/Notes';
import { EtudeService } from '../etudiants/etude.service';
import { ActivatedRoute } from '@angular/router';
import { ClassStudentService } from '../class-students/class-student.service';
import { Ue } from '../../Models/UE';
import { Module } from '../../Models/Module';
import { Student } from '../../Models/Students';
import { ClassRoom } from '../../Models/Classe';

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
  classe !: ClassRoom

  constructor(private etudiantService: EtudeService, private route: ActivatedRoute, private classService: ClassStudentService) { }
  ngOnInit(): void {
    this.getNotes_classe();
  }

  // -----------------------get all notes of classe
  getNotes_classe(){
    this.route.queryParams.subscribe(param =>{
      this.idClasse = param['id'];
    })
    let sts : Student[] =[]
    this.etudiantService.getAllNoteByClasse(this.idClasse).subscribe(data => {
      this.notes = data;
      data.forEach(item =>{
       this.modules.push(item.idModule)
       
       sts.push(item.idStudents)
      //  this.calculateAverage(item.idStudents);
      //  this.determineObservation(item.idStudents);
      })
      // const classe = data.find(cl => cl.idStudents.idClasse.id === this.idClasse)
      // this.classe = classe?.idStudents.idClasse!;
      this.students = this.extractUniqueStudents(sts)
      // this.students = sts;
    })

    // this.classService.getAll_ue(this.idClasse).subscribe(data =>{
    //   this.ueListe = data;
    //   console.log(this.ueListe, "ue")
    // })
  }
  // trackByIdEtudiant(index: number, student: any): number {
  //   return student.idStudents.idEtudiant; // Retourne l'identifiant unique de l'étudiant
  // }

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
}

