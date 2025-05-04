import { Component, inject, OnInit } from '@angular/core';
import { Diplomes, Teacher, TeachersStatus } from '../models/Teachers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filiere, Specialites } from '../../../Admin/Models/Filieres';
import { Admin } from '../../shared/models/Admin';
import { contructor_dependencies } from '../../dependencies/dependencies';
import { getUser } from '../../shared/models/auth';

@Component({
  selector: 'app-teachers-singin',
  templateUrl: './teachers-singin.component.html',
  styleUrl: './teachers-singin.component.css'
})
export class TeachersSinginComponent implements OnInit {

  teacher_form!: FormGroup
  fileName!: File
  teacherStatusOptions!: string[];
  teacherDiplomOptions: { key: string, value: string }[] = []
  gradesOptions: { key: string, value: string }[] = []
  specialites: Specialites[] = [];
  // filiereNumbers: number[] = [1];
  // listFilieresSelect: Filiere[] = []
  count: number = 1
  admin!: Admin
  passwordVisible: boolean = false

  public dependencies = inject(contructor_dependencies)
  ngOnInit(): void {
    this.loa_teacher_form();
     this.teacherDiplomOptions = this.dependencies.teacher_util.getDiplomesOptions();
    this.admin = getUser()
    this.gradesOptions = this.dependencies.teacher_util.getGradesOptions();

  }
  // -------------------------load teacher add form
  loa_teacher_form() {
    this.teacherStatusOptions = Object.values(TeachersStatus);
    this.teacher_form = this.dependencies.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      sexe: ["", Validators.required],
      password: ['', Validators.required],
      telephone: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      grade: ['', Validators.required],

      diplome: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

  // -------------------------------

  onFileSelected(event: any) {
    this.fileName = event.target.files[0];
  }
  // --------------------------------password visible
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  add_teacher() {
    
    // console.log(filiere, "filiere------------------")
    const formData = this.teacher_form.value;

    const teacher: Teacher = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      password: formData.password,
      telephone: formData.telephone,
      sexe: formData.sexe,
      status: formData.status,
      diplome: formData.diplome,
      dateNaissance: formData.dateNaissance,
      admin: this.admin
    }
    if (this.teacher_form.valid) {

       
      this.dependencies.teacherService.create(teacher).subscribe({
          next: (data) => {
            // this.current_enseignat_create = data

            this.dependencies.queryreturnMessage.showSuccessToast(data.message);
            this.teacher_form.reset();
            this.loa_teacher_form();
          
          },
          error: (erreur) => {
            this.dependencies.queryreturnMessage.showErrorToast(erreur.error.message);
          }
        })

    } else {
      this.teacher_form.markAllAsTouched();
      console.log("Veuillez remplir tous les champs correctement!", this.teacher_form.value);
    }

  }

  //  -------------------------------back button
  goBack() {
    window.history.back();
  }

}
