import { Component, OnInit } from '@angular/core';
import { Diplomes, Teacher, TeachersStatus } from '../../Models/Teachers';
import { EnseiService } from '../../Views/enseignant/ensei.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { SetService } from '../../Views/settings/set.service';
import { Ue } from '../../Models/UE';

@Component({
  selector: 'app-teachers-singin',
  templateUrl: './teachers-singin.component.html',
  styleUrl: './teachers-singin.component.css'
})
export class TeachersSinginComponent implements OnInit {

  teacher_form! : FormGroup
  fileName!: File
  teacherStatusOptions!: string[];
  teacherDiplomOptions : {key: string, value: string}[] =[]
  ueList : Ue[] = [];
  passwordVisible : boolean = false

  constructor(private enseignantService: EnseiService, private pageTitle: PageTitleService,
    public icons: IconsService, private fb: FormBuilder, private setService: SetService) { }

  ngOnInit(): void {
    this.loa_teacher_form();
    this.load_ues();
    this.getStatusOptions();
    
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
      // urlPhoto: [''],
      idUe: ['', Validators.required],
      diplome: ['', Validators.required],
      status: ['',Validators.required]
    })
  }

  // -----------------------load all ues
  load_ues(){
    this.setService.getAll_ue_all().subscribe(response =>{
      this.ueList = response;
    
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
    const ueSelect = this.ueList.find(ue => ue.id == formData.idUe)

    const teacher: Teacher = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      password:  formData.password,
      telephone: formData.telephone,
      idUe: ueSelect!,
      sexe: formData.sexe,
      status: formData.status,
      diplome: formData.diplome
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

  //  -------------------------------back button
  goBack(){
    window.history.back();
  }
}
