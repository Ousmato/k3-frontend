import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { ServiceService } from '../../DER/EDT/Services/service.service';
import { Emplois } from '../../DER/EDT/Models/Emplois';
import { Router } from '@angular/router';
import { Admin } from '../../Admin/Models/Admin';
import { AdminUSER } from '../../Admin/Models/Auth';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { SchoolService } from '../../Services/school.service';
import { InscriptionService } from '../../Services/inscription.service';
import { StudentSharedMethods } from '../../Admin/Views/Etudiants/Utils/Student-shared-methode';

@Component({
  selector: 'app-r-s-home',
  templateUrl: './r-s-home.component.html',
  styleUrl: './r-s-home.component.css'
})
export class RSHomeComponent implements OnInit{

  
  studentNumber_inscrit: number = 0;
  studentNumber_noInscrit: number = 0;
  statistics!: any
  class_Number: number = 0
  emplois : Emplois[]=[]
  scolarite!: Admin
  annees: AnneeScolaire[] = []
  currentYear!: number
  idAnnee!: number
  constructor(private studentShade: StudentSharedMethods, private inscriptionService: InscriptionService,
    private router: Router, private classService: ClassStudentService, private infoSchool: SchoolService){}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.scolarite = AdminUSER()?.scolarite
      // this.load_cunt();
      this.classNumber();
      this.get_annees();
      this.get_statistiqueOfCurrentYear()

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

  // all promotions
  get_annees() {
    this.infoSchool.getAll_annee().subscribe(data => {
      this.annees = data;
      this.annees.forEach(ans => {
        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
      // console.log(this.studentShade.extractAnnee(ans), " year")
        
      })
      const anneeFind = this.annees.find(a =>this.studentShade.extractAnnee(a) + 1 === this.currentYear )
      console.log(anneeFind , "current year")
      console.log(this.currentYear, "current year")
      this.idAnnee = anneeFind!.id!;
    })
    
  }
  // change promotion
  onChange(event: any){
    if(event.target.value){
      this.idAnnee = event.target.value;
    }
    this.get_statistiqueByIdYear(this.idAnnee)

  }

   // get statistique of current year
   get_statistiqueOfCurrentYear() {
    this.inscriptionService.getInscritStatistiquesOfCurrentYear(this.scolarite.idAdministra!).subscribe(result =>{
      this.statistics = result;
      console.log(this.statistics, "statistics par defaut");
    })
  }
  // get statistique by id year
  get_statistiqueByIdYear(idAnnee: number) {
    this.inscriptionService.getInscritStatistiquesBYIdOfYear(idAnnee, this.scolarite.idAdministra!).subscribe(result =>{
      this.statistics = null
      this.statistics = result;
      console.log(result, "statistics resultat");
    })
  }
  
}
