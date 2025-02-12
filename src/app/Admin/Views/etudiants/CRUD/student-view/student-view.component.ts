import { Component, Input, OnInit } from '@angular/core';
import { Dto_scolarite, Inscription, Student, StudentEtat, Type_status } from '../../../../Models/Students';
import { ClassStudentService } from '../../../../../DGA/class-students/class-student.service';
import { EtudeService } from '../../etude.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IconsService } from '../../../../../Services/icons.service';
import { PageTitleService } from '../../../../../Services/page-title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Admin } from '../../../../Models/Admin';
import { AdminUSER } from '../../../../Models/Auth';
import { InscriptionService } from '../../../../../Services/inscription.service';
import { Class_shared } from '../../../../../DGA/class-students/Utils/Class-shared-methods';
import { Student_Enum_Options } from '../../Utils/Student-enum-options';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrl: './student-view.component.css'
})
export class StudentViewComponent implements OnInit {
  @Input() inscrit!: Inscription;
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
  
  constructor(  private studentService: EtudeService, private location: Location, private fb: FormBuilder, public shared_method: Class_shared, public enum_options: Student_Enum_Options,
    private router: Router, private inscriptionService: InscriptionService, public icons: IconsService, private pageTitle: PageTitleService){}

  ngOnInit(): void {
    console.log(this.inscrit, "inscrit")
    this.getPermission();
    this.loadForm();
    this.imageUrl = this.inscrit.idEtudiant?.urlPhoto || 'assets/business-professional-icon.svg';
    
    this.statusOptions = this.enum_options.getStatusOptions()
    this.getScolarite()
    
  }
  goBack(){
    this.location.back();
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
    const autorize = AdminUSER()?.scolarite;
    this.admin = autorize;
    if(autorize){
      this.permission = true;
    }
    return false
  }

  // -------load form
  loadForm() {
      this.update_paie_student_form = this.fb.group({
        scolarite: ['', Validators.required],
        
    });
  }
  update_paie_student(inscrit: Inscription){
    const formData = this.update_paie_student_form.value
    const dto: Dto_scolarite ={
      id: inscrit.id,
      payer: formData.scolarite,
      type: this.inscrit.idEtudiant.status,
    }
    console.log(dto)
    
    if(this.update_paie_student_form.valid){
      this.studentService.update_student_scolarite( dto, this.admin.idAdministra!).subscribe({
      next: (response) =>{
        this.pageTitle.showSuccessToast(response.message);
        
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
    console.log( "scolarite")

    this.inscriptionService.getScolarite(this.inscrit.id!).subscribe(result =>{
      this.scolarites = result
      console.log(result, "scolarite")
      // this.inscrit!.scolarite = result.scolarite;
    })
  }
 
  // toggle to rapport
  toggle_to_rapport(){
    this.router.navigate(['/r-scolarite/rapport-paiement/'], {queryParams: {id: this.inscrit.id}});
  }
}
