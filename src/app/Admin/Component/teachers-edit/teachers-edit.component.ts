import { Component, OnInit } from '@angular/core';
import { EnseiService } from '../../Views/enseignant/ensei.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../../Services/page-title.service';
import { IconsService } from '../../../Services/icons.service';
import { Diplomes, Teacher, TeachersStatus } from '../../Models/Teachers';
import { ActivatedRoute } from '@angular/router';
import { SetService } from '../../Views/settings/set.service';
import { Ue } from '../../Models/UE';

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
  ueList : Ue [] = []
  isEdit: boolean = false
  isUpdate: boolean = false

  
  teacherStatusOptions!: string[];
  teacherDiplomOptions: {key: string, value: string}[] = [];

  constructor(private enseignantService: EnseiService, private root: ActivatedRoute, private pageTitle: PageTitleService,
    public icons: IconsService, private fb: FormBuilder, private setService: SetService) { }


  ngOnInit(): void {
    this.load_update_form();
    this.getTeacher();
    this.load_ues();
    this.getStatusOptions();
      
  }

  // ------------------------load form
  load_update_form(){
    this.teacher_form = this.fb.group({
      idEnseignant: ['', Validators.required],
      
        nom: [''],
        prenom: [''],
        email: [''],
        sexe: [""],
        password: [''],
        telephone: [''],
        urlPhoto: [''],
        idUe: [''],
        diplome: [''],
        status: ['', Validators.required]
  
    })
   
  }
   // -----------------------load all ues
   load_ues(){
    this.setService.getAll_ue_all().subscribe(response =>{
      this.ueList = response;
    
    })
  
  }
  getStatusOptions() {
    const objet = Object.keys(Diplomes).map(key => ({
      
      key: key,
      value: Diplomes[key as keyof typeof Diplomes] 
    }));
    objet.forEach(o => {
      if(o.value != Diplomes.L1 && o.value != Diplomes.L2 ){
        this.teacherDiplomOptions.push(o)
      }
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
    if(this.isUpdate){
      const formData = this.teacher_form.value
      console.log(formData, "fomData");
      const idUe = this.ueList.find(ue =>ue.id == formData.idUe);

      const enseignant : Teacher ={
        idEnseignant: formData.idEnseignant,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        sexe: formData.sexe,
        telephone: formData.telephone,
        status: formData.status,
        idUe: idUe!,
        diplome: formData.diplome

        
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
  // -----------------------------------password visible
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
}

toggle_toChageEdit(){
  this.isEdit =! this.isEdit
}
}
