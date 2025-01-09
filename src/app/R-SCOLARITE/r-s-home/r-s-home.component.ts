import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { ServiceService } from '../../DER/EDT/emplois-du-temps/service.service';
import { Emplois } from '../../Admin/Models/Emplois';
import { Router } from '@angular/router';

@Component({
  selector: 'app-r-s-home',
  templateUrl: './r-s-home.component.html',
  styleUrl: './r-s-home.component.css'
})
export class RSHomeComponent implements OnInit{

  
  studentNumber_inscrit: number = 0;
  studentNumber_noInscrit: number = 0;
  class_Number: number = 0
  emplois : Emplois[]=[]
  emploiCount!: number
  constructor(private studentService: EtudeService, private emploisService: ServiceService,
    private router: Router, private classService: ClassStudentService){}

  ngOnInit(): void {
      this.load_cunt();
      this.classNumber();
      this.load_all_emplois_actif();
  }
  load_all_emplois_actif(){
    this.emploisService.getAllEmploisActifs().subscribe(data =>{
      this.emplois = data;
      this.emploiCount = data.length;
    })
  }
  
  load_cunt(){
    this.studentService.getStudentNumber().subscribe(data => {
      this.studentNumber_inscrit = data.inscrit
      this.studentNumber_noInscrit = data.non_inscrit
    })
  }
  // go to student inscrit
  toggle_studentInscrit(){
    this.router.navigate(['/r-scolarite/etudiant'],{queryParams: {state: 'inscrit'}});
  }
  // go to student not inscrit
  toggle_studentNotInscrit(){
    this.router.navigate(['/r-scolarite/etudiant'],{queryParams: {state: 'not-inscrit'}});
  }

  toggle_class(){
    this.router.navigate(['/r-scolarite/classe'])
  }

  // --------------------------------count class number
  classNumber(){
    this.classService.countClassNumber().subscribe(data => {
      this.class_Number = data
    })
  }

}
