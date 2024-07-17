import { Component, OnInit } from '@angular/core';
import { Teacher, TeachersStatus } from '../../Models/Teachers';
import { IconsService } from '../../../Services/icons.service';
import { EnseiService } from './ensei.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.css'
})
export class EnseignantComponent implements OnInit {
  enseignants: Teacher [] =[];
  dtOptions: any = {};
  teacher_form!: FormGroup;
  update_enseignant_form!: FormGroup

  current_enseignat_create!: Teacher;
  fileName!: File;
  photoSelect!: File
  urlImage! : string | ArrayBuffer
  teacherStatusOptions!: string[];

  constructor(public icons: IconsService, private enseignantService: EnseiService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.teacherStatusOptions = Object.values(TeachersStatus);
    this.teacher_form = this.fb.group({
      nom: [''],
      prenom: [''],
      email: [''],
      sexe: [""],
      password: [''],
      telephone: [''],
      urlPhoto: [''],
      // isDeleted: [''],
      status: ['']
    })

    this.load_enseignants();
   this. load_update_form()
  }

  load_enseignants(){
    this.enseignantService.getAll().subscribe(data =>{
      data.forEach((item: Teacher) => {
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
      });
      this.enseignants = data;
    })
    
  }
  // ------------------------------add enseignant form
  
  onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
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
    //  urlPhoto: formData.urlPhoto,
     // isDeleted: formData.isDeleted,
     status: formData.status
   }
   console.log(teacher, "teacher")
  //  return
   this.enseignantService.create(teacher, this.fileName!).subscribe(data => {
    this.current_enseignat_create = data;
    alert("Ajout effectuee avec succees!")
    this.teacher_form.reset();
    // reload this page
    window.location.reload();
   })
  }
  // --------------------------------------------------------update student
  getTeacher(enseignant: Teacher){
    this.update_enseignant_form.get('nom')?.setValue(enseignant.nom);
    this.update_enseignant_form.get('idEnseignant')?.setValue(enseignant.idEnseignant);
    this.update_enseignant_form.get('prenom')?.setValue(enseignant.prenom);
    this.update_enseignant_form.get('email')?.setValue(enseignant.email);
    this.update_enseignant_form.get('sexe')?.setValue(enseignant.sexe);
    this.update_enseignant_form.get('telephone')?.setValue(enseignant.telephone);
   this.update_enseignant_form.get('status')?.setValue(enseignant.status);
  }

  // ---------------------------------update teacher
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
  // -------------------------------- 
  load_update_form(){
    this.update_enseignant_form = this.fb.group({
      idEnseignant: [''],
      nom: [''],
      prenom: [''],
      email: [''],
      sexe: [''],
      password: [''],
      telephone: [''],
      urlPhoto: [''],
      // isDeleted: [enseignant.isDeleted],
      status: ['']
    })
   
  }
  // ----------------------------------------------load input value

  update_enseignant(enseignant: Teacher){
    const formData = this.update_enseignant_form.value
   const ensei = this.enseignants.find(e =>e.idEnseignant == enseignant.idEnseignant);
   ensei!.idEnseignant = ensei?.idEnseignant;
   ensei!.nom = formData.nom;
   ensei!.prenom = formData.prenom;
   ensei!.email = formData.email;
   ensei!.sexe = formData.sexe;
   ensei!.telephone = formData.telephone;
   ensei!.status = formData.status;
  //  console.log(ensei, "ensei", this.photoSelect)
  
   this.enseignantService.updateTeacher(ensei!, this.photoSelect).subscribe({
    next: (response) => {
      console.log(response, "response")
      alert("Mise à jour effectuée avec succès!")
      this.update_enseignant_form.reset();
      // window.location.reload();
    },
    error: (erreur) => {
      console.log("Error", erreur.error.message);
      alert("Erreur lors de la mise à jour!")
    }
    // complete: () => console.log('The operation is complete!')
   })
    
  }
}
