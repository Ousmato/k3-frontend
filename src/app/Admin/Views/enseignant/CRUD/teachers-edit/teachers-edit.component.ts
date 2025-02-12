import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EnseiService } from '../../ensei.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../../../../Services/page-title.service';
import { IconsService } from '../../../../../Services/icons.service';
import { Diplomes, Teacher, TeachersStatus } from '../../../../Models/Teachers';
import { ActivatedRoute } from '@angular/router';
import { SetService } from '../../../settings/set.service';
import { Admin } from '../../../../Models/Admin';
import { AdminUSER } from '../../../../Models/Auth';
import { TeacherUtils } from '../../Utils/teacher-utils';

@Component({
  selector: 'app-teachers-edit',
  templateUrl: './teachers-edit.component.html',
  styleUrl: './teachers-edit.component.css'
})
export class TeachersEditComponent implements OnInit {

  enseignant? : Teacher 
  fileName!: File;
  photoSelect!: File
  urlImage! : string | ArrayBuffer
  teacher_form!: FormGroup
  passwordVisible : boolean = false
  idEnseignant!: number
  admin!: Admin
  // ueList : Ue [] = []
  isEdit: boolean = false
  isAddGrade: boolean = false
  isUpdate: boolean = false
  gradesOptions: {key: string, value: string}[] = []


  teacherStatusOptions!: string[];
  teacherDiplomOptions: {key: string, value: string}[] = [];

  constructor(private enseignantService: EnseiService, private root: ActivatedRoute, private pageTitle: PageTitleService,
    public icons: IconsService, private fb: FormBuilder, private setService: SetService, public teacherUtils: TeacherUtils) { }


  ngOnInit(): void {
   this.teacher_form = this.teacherUtils.InitializeForm(this.fb);
    this.getTeacher();
     this.teacherDiplomOptions = this.teacherUtils.getDiplomesOptions();
    this.admin = AdminUSER()?.der
    this.gradesOptions = this.teacherUtils.getGradesOptions()
      
  }

  //load form
  load_update_form(){
    if (this.enseignant) {
      this.teacher_form.patchValue({
        idEnseignant: this.enseignant.idEnseignant,
        nom: this.enseignant.nom,
        prenom: this.enseignant.prenom,
        email: this.enseignant.email,
        sexe: this.enseignant.sexe,
        telephone: this.enseignant.telephone,
        dateNaissance: this.enseignant.dateNaissance,
        diplome: this.enseignant.diplome,
        status: this.enseignant.status,
        grade: this.enseignant.grade || '', // Utilisez une valeur par défaut si nécessaire
      });
    }
   
  }
  // -----------------------------------------
  getTeacher(){
    this.teacherStatusOptions = Object.values(TeachersStatus);
    this.root.queryParams.subscribe(params => {
      this.idEnseignant = +params['id'];
      console.log(this.idEnseignant, "id----")
      this.enseignantService.getTeacher_by_id(this.idEnseignant).subscribe( result =>{
        this.enseignant = result;
        console.log(this.enseignant, "ense")
        this.load_update_form();

      }
        
      );
    });
   
  }
  update_enseignant(){
    if(this.isUpdate){
      const formData = this.teacher_form.value
      console.log(formData, "fomData");
      // const idUe = this.ueList.find(ue =>ue.id == formData.idUe);

      const enseignant : Teacher ={
        idEnseignant: formData.idEnseignant,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        sexe: formData.sexe,
        telephone: formData.telephone,
        status: formData.status,
        diplome: formData.diplome,
        grade: formData.grade!,
        dateNaissance: formData.dateNaissance,
        
        admin: this.admin

        
      }
      console.log(enseignant, "enseign")
    
      this.enseignantService.updateTeacher(enseignant!).subscribe({
        next: (response) => {
          this.pageTitle.showSuccessToast(response.message)
          this.teacher_form.reset();
          this.load_update_form()
          this.getTeacher()
          
          // window.location.reload();
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message)
          
          
        }
      })
    
    }
  }

  sunmit(){
    this.isUpdate = true;
    this.update_enseignant();
  }
  // ---------------------------------------go back button
  goBack(){
    window.history.back();
  }
 

toggle_toChageEdit(){
  this.isEdit =! this.isEdit
}
show_grade(){
  this.isAddGrade =! this.isAddGrade
}
exitConfirm(){
  this.isAddGrade = false
}

confirmer(idTeacher: number){
  this.enseignantService.desableTeacher(idTeacher!).subscribe({
    next: (response) => {
      this.pageTitle.showSuccessToast(response.message)
      this.teacher_form.reset();
      window.history.back();
    },
    error: (erreur) => {
      this.pageTitle.showErrorToast(erreur.error.message)
      
      
    }
  })
}

}
