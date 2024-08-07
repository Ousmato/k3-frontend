import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { SemestreService } from '../../../Services/semestre.service';
import { EtudeService } from '../../Views/etudiants/etude.service';
import { Notes } from '../../Models/Notes';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../Models/Students';
import { SchoolInfo } from '../../Models/School-info';
import { SchoolService } from '../../../Services/school.service';
import { Semestres } from '../../Models/Semestre';
import jspdf from 'jspdf';  
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-student-bulletin',
  templateUrl: './student-bulletin.component.html',
  styleUrl: './student-bulletin.component.css'
})
export class StudentBulletinComponent implements OnInit {
  idStudent!: number
  moyenneGenerale: number = 0
  mention: string = "";
  students!: Student
  schoolInfo?: SchoolInfo;
  semestre?: Semestres;

  
  notes: Notes[] = [];

  constructor(public icons: IconsService, private root: ActivatedRoute,
    private semestreService: SemestreService, private studentService: EtudeService, private school: SchoolService ) { }
  ngOnInit(): void {
    this.load_bulletin();
    this.load_school_info();

  }

  // ------------------load school information
  load_school_info(){
    this.school.getSchools().subscribe(data =>{
      this.schoolInfo = data;
      this.schoolInfo.urlPhoto = `http://localhost/StudentImg/${this.schoolInfo.urlPhoto}`
    })
  }

  // ---------------------------calculate moyen ponderer
  load_bulletin(){

    this.root.queryParams.subscribe(params => {
      this.idStudent = +params['id'];
    });
    this.studentService.getStudent_by_id(this.idStudent).subscribe(data =>{
      this.students = data;
      this.students.urlPhoto = `http://localhost/StudentImg/${this.students.urlPhoto}`
    })
    this.semestreService.getCurentSemestre().subscribe(semestre =>{
      this.semestre = semestre
      const idSemestre = semestre
      this.studentService.getAllNoteByIdStudent(this.idStudent, idSemestre.id!).subscribe(note =>{
        
        console.log(note, "note-------")
        // ---------------------------calculate moyen ponderer
        let totalCoefficient = 0;
        let totalPonderedScore = 0;
        let noteCoef = 0
    
        // Parcourir chaque note pour calculer les sommes
        note.forEach(n => {
            const coefficient = n.idModule.coefficient;
            
            noteCoef = ((n.classeNote + n.examNote)/2) * coefficient
            totalCoefficient += coefficient;
            totalPonderedScore += noteCoef; 
        });
    
        const average = totalPonderedScore / totalCoefficient;
        // Calculer la moyenne générale en divisant la somme des notes pondérées par la somme des coefficients
        
       this.moyenneGenerale = +average.toFixed(2);
        if (this.moyenneGenerale < 10) {
          this.mention = 'Insuffisant';
        } else if (this.moyenneGenerale >= 10 && this.moyenneGenerale < 12) {
          this.mention = 'Passable';
        } else if (this.moyenneGenerale >= 12 && this.moyenneGenerale < 14) {
          this.mention = 'Assez bien';
        } else if (this.moyenneGenerale >= 14 && this.moyenneGenerale < 16) {
          this.mention = 'Bien';
        } else {
          this.mention = 'Très bien';
        }
        
        this.notes = note;
      });
      
    })
  }
  // --------------------------------go back button
  goBack(){
    window.history.back();
  }
  // --------------------------------------button to imprime
  imprimer()  
  { 
   const button  = document.querySelector('.btn-container') as HTMLElement
   button.style.display = "none"

    var data = document.getElementById('bulletin');
      //Id of the table
    html2canvas(data!,{scale: 2}).then(canvas => { 
      
      // Few necessary setting options  
      let imgWidth = 208;     
      let imgHeight = (canvas.height * imgWidth) / canvas.width;  

      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      let position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save(`fiche_paie ${name}.pdf`);
       button.style.display = "block"
    });  
  }  
}
