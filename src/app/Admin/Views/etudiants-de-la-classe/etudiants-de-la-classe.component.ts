import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../etudiants/etude.service';
import { ClassStudentService } from '../class-students/class-student.service';
import { IconsService } from '../../../Services/icons.service';
import { Student } from '../../Models/Students';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-etudiants-de-la-classe',
  templateUrl: './etudiants-de-la-classe.component.html',
  styleUrl: './etudiants-de-la-classe.component.css'
})
export class EtudiantsDeLaClasseComponent implements OnInit{
  searchTerm: string = '';
  students: Student[] = [];
  // students!: Student [];
  student!: Student;
  idClasse !: number
  
  constructor(private service: EtudeService, private route: ActivatedRoute,
    private classeService: ClassStudentService, public icons: IconsService) { }

  dtOptions: any = {};
  ngOnInit(): void {
    this.loadStudents();
  }

  // ------------------------------------------load student by class id
  loadStudents(){
    this.route.queryParams.subscribe(param =>{
      this.idClasse = param['id']
    })
    this.service.getStudentByIdClasse(this.idClasse).subscribe(data =>{
      data.forEach((item: any) => {
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
        // this.student = item
      }); 
      this.students = data;
      //  this.initializeDataTable();
     
    })
   
  }

  // --------------------------------------
  
   
  
  // --------------------------filter methode
  filteredStudents() {
    if (!this.searchTerm) {
      return this.students;
    }
    return this.students.filter(student =>
      student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.idClasse.idFiliere?.idFiliere?.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())
      // student.telephone.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  // ------------------------go back to previous page
  goBack() {
    window.history.back();
  }
}
