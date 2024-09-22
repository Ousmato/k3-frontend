import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { SemestreService } from '../../../Services/semestre.service';
import { EtudeService } from '../../Views/etudiants/etude.service';
import { NoteDto, Notes } from '../../Models/Notes';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../Models/Students';
import { SchoolInfo } from '../../Models/School-info';
import { SchoolService } from '../../../Services/school.service';
import { Semestres } from '../../Models/Semestre';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { AddUeDto } from '../../Models/UE';
import { Admin } from '../../Models/Admin';

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
  semestres: Semestres[] = [];

  admin!: Admin

  notes: NoteDto[] = [];

  constructor(public icons: IconsService, private root: ActivatedRoute, private classService: ClassStudentService,
    private semestreService: SemestreService, private studentService: EtudeService, private school: SchoolService) { }
  ngOnInit(): void {
    // this.load_bulletin();
    // this.load_ues()
    this.load_admin();
    this.load_student();

  }

  //  --------------------------------------button to imprime
  imprimer() {
    const button = document.querySelector('.btn-container') as HTMLElement
    button.style.display = "none"

    var data = document.getElementById('bulletin');
    //Id of the table
    html2canvas(data!, { scale: 2 }).then(canvas => {

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
  // -------------------------

  load_student() {
    this.root.queryParams.subscribe(params => {
      this.idStudent = +params['id'];
    });

    this.studentService.getStudent_by_id(this.idStudent).subscribe(student => {
      this.students = student;
      console.log(this.students, "student")
      this.load_ues();
    });

  }
  load_ues() {

    this.semestreService.getCurrentSemestresByIdNivFiliere(this.students.idClasse.idFiliere?.id!).subscribe(result => {
      result.forEach(res => {
        if (!this.semestres.some(sem => sem.id == res.id)) {
          this.semestres.push(res)
        }
      })
      console.log(this.semestres, "semestre")
    })
  }
  // ---------------load all semestre oc classe

  onSelect(event: any) {
    const idSemestre = event.target.value;
    this.studentService.getAllNoteByIdStudent(this.idStudent, idSemestre).subscribe(note => {
      this.notes = note;
      console.log(this.notes, "notes student")

    });
  }
  goBack() {
    window.history.back();
  }
  // ---------------------get current date
  getCurrentDate() : string{
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long',  year: 'numeric'};
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  }

  // -----------------load admin
  load_admin() {
    const adminData =  sessionStorage.getItem('scolarite');
    this.admin = JSON.parse(adminData!)
  }

}
