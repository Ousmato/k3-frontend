import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { SchoolService } from '../../Services/school.service';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-student-re-inscription',
  templateUrl: './student-re-inscription.component.html',
  styleUrl: './student-re-inscription.component.css'
})
export class StudentReInscriptionComponent implements OnInit {

 
  annees: AnneeScolaire[] =[]



  constructor(private studentService: EtudeService, public icons: IconsService, private infoSchool: SchoolService, private router: Router){}

  ngOnInit(): void {
    this.get_annees();
      
  }

  // -------------------------get annees
  get_annees(){
    this.infoSchool.getAll_annee().subscribe(data =>{
      this.annees = data;
      this.annees.forEach(ans=>{
       ans.ans = this.getYear(ans.debutAnnee)
      })
      
    })
  }
  // ----------------------------------get all student inscrit in annee scolaire
  onSelect(idAnnee : number){

    const navigationExtras : NavigationExtras = {
      queryParams: { id : idAnnee} 
    }
    this.router.navigate(['r-scolarite/re-inscription-list'], navigationExtras)
  
  }
 
  getYear(date :Date) :number{
    const dt = new Date(date)
   return dt.getFullYear();

  }

  
}
