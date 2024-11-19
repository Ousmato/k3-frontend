import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { montantsCount, Student } from '../../Admin/Models/Students';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compte-home',
  templateUrl: './compte-home.component.html',
  styleUrl: './compte-home.component.css'
})
export class CompteHomeComponent implements OnInit {

  students : Student[] =[]
  montantCunt!: montantsCount
  studentNumber_inscrit= 0
  studentNumber_noInscrit=0
  sum_scolarite!: string
  sumScolariteReg = "0"
  reliquatReg = "0"
  sumScolaritePro = "0"
  reliquatPro = "0" 
  reliquat!: string
  constructor(private studentService: EtudeService, private router: Router) { }

  ngOnInit(): void {
    // this.load_student();
    this.load_cunt();
    this.getmontantCunt();
  }

 

  load_cunt(){
    this.studentService.getStudentNumber().subscribe(data => {
      this.studentNumber_inscrit = data.inscrit
      this.studentNumber_noInscrit = data.non_inscrit
    })
  }
  // ------------------------
  toggle_student(){
    this.router.navigate(['/comptable/etudiant'])
  }
  // -----------------------load sum of reliquat in current year
  getmontantCunt(){
    this.studentService.getmontants().subscribe(data => {
      const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF', // Changez ici la devise si nécessaire
        // minimumFractionDigits: 2,
        // maximumFractionDigits: 2,
    });
     this.montantCunt = data
     this.reliquatPro = formatter.format(this.montantCunt.reliquatPro);
     this.sumScolaritePro = formatter.format(this.montantCunt.sumScolaritePro);
     this.reliquatReg = formatter.format(this.montantCunt.reliquatReg);
     this.sumScolariteReg = formatter.format(this.montantCunt.sumScolariteReg);
     this.reliquat = formatter.format(this.montantCunt.reliquatTotal);
     this.sum_scolarite = formatter.format(this.montantCunt.sumScolariteTotal);
    })
  }
}
