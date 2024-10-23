import { Component, OnInit } from '@angular/core';
import { Inscription, Student, StudentEtat, Type_status } from '../../Models/Students';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { EtudeService } from '../../Views/etudiants/etude.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Admin } from '../../Models/Admin';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrl: './student-view.component.css'
})
export class StudentViewComponent implements OnInit {
  inscrit?: Inscription;
  idInscritption!: number
  type_status!: Type_status[]
  montantRestant!: number
  imageUrl!: string
  admin!: Admin 
  update_paie_student_form!: FormGroup
  isShow: boolean = false
  permission: boolean = false
  
  constructor(  private studentService: EtudeService, private location: Location, private fb: FormBuilder,
    private router: ActivatedRoute, private root: Router, public icons: IconsService, private pageTitle: PageTitleService){}

  ngOnInit(): void {
    this.getPermission();
    this.loadForm();
    // this.imageUrl = this.inscrit.idEtudiant?.urlPhoto || 'assets/business-professional-icon.svg';
    this.loadStudent();
    
  }
  goBack(){
    this.location.back();
  }
 
  // ------------------label to specifie type student status
  getLabel(): string {
    if (this.inscrit!.idEtudiant.status === Type_status.REG) {
      return 'Frais';
    } else {
      return 'Scolarité';
    }
  }
  // --------------------permission to pay
  getPermission(): boolean {
    const autorize = sessionStorage.getItem('comptable');
    this.admin = JSON.parse(autorize!);
    if(autorize){
      this.permission = true;
    }
    return false
  }
// -----------------------------load student
  loadStudent() {
    this.router.queryParams.subscribe(params => {
      this.idInscritption = +params['id'];
      this.studentService.getInscriptionById(this.idInscritption).subscribe(data =>{
        this.inscrit! = data;
       console.log( this.inscrit! , "l'inscrit")
        this.inscrit!.idEtudiant.urlPhoto = `${environment.urlPhoto}${this.inscrit!.idEtudiant.urlPhoto}`
      
      
      const montant_payer = this.inscrit!.scolarite;
      console.log(montant_payer, "payer")
      const school_scolarite = this.inscrit!.idClasse?.idFiliere?.scolarite;
      console.log(school_scolarite, "scolarite")
      if(this.inscrit.idEtudiant.status === Type_status.REG){
      this.montantRestant = 6000 - +montant_payer!
      }else{
      this.montantRestant = +school_scolarite! - +montant_payer!

      }
      console.log(this.montantRestant, "montant restant")

      });
      
    });
    
  }
  // -------load form
  loadForm() {
      this.update_paie_student_form = this.fb.group({
        scolarite: ['', Validators.required],
        
    });
  }
  update_paie_student(inscrit: Inscription){
    const formData = this.update_paie_student_form.value
    console.log(formData)
    if(this.update_paie_student_form.valid){
      this.studentService.update_student_scolarite(inscrit.id!, this.admin.idAdministra!, +formData.scolarite).subscribe({
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
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }
  payer(){
    this.isShow =! this.isShow
  }
}
