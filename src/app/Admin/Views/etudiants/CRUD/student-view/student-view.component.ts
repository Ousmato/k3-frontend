import { Component, OnInit } from '@angular/core';
import { Dto_scolarite, Inscription, Student, StudentEtat, Type_status } from '../../../../Models/Students';
import { ClassStudentService } from '../../../../../DGA/class-students/class-student.service';
import { EtudeService } from '../../etude.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IconsService } from '../../../../../Services/icons.service';
import { PageTitleService } from '../../../../../Services/page-title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { Admin } from '../../../../Models/Admin';
import { AdminUSER } from '../../../../Models/Auth';
import { InscriptionService } from '../../../../../Services/inscription.service';

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
  scolarites!: Dto_scolarite
  imageUrl!: string
  statusType!: Type_status
  statusOptions: {key: string; value: string}[] =[]
  admin!: Admin 
  update_paie_student_form!: FormGroup
  isShow: boolean = false
  permission: boolean = false

  public typeStatus = Type_status;
  
  constructor(  private studentService: EtudeService, private location: Location, private fb: FormBuilder,
    private router: ActivatedRoute, private inscriptionService: InscriptionService, public icons: IconsService, private pageTitle: PageTitleService){}

  ngOnInit(): void {
    this.getPermission();
    this.loadForm();
    // this.imageUrl = this.inscrit.idEtudiant?.urlPhoto || 'assets/business-professional-icon.svg';
    this.loadStudent();
    this.statusOptions = this.getStatusOptions()
    this.getScolarite()
    
  }
  goBack(){
    this.location.back();
  }
 
  // status options
  getStatusOptions(): { key: string, value: string }[] {
    return Object.keys(Type_status).map(key => ({
      key: key,
      value: Type_status[key as keyof typeof Type_status]
    }));
  }
  // ------------------label to specifie type student status
  getLabel(): string {
    if (this.inscrit!.idEtudiant.status === Type_status.REGULIER) {
      return 'Frais';
    } else {
      return 'Scolarité';
    }
  }
  // --------------------permission to pay
  getPermission(): boolean {
    const autorize = AdminUSER()?.comptable;
    this.admin = autorize;
    if(autorize){
      this.permission = true;
    }
    return false
  }
// -----------------------------load student
  loadStudent() {
    this.router.queryParams.subscribe(params => {
      this.idInscritption = +params['id'];
      this.inscriptionService.getInscriptionById(this.idInscritption).subscribe(data =>{
        this.inscrit! = data;
       console.log( this.inscrit! , "l'inscrit")
        this.inscrit!.idEtudiant.urlPhoto = `${environment.urlPhoto}${this.inscrit!.idEtudiant.urlPhoto}`
      
      
      const montant_payer = this.inscrit!.scolarite;
      console.log(montant_payer, "payer")
      const school_scolarite = this.inscrit!.idClasse?.idFiliere?.scolarite;
      console.log(school_scolarite, "scolarite")
      if(this.inscrit.idEtudiant.status === Type_status.REGULIER){
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
        this.getScolarite();
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

  // get scolarite
  getScolarite(){
    this.inscriptionService.getScolarite(this.idInscritption).subscribe(result =>{
      this.scolarites = result
      console.log(result, "scolarite")
      // this.inscrit!.scolarite = result.scolarite;
    })
  }
}
