import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { Router } from '@angular/router';
import { ClassStudentService } from '../class-students/class-student.service';
import { ServiceService } from '../../DER/EDT/emplois-du-temps/service.service';
import { Emplois } from '../../Admin/Models/Emplois';

@Component({
  selector: 'app-dga-home',
  templateUrl: './dga-home.component.html',
  styleUrl: './dga-home.component.css'
})
export class DgaHomeComponent implements OnInit{

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
  // --------------------------go to student liste page
  toggle_student(){
    this.router.navigate(['/dga/etudiant'])
  }

  toggle_toEmploi(){
    this.router.navigate(['/dga/emplois-du-temps'])
  }

  toggle_class(){
    this.router.navigate(['/dga/mentions-liste'])
  }

  // --------------------------------count class number
  classNumber(){
    this.classService.countClassNumber().subscribe(data => {
      this.class_Number = data
    })
  }
}
