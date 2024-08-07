import { Component, OnInit } from '@angular/core';
import { Student } from '../../Models/Students';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { EtudeService } from '../../Views/etudiants/etude.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrl: './student-view.component.css'
})
export class StudentViewComponent implements OnInit {
  student?: Student;
  idStudent!: number
  montantRestant!: number
  update_paie_student_form!: FormGroup
  isShow: boolean = false
  
  constructor(  private studentService: EtudeService, private location: Location, private fb: FormBuilder,
    private router: ActivatedRoute, private root: Router, public icons: IconsService, private pageTitle: PageTitleService){}

  ngOnInit(): void {
    this.loadStudent();
  }
  goBack(){
    this.location.back();
  }

// -----------------------------load student
  loadStudent() {
    this.router.queryParams.subscribe(params => {
      this.idStudent = +params['id'];
      this.studentService.getStudent_by_id(this.idStudent).subscribe(data =>{
        this.student = data;
        this.student.urlPhoto = 'http://localhost/StudentImg/'+this.student.urlPhoto
      
      
      const montant_payer = this.student?.scolarite;
      console.log(montant_payer, "payer")
      const school_scolarite = this.student?.idClasse.scolarite;
      console.log(school_scolarite, "scolarite")
      this.montantRestant = +school_scolarite! - +montant_payer

      this.update_paie_student_form.get('idEtudiant')?.setValue(this.student.idEtudiant)
      });
      
    });
    // -------------------------load form
    this.update_paie_student_form = this.fb.group({
      idEtudiant: ['', Validators.required],
      scolarite: ['', Validators.required],
      
    });
  }
  update_paie_student(student: Student){
    const formData = this.update_paie_student_form.value
    formData.idEtudiant = student.idEtudiant
    console.log(formData)
    // const scolarite 
    if(this.update_paie_student_form.valid){
      this.studentService.update_student_scolarite(student.idEtudiant!, +formData.scolarite).subscribe({
      next: (response) =>{
        this.pageTitle.showSuccessToast(response.message);
        this.loadStudent();
        this.isShow = false;
      },
      error: (erreur) =>{
        this.pageTitle.showErrorToast(erreur.error.message);
      }
      
    })
    }else{
      this.update_paie_student_form.markAllAsTouched();
      console.log("Veuillez remplir tous les champs correctement!");

  
    }
    
  }
  // -------------------------go back
  annuler(){

  }
  payer(){
    this.isShow =! this.isShow
  }
}
