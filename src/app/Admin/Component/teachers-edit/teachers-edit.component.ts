import { Component, OnInit } from '@angular/core';
import { EnseiService } from '../../Views/enseignant/ensei.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../../Services/page-title.service';
import { IconsService } from '../../../Services/icons.service';
import { Teacher, TeachersStatus } from '../../Models/Teachers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teachers-edit',
  templateUrl: './teachers-edit.component.html',
  styleUrl: './teachers-edit.component.css'
})
export class TeachersEditComponent implements OnInit {

  enseignant! : Teacher 
  fileName!: File;
  photoSelect!: File
  urlImage! : string | ArrayBuffer
  teacher_form!: FormGroup
  passwordVisible : boolean = false
  idEnseignant!: number

  
  teacherStatusOptions!: string[];

  constructor(private enseignantService: EnseiService, private root: ActivatedRoute, private pageTitle: PageTitleService,
    public icons: IconsService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.load_update_form();
    this.getTeacher();
      
  }

  // ------------------------load form
  load_update_form(){
    this.teacher_form = this.fb.group({
      idEnseignant: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      sexe: ['', Validators.required],
      password: ['', Validators.required],
      telephone: ['', Validators.required],
      // urlPhoto: [''],
      // isDeleted: [enseignant.isDeleted],
      status: ['', Validators.required]
    })
   
  }
  // -----------------------------------------
  getTeacher(){
    this.teacherStatusOptions = Object.values(TeachersStatus);
    this.root.queryParams.subscribe(params => {
      this.idEnseignant = +params['id'];
      console.log(this.idEnseignant, "id----")
      this.enseignantService.getTeacher_by_id(this.idEnseignant).subscribe(
        {
          next : (response) =>{
            this.enseignant = response;
            console.log(this.enseignant, "ense")

            this.teacher_form.get('nom')?.setValue(this.enseignant.nom);
            this.teacher_form.get('idEnseignant')?.setValue(this.enseignant.idEnseignant);
            this.teacher_form.get('prenom')?.setValue(this.enseignant.prenom);
            this.teacher_form.get('email')?.setValue(this.enseignant.email);
            this.teacher_form.get('sexe')?.setValue(this.enseignant.sexe);
            this.teacher_form.get('telephone')?.setValue(this.enseignant.telephone);
          },
          error : (erreur) =>{
            this.pageTitle.showErrorToast(erreur.error.message)
          }
        }
      );
    });
   
  }

  // ---------------------------------update teacher

  onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }

  onPhotoSelected(event: any){
    
    console.log(this.fileName, "fill")
    this.photoSelect = event.target.files[0];
    // console.log(this.photoSelect, "photo select")
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.urlImage = e.target.result;
    };
    reader.readAsDataURL(this.photoSelect);
  }
  update_enseignant(){

    const formData = this.teacher_form.value
    const ensei = this.enseignant
    ensei!.idEnseignant = ensei?.idEnseignant;
    ensei!.nom = formData.nom;
    ensei!.prenom = formData.prenom;
    ensei!.email = formData.email;
    ensei!.sexe = formData.sexe;
    ensei!.telephone = formData.telephone;
    ensei!.status = formData.status;

  if(this.teacher_form.valid){
    this.enseignantService.updateTeacher(ensei!, this.photoSelect).subscribe({
      next: (response) => {
        console.log(response, "response")
        this.pageTitle.showSuccessToast(response.message)
        this.teacher_form.reset();
        // window.location.reload();
      },
      error: (erreur) => {
        this.pageTitle.showErrorToast(erreur.error.message)
        
        
      }
    })
  }else{
    this.teacher_form.markAllAsTouched();
    console.log('non valide', this.teacher_form.value);
  }
  
    
  }
  // ---------------------------------------go back button
  goBack(){
    window.history.back();
  }
  // -----------------------------------password visible
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
}
}
