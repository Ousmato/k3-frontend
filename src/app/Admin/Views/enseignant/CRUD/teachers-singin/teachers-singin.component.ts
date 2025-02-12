import { Component, OnInit } from '@angular/core';
import { Diplomes, Teacher, TeachersStatus } from '../../../../Models/Teachers';
import { EnseiService } from '../../ensei.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../../../Services/icons.service';
import { PageTitleService } from '../../../../../Services/page-title.service';
import { SetService } from '../../../settings/set.service';
import { Ue } from '../../../../Models/UE';
import { Filiere, Specialites } from '../../../../Models/Filieres';
import { Admin } from '../../../../Models/Admin';
import { AdminUSER } from '../../../../Models/Auth';
import { FiliereService } from '../../../../../Services/filiere.service';
import { SpecialiteService } from '../../../../../Services/specialite.service';
import { TeacherUtils } from '../../Utils/teacher-utils';

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

  constructor(private enseignantService: EnseiService, private pageTitle: PageTitleService, private filiereService: FiliereService,
    public icons: IconsService, private fb: FormBuilder, public teacherUtils: TeacherUtils) { }

  ngOnInit(): void {
    this.loa_teacher_form();
     this.teacherDiplomOptions = this.teacherUtils.getDiplomesOptions();
    this.admin = AdminUSER()?.der
    this.gradesOptions = this.teacherUtils.getGradesOptions();

  }
  // -------------------------load teacher add form
  loa_teacher_form() {
    this.teacherStatusOptions = Object.values(TeachersStatus);
    this.teacher_form = this.fb.group({
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

       
      this.enseignantService.create(teacher).subscribe({
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
