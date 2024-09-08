import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { Router } from '@angular/router';
import { Emplois } from '../../Admin/Models/Emplois';
import { ServiceService } from '../emplois-du-temps/service.service';
import { SalleService } from '../../Services/salle.service';
import { EnseiService } from '../../Admin/Views/enseignant/ensei.service';
import { IconsService } from '../../Services/icons.service';

@Component({
  selector: 'app-der-home',
  templateUrl: './der-home.component.html',
  styleUrl: './der-home.component.css'
})
export class DerHomeComponent  implements OnInit{

  teacherCount: number = 0;
  studentNumber_noInscrit: number = 0;
  salle: number = 0
  memoire: number = 0
  rapport: number = 0
  salleOccuper: number = 0
  emplois : Emplois[]=[]
  emploiCount!: number
  constructor(public icons: IconsService, private emploisService: ServiceService, private studentService: EtudeService,
    private router: Router, private enseignantService: EnseiService, private salleService: SalleService){}

  ngOnInit(): void {
      this.load_cunt();
      this.salleNumber();
      this.load_all_emplois_actif();
      this.docNumber();
  }
  load_all_emplois_actif(){
    this.emploisService.getAllEmploisActifs().subscribe(data =>{
      this.emplois = data;
      this.emploiCount = data.length;
    })
  }
  
  load_cunt(){
    this.enseignantService.countTeacherNumber().subscribe(data => {
     this.teacherCount = data
    })
  }
  // --------------------------go to student liste page
  toggle_doc(){
    this.router.navigate(['/der/doc'])
  }
  toggle_enseignant(){
    this.router.navigate(['/der/enseignants'])
  }

  toggle_toEmploi(){
    this.router.navigate(['/dga/emplois-du-temps'])
  }

  toggle_class(){
    this.router.navigate(['/der/salles'])
  }

  // --------------------------------count class number
  salleNumber(){
    this.salleService.getNombreSalleOccupe().subscribe(data => {
      this.salleOccuper = data
    })
    this.salleService.getNombreSalleNonOccupe().subscribe(data => {
      this.salle = data
    })
  }
  // -----------------------count docs
  docNumber(){
    this.studentService.getMemoireNumber().subscribe(data => {
      this.memoire = data
    })
    this.studentService.getRapportNumber().subscribe(data => {
      this.rapport = data
    })
  }
}
