import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../../Services/icons.service';
import { InscriptionService } from '../../../../Services/inscription.service';
import { ActivatedRoute } from '@angular/router';
import { Inscription } from '../../../Models/Students';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent  implements OnInit{

  isView : boolean = true;
  isSuivis : boolean = false;
  isEdit : boolean = false;
  inscrit!: Inscription;
  constructor(public icons: IconsService, private inscriptionService: InscriptionService, private root: ActivatedRoute) { }

  ngOnInit(): void {
      this.load_student();
  }

  load_student() {
    this.root.queryParams.subscribe(param => {
      const idStudent = param['id']
      this.inscriptionService.getInscriptionById(idStudent).subscribe(data => {
        this.inscrit = data;
        // console.log(this.inscrit, "student - details")
      })
    })
   
  }
  // view
  getView(){
    this.isSuivis = false
    this.isEdit = false;
    this.isView = true;
  }
  // view
  getEdit(){
    this.isSuivis = false
    this.isView = false;
    this.isEdit = true;
  }
  // suivis
  getSuivis(){
    this.isView = false;
    this.isEdit  = false;  // on vire le formulaire d'edition
    this.isSuivis  = true;
    

  }

  //back
  goBack(){
    history.back();
  }
}
