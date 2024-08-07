import { Component, OnInit } from '@angular/core';
import { Teacher, TeachersStatus } from '../../Models/Teachers';
import { EnseiService } from '../../Views/enseignant/ensei.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';

@Component({
  selector: 'app-teachers-singin',
  templateUrl: './teachers-singin.component.html',
  styleUrl: './teachers-singin.component.css'
})
export class TeachersSinginComponent implements OnInit {

  teacher_form! : FormGroup
  fileName!: File
  teacherStatusOptions!: string[];
  passwordVisible : boolean = false

  constructor(private enseignantService: EnseiService, private pageTitle: PageTitleService,
    public icons: IconsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loa_teacher_form();
    
      
  }
  // -------------------------load teacher add form
  loa_teacher_form(){
    this.teacherStatusOptions = Object.values(TeachersStatus);
    this.teacher_form = this.fb.group({
      nom: ['',Validators.required],
      prenom: ['',Validators.required],
      email: ['', Validators.required],
      sexe: ["", Validators.required],
      password: ['', Validators.required],
      telephone: ['', Validators.required],
      urlPhoto: [''],
      // isDeleted: [''],
      status: ['',Validators.required]
    })
  }

  // -------------------------------
  
  onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }
  // --------------------------------password visible
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
}
  add_teacher(){
    const formData = this.teacher_form.value;

    const teacher: Teacher = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      password:  formData.password,
      telephone: formData.telephone,
      sexe: formData.sexe,
      status: formData.status
    }
    console.log(teacher, "teacher")
   //  return
    if(this.teacher_form.valid){
      this.enseignantService.create(teacher, this.fileName!).subscribe({
        next: (data) => {
          // this.current_enseignat_create = data
          
          this.pageTitle.showSuccessToast(data.message);
          this.teacher_form.reset();
          this.loa_teacher_form();
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.teacher_form.markAllAsTouched();
      console.log("Veuillez remplir tous les champs correctement!", this.teacher_form.value);
    }
    
   }

  //  -------------------------------back button
  goBack(){
    window.history.back();
  }
}
