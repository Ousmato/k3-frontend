import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { Student } from '../../Admin/Models/Students';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compte-home',
  templateUrl: './compte-home.component.html',
  styleUrl: './compte-home.component.css'
})
export class CompteHomeComponent implements OnInit {

  students : Student[] =[]
  studentNumber_inscrit= 0
  studentNumber_noInscrit=0
  sum_scolarite!: string
  reliquat!: string
  constructor(private studentService: EtudeService, private router: Router) { }

  ngOnInit(): void {
    // this.load_student();
    this.load_cunt();
    this.load_sum_scolarite();
    this.load_sum_reliquat();
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
  // -------------------------load sum of all scolarite in current year
  load_sum_scolarite(){
    this.studentService.getScolarite_annee_courante().subscribe(data => {
      const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF', // Changez ici la devise si nécessaire
        // minimumFractionDigits: 2,
        // maximumFractionDigits: 2,
    });
      this.sum_scolarite = formatter.format(data);
    })
  }
  // -----------------------load sum of reliquat in current year
  load_sum_reliquat(){
    this.studentService.getReliquat_annee_courante().subscribe(data => {
      const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF', // Changez ici la devise si nécessaire
        // minimumFractionDigits: 2,
        // maximumFractionDigits: 2,
    });
     this.reliquat = formatter.format(data)
    })
  }
}
